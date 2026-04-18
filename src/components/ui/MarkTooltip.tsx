import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { visit } from "unist-util-visit";
import { Root, Text } from "mdast";
import '@/assets/stylesheets/tooltip.scss';

interface TooltipNode {
  type: 'tooltip';
  data: {
    hName: 'tooltip';
    hProperties: {
      content: string | { src: string; alt: string };
      info: string;
    };
  };
}

function isImageUrl(str: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg)/i.test(str);
}

type TooltipPlacement = 'above' | 'below' | 'left' | 'right';

interface TooltipPosition {
  left: number;
  top: number;
  maxWidth: number;
  maxHeight: number;
  placement: TooltipPlacement;
}

function computeTooltipPositionFromMouse(mouseX: number, mouseY: number, viewportWidth: number, viewportHeight: number, imageSize: { width: number; height: number } | null): TooltipPosition {
  const computeMaxImageSize = (containerW: number, containerH: number) => {
    if (!imageSize) return { width: containerW, height: containerH, area: containerW * containerH };
    let imgW = Math.min(containerW, imageSize.width);
    let imgH = Math.round(imageSize.height * (imgW / imageSize.width));
    if (imgH > containerH) {
      imgH = containerH;
      imgW = Math.round(imageSize.width * (imgH / imageSize.height));
    }
    return { width: imgW, height: imgH, area: imgW * imgH };
  };

  const vertContainerW = viewportWidth;
  const vertContainerH = viewportHeight * 2 / 5;
  const vertSize = computeMaxImageSize(vertContainerW, vertContainerH);

  const horizContainerW = viewportWidth * 2 / 5;
  const horizContainerH = viewportHeight;
  const horizSize = computeMaxImageSize(horizContainerW, horizContainerH);

  const isVertical = vertSize.area >= horizSize.area;

  let placement: TooltipPlacement;
  let finalWidth: number;
  let finalHeight: number;
  let left: number;
  let top: number;

  if (isVertical) {
    placement = mouseY < viewportHeight / 2 ? 'below' : 'above';
    finalWidth = vertContainerW;
    finalHeight = vertContainerH;
    left = 0;
    top = placement === 'above' ? 0 : viewportHeight - finalHeight;
  } else {
    placement = mouseX < viewportWidth / 2 ? 'right' : 'left';
    finalWidth = horizContainerW;
    finalHeight = horizContainerH;
    top = 0;
    left = placement === 'left' ? 0 : viewportWidth - finalWidth;
  }

  return { left, top, maxWidth: finalWidth, maxHeight: finalHeight, placement };
}

export function remarkTooltip() {
  return (tree: Root) => {
    visit(tree, "text", (node, index, parent) => {
      const regex = /::tooltip\[(.*?),(.*?)\]/g;
      let match;

      if (!parent) return;

      const newNodes: (Text | TooltipNode)[] = [];
      let lastIndex = 0;

      while ((match = regex.exec(node.value)) !== null) {
        const [full, text, info] = match;
        let content: string | { src: string; alt: string } = text;
        if (isImageUrl(text)) { content = { src: text, alt: text }; }
        if (match.index > lastIndex) { newNodes.push({ type: "text", value: node.value.slice(lastIndex, match.index) } as Text); }
        newNodes.push({ type: "tooltip", data: { hName: "tooltip", hProperties: { content, info } } });
        lastIndex = match.index + full.length;
      }

      if (lastIndex < node.value.length) { newNodes.push({ type: "text", value: node.value.slice(lastIndex) } as Text); }

      if (newNodes.length > 0 && index !== undefined) {
        // @ts-expect-error Custom tooltip node type not recognized by mdast types
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}

export interface TooltipProps {
  content: string | { src: string; alt: string };
  info: string;
}

export function Tooltip({ content, info }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [isPinned, setIsPinned] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [pinnedPosition, setPinnedPosition] = useState<TooltipPosition | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isImageUrl(info)) {
      const img = new Image();
      img.onload = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
        setImageLoaded(true);
      };
      img.onerror = () => {
        setImageSize(null);
        setImageLoaded(true);
      };
      img.src = info;
    } else {
      setImageSize(null);
      setImageLoaded(true);
    }
  }, [info]);

  useEffect(() => {
    const handleTooltipShow = (e: CustomEvent) => {
      if (e.detail !== ref.current) {
        setVisible(false);
        setIsPinned(false);
        setPinnedPosition(null);
      }
    };
    document.addEventListener('tooltip-show', handleTooltipShow as EventListener);
    return () => document.removeEventListener('tooltip-show', handleTooltipShow as EventListener);
  }, []);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('tooltip-show', { detail: ref.current }));
      }, 0);
    }
  }, [visible]);

  useEffect(() => {
    const handleScroll = () => { setVisible(false); setIsPinned(false); setPinnedPosition(null); };
    const handleResize = () => { setVisible(false); setIsPinned(false); setPinnedPosition(null); };
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const getInitialTransform = (p: TooltipPlacement, w: number, h: number) => {
    switch (p) {
      case 'below': return `translateY(${0.1 * h}px)`;
      case 'above': return `translateY(-${0.1 * h}px)`;
      case 'left': return `translateX(-${0.1 * w}px)`;
      case 'right': return `translateX(${0.1 * w}px)`;
    }
  };

  const renderTooltip = () => {
    if (isImageUrl(info) && !imageLoaded) return null;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const position = isPinned && pinnedPosition
      ? pinnedPosition
      : mousePos
        ? computeTooltipPositionFromMouse(mousePos.x, mousePos.y, viewportWidth, viewportHeight, imageSize)
        : null;

    if (!position) return null;

    const { left, top, maxWidth, maxHeight, placement } = position;
    const transform = visible ? undefined : getInitialTransform(placement, maxWidth, maxHeight);

    return createPortal(
      <div
        ref={tooltipRef}
        className={`tooltip${visible ? ' visible' : ''} ${placement}`}
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width: `${maxWidth}px`,
          height: `${maxHeight}px`,
          ...(transform ? { transform } : {}),
        }}
      >
        {isImageUrl(info) ? (
          <img src={info} alt="Tooltip" style={{ display: 'block', width: '100%', height: '100%', objectFit: 'scale-down' }} />
        ) : (
          <span>{info}</span>
        )}
      </div>,
      document.body,
    );
  };

  return (
    <span
      ref={ref}
      className="tooltip-trigger"
      onMouseEnter={() => setVisible(true)}
      onMouseMove={(e) => { if (!isPinned) setMousePos({ x: e.clientX, y: e.clientY }); }}
      onMouseLeave={() => { if (!isPinned) setVisible(false); }}
      onClick={() => {
        if (!isPinned && mousePos) {
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;
          setPinnedPosition(computeTooltipPositionFromMouse(mousePos.x, mousePos.y, viewportWidth, viewportHeight, imageSize));
        }
        if (isPinned) setPinnedPosition(null);
        setIsPinned(!isPinned);
        setVisible(isPinned ? false : true);
      }}
    >
      {typeof content === 'string' ? (
        <span>{content}</span>
      ) : (
        <img src={content.src} alt={content.alt} className="tooltip-trigger__img" />
      )}
      {renderTooltip()}
    </span>
  );
}

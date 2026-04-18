import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { remarkTooltip, Tooltip } from './MarkTooltip'

type Props = {
  children: string
}

interface TooltipComponentProps {
  content: string | { src: string; alt: string };
  info: string;
}

const components = {
  tooltip: (props: TooltipComponentProps) => {
    return <Tooltip content={props.content} info={props.info} />;
  },
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  ),
}

export default function Markdowner(props: Props) {
  const { children } = props

  return (
    <ReactMarkdown remarkPlugins={[remarkTooltip]} rehypePlugins={[rehypeRaw]} components={components}>
      {children}
    </ReactMarkdown>
  )
}

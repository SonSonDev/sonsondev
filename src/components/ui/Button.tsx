'use client'

import Link from 'next/link'
import '@/assets/stylesheets/button.scss'

type BaseProps = {
  variant?: 'primary' | 'ghost' | 'danger'
  children: React.ReactNode
  className?: string
  'aria-label'?: string
}

type AsButton = BaseProps & {
  as?: 'button'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  onClick?: () => void
}

type AsLink = BaseProps & {
  as: 'link'
  to: string
}

type AsAnchor = BaseProps & {
  as: 'a'
  href: string
  target?: string
  rel?: string
}

type Props = AsButton | AsLink | AsAnchor

export default function Button(props: Props) {
  const { variant = 'primary', children, className, 'aria-label': ariaLabel } = props
  const cls = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ')

  if (props.as === 'link') {
    return <Link className={cls} href={props.to} aria-label={ariaLabel}>{children}</Link>
  }

  if (props.as === 'a') {
    return (
      <a className={cls} href={props.href} target={props.target} rel={props.rel} aria-label={ariaLabel}>
        {children}
      </a>
    )
  }

  return (
    <button
      className={cls}
      type={props.type ?? 'button'}
      disabled={props.disabled}
      onClick={props.onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  )
}

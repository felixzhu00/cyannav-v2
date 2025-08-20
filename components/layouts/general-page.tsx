import Link from 'next/link'
import { ReactNode } from 'react'

type GeneralPageProps = {
  title: string
  message: string
  children?: ReactNode
}

export default function GeneralPage({
  title,
  message,
  children,
}: GeneralPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center text-foreground">
      <h1 className="mb-4 text-5xl font-bold">{title}</h1>
      <p className="mb-6 text-lg text-muted-foreground">{message}</p>
      <Link
        href="/"
        className="hover:text-primary-foreground text-chart-2 text-primary underline pb-8"
      >
        Go back home
      </Link>
      {children}
    </div>
  )
}

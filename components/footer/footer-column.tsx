// components/FooterColumn.tsx
'use client'

import Link from 'next/link'
import React from 'react'

interface FooterColumnProps {
    title: string
    links?: { label: string; href: string }[]
    children?: React.ReactNode
    className?: string
}

export const FooterColumn: React.FC<FooterColumnProps> = ({
    title,
    links,
    children,
    className = '',
}) => (
    <div className={`flex flex-col space-y-5 text-sm ${className}`}>
        <h6 className="font-bold text-base">{title}</h6>
        {links?.map(({ label, href }) => (
            <Link key={href} href={href} legacyBehavior passHref>
                {label}
            </Link>
        ))}
        {children}
    </div>
)

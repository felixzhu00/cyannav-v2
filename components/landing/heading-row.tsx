import React from 'react'

interface HeadingRowProps {
    heading: string
    subheading: string
}

const HeadingRow: React.FC<HeadingRowProps> = ({ heading, subheading }) => {
    return (
        <div className="flex w-full flex-col items-center justify-center space-y-2 lg:flex-row lg:items-end lg:justify-between lg:space-y-0 h-full text-center lg:text-left">
            <h1 className="flex-grow text-4xl font-bold">{heading}</h1>
            <p className="text-2xl opacity-50 hidden lg:block">{subheading}</p>
        </div>
    )
}

export default HeadingRow

import React, { useEffect, useState } from 'react'

interface BufferImageProps {
  buffer: Buffer | undefined
  alt?: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
}

const BufferImage: React.FC<BufferImageProps> = ({
  buffer,
  alt = '',
  width,
  height,
  className,
  style,
}) => {
  const realBuffer =
    buffer && Buffer.isBuffer(buffer)
      ? buffer
      : Buffer.from((buffer as any)?.data ?? [])

  const url = realBuffer?.length
    ? `data:image/png;base64,${realBuffer.toString('base64')}`
    : '/map_placeholder.png'
  return (
    <img
      src={url}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  )
}

export default BufferImage

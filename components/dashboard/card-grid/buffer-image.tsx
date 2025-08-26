'use client'

import React, { useEffect, useState } from 'react'
import { CustomFeatureCollection } from '@/core/_entities/types/map.types'
import { genImageBuffer, handleThumbnail } from '@/lib/generate-image'

interface BufferImageProps {
  id: string
  geojson: CustomFeatureCollection
  buffer: Buffer | undefined
  alt?: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
}
const BufferImage: React.FC<BufferImageProps> = ({
  id,
  geojson,
  buffer,
  alt = '',
  width,
  height,
  className,
  style,
}) => {
  const [url, setUrl] = useState<string>('/map_placeholder.png')

  useEffect(() => {
    const generateImage = async () => {
      // Display current thumbnail in map
      let realBuffer =
        buffer && Buffer.isBuffer(buffer)
          ? buffer
          : Buffer.from((buffer as any)?.data ?? [])

      // If thumbnail does not exist, create one
      if (!realBuffer?.length) {
        try {
          // Generate buffer from geojson
          realBuffer = await genImageBuffer(geojson)

          // If realBuffer return success, API call to update thumbnail image
          const response = await fetch(`/api/map/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ thumbnail: realBuffer }),
          })
        } catch (err) {
          console.error('Error generating thumbnail:', err)
        }
      }

      // Convert Buffer to url to be displayed
      const base64 = realBuffer.toString('base64')
      setUrl(`data:image/png;base64,${base64}`)
    }

    generateImage()
  }, [])

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

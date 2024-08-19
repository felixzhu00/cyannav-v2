'use client'

import Link from 'next/link'
import { featureMap } from '@/lib/const'
import ThemeToggle from '@/components/theme-toggle'

type Item = {
  name: string
  description: string
  [key: string]: any // Allow any additional properties
}

export default function Home() {
  const headers = Object.keys(featureMap[0] || {}).filter(
    (header) => header !== 'component'
  )

  return (
    <div className="container mx-auto">
      <ThemeToggle />
      <h1 className="mb-4 text-2xl font-bold">Map List</h1>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Link</th>

            {headers.map((header) => (
              <th key={header} className="px-4 py-2">
                {header.charAt(0).toUpperCase() + header.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {featureMap.map((item: Item, index: number) => (
            <tr key={item.name}>
              <td className="border px-4 py-2 text-center">
                <Link
                  href={`/map/${index}`}
                  className="text-blue-500 hover:underline"
                >
                  Map {index}
                </Link>
              </td>
              {headers.map((header) => (
                <td key={header} className="border px-4 py-2">
                  {item[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import logo from '@/public/logo.svg'

export default function Logo() {
  return (
    <Link href="/" passHref className="flex items-center space-x-2 min-w-max">
      <Image
        src={logo}
        alt="Logo"
        className="h-[65px] w-[65px] object-contain"
        priority
      />
      <h1 className="text-2xl font-extrabold tracking-widest">CYANNAV</h1>
    </Link>
  )
}

import Image from "next/image"
import Link from "next/link"

const NavbarLogo = () => {
  return (
    <Link href="/" className="flex-shrink-0 mx-auto">
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16">
        <Image 
          src="/assets/logo.jpg"
          alt="Relot Logo"
          fill
          className="object-contain"
          unoptimized
        />
      </div>
    </Link>
  )
}

export default NavbarLogo

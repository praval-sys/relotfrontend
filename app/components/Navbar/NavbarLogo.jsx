import Image from "next/image"
import Link from "next/link"

const NavbarLogo = () => {
  return (
    <Link href="/" className="flex-shrink-0">
      <div className="font-bold text-3xl flex items-center">
        <Image 
          src="/assets/logo.jpeg"
          alt="Relot Logo"
          width={100}
          height={100}
          className="mr-2"
          unoptimized
        />
      </div>
    </Link>
  )
}

export default NavbarLogo

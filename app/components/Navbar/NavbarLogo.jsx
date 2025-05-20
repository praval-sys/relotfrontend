import Link from "next/link"

const NavbarLogo = () => {
  return (
    <Link href="/" className="flex-shrink-0">
      <div className="font-bold text-3xl flex items-center">
        <span>RE</span>
        <span className="bg-red-600 text-white px-2">LOT</span>
      </div>
    </Link>
  )
}

export default NavbarLogo

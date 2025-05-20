import Link from "next/link"

export function SocialIcon({ href, icon, platform }) {
  return (
    <Link
      href={href}
      target="_blank"
      aria-label={`Visit our ${platform} page`}
      className="hover:text-red-200 transition-colors duration-200"
    >
      {icon}
    </Link>
  )
}

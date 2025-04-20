'use client';

import Image from 'next/image';
import Link from 'next/link';

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";
import { MdLocationOn, MdEmail, MdCall } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-purple-600 text-white px-6 md:px-16 py-10 position-sticky">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Logo and Description */}
        <div>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Relot Logo"
              width={128}
              height={32}
              className="mb-4"
            />
          </Link>
          <h2 className="font-bold text-lg mb-2">Relot – Your Trusted Online Store</h2>
          <p className="text-sm">
            Enjoy a seamless shopping experience as you browse through our various collection,
            and find the ideal accessories that reflect your style. Transform your outfit
            with our fashionable offerings today.
          </p>
        </div>

        {/* Information */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Information</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/login">About</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/faqs">FAQ's</Link></li>
            <li className="flex justify-between"><Link href="#">House of relot 1</Link> <span>+</span></li>
            <li className="flex justify-between"><Link href="#">Online Shopping</Link> <span>+</span></li>
            <li className="flex justify-between"><Link href="#">Customer account</Link> <span>+</span></li>
            <li className="flex justify-between"><Link href="#">Products</Link> <span>+</span></li>
          </ul>
        </div>

        {/* Quick Shop */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Quick Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shop">New Arrivals</Link></li>
            <li><Link href="/shop">Best Sellers</Link></li>
            <li><Link href="/shop">Sale</Link></li>
            <li><Link href="/shop">Accessories</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Contact Us</h3>
          <div className="flex items-start gap-2 mb-2 text-sm">
            <MdLocationOn className="text-xl mt-1" />
            <p>Suman enclave plot No. 07 pin code <br />-202414 . India</p>
          </div>
          <div className="flex items-center gap-2 mb-2 text-sm">
            <MdEmail className="text-xl" />
            <p>Relot2025@gmail.com</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MdCall className="text-xl" />
            <p>+91-XXXXXXX</p>
          </div>

          <h3 className="font-semibold text-lg mt-6 mb-2">Social links -</h3>
          <div className="flex gap-4 text-xl">
            <Link href="https://facebook.com" target="_blank"><FaFacebookF /></Link>
            <Link href="https://youtube.com" target="_blank"><FaYoutube /></Link>
            <Link href="https://instagram.com" target="_blank"><FaInstagram /></Link>
            <Link href="https://linkedin.com" target="_blank"><FaLinkedinIn /></Link>
            <Link href="https://twitter.com" target="_blank"><FaTwitter /></Link>
            <Link href="https://pinterest.com" target="_blank"><FaPinterestP /></Link>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white mt-8 pt-4 text-center text-sm">
        © 2025 Relot. All Rights Reserved.
      </div>
    </footer>
  );
}

// components/ProductCategories.jsx
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    href: '/handbags',
    imgSrc: 'https://relot.in/wp-content/uploads/2025/02/llop.png',
    title: "Women's Handbags",
    width: 417,
    height: 626,
  },
  {
    href: '/wallets-and-small-leather-goods',
    imgSrc: 'https://relot.in/wp-content/uploads/2025/02/am.avif',
    title: "Women's Wallet and Small Leather Good",
    width: 417,
    height: 626,
  },
  {
    href: '/bags',
    imgSrc: 'https://relot.in/wp-content/uploads/2025/02/sdf.avif',
    title: "Men's Bags",
    width: 417,
    height: 626,
  },
  {
    href: '/wallets-and-small-leather-goods',
    imgSrc: 'https://relot.in/wp-content/uploads/2025/02/sdc.avif',
    title: "Men's Wallet and Small Leather Good",
    width: 418,
    height: 626,
  },
];

export default function ProductCategories() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-12">
      {categories.map((item, idx) => (
        <Link key={idx} href={item.href} className="text-center hover:scale-105 transition-transform duration-300">
          <div>
            <Image
              src={item.imgSrc}
              alt={item.title}
              width={item.width}
              height={item.height}
              className="mx-auto rounded-lg shadow"
            />
            <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}

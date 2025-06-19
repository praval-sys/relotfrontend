// components/ProductCategories.jsx
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  {
    href: '/handbags',
    imgSrc: '/images/relot front page img 13-6/1st setion women_s bag.png',
    title: "Women's Handbags",
    width: 417,
    height: 626,
  },
  {
    href: '/wallets-and-small-leather-goods',
    imgSrc: '/images/relot front page img 13-6/Women_s Wallet and Small Leather Good.avif',
    title: "Women's Wallet and Small Leather Good",
    width: 417,
    height: 626,
  },
  {
    href: '/bags',
    imgSrc: '/images/relot front page img 13-6/men-handbbag (1).avif',
    title: "Men's Bags",
    width: 417,
    height: 626,
  },
  {
    href: '/wallets-and-small-leather-goods',
    imgSrc: '/images/relot front page img 13-6/Men_s Wallet and Small Leather Good.avif',
    title: "Men's Wallet and Small Leather Good",
    width: 417,
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

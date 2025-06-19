import Link from "next/link"

export default function CategoryBanners() {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Women Handbag Section */}
        <div className="relative h-[70vh] rounded-xl overflow-hidden group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{
              backgroundImage: `url("/images/relot front page img 13-6/womenbags hero.jpg")`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-end p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Women Handbag</h2>
            <Link
              href="#"
              className="inline-block bg-white text-black py-2 px-6 rounded-full hover:bg-gray-200 transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
        </div>

        {/* Men Bag Section */}
        <div className="relative h-[70vh] rounded-xl overflow-hidden group">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{
              backgroundImage: `url("/images/relot front page img 13-6/men-handbbag (1).avif")`,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col items-center justify-end p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Men Bag</h2>
            <Link
              href="#"
              className="inline-block bg-white text-black py-2 px-6 rounded-full hover:bg-gray-200 transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

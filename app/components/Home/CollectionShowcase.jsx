export default function CollectionShowcase() {
  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <h2 className="text-3xl font-bold tracking-wide text-neutral-900">RELOT COLLECTION</h2>
      </div>

      {/* First Showcase Image */}
      <div className="container mx-auto px-4">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-lg shadow-md">
          <div
            className="w-full h-full bg-cover bg-center transform transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: `url("https://relot.in/wp-content/uploads/2025/02/mn.jpg")`,
            }}
          ></div>
        </div>
      </div>

      {/* Second Showcase Image */}
      <div className="container mx-auto px-4 mt-8">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-lg shadow-md">
          <div
            className="w-full h-full bg-cover bg-center transform transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: `url("https://relot.in/wp-content/uploads/2025/02/wmdcd.jpg")`,
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

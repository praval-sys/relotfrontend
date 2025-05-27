export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          About RELOT
        </h1>
        
        <div className="space-y-8 text-gray-600">
          <section className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-lg leading-relaxed mb-6">
              Discover our exclusive collection of stylish bags, purses, belts, shoes, and hand watches 
              designed for both men and women. Each piece is crafted with attention to detail, ensuring 
              that you find the perfect accessory to complete your wardrobe. Our selection combines 
              functionality with versatility in fashion, making it easy to elevate your everyday look.
            </p>
          </section>

          <section className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-lg leading-relaxed mb-6">
              Explore a variety of designs that needs to diverse tastes and occasions. From small 
              handbags to durable footwear, our products are made from high-quality materials that 
              promise longevity and style. Whether you're dressing up for a special event or looking 
              for everyday essentials, our range has something for everyone. Shop with confidence 
              knowing that our commitment to quality and durability of our products and customer 
              satisfaction sets us apart.
            </p>
          </section>

          <section className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-lg leading-relaxed">
              Enjoy a seamless shopping experience as you browse through our various collection, and 
              find the ideal accessories that reflect your style. Transform your outfit with our 
              fashionable offerings today.
            </p>
          </section>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
            <p className="text-gray-600">Premium materials and craftsmanship</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Style</h3>
            <p className="text-gray-600">Contemporary designs for every occasion</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Service</h3>
            <p className="text-gray-600">Committed to customer satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
}
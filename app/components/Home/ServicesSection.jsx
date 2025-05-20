import Image from "next/image"



export default function ServicesSection({ services }) {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold uppercase tracking-wide text-neutral-900">RELOT SERVICES</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <a
            key={index}
            href={service.link}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
          >
            <div className="w-full h-64 relative">
              <Image
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                fill
                className="object-cover rounded-t-2xl"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-neutral-900">{service.title}</h3>
              <p className="text-neutral-600 text-sm">{service.description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

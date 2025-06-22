"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Services data based on navbar structure
const servicesData = [
	{
		title: "Personalisation",
		description:
			"Make your product uniquely yours with our personalization services. Add monograms, custom text, or special engravings.",
		image: "/images/relot front page img 13-6/Personalization.avif",
		link: "/products/?search=personalisation&tags=service",
		icon: "✨",
		badge: "Popular",
	},
	{
		title: "Relot Repairs",
		description:
			"Expert repair services to restore your beloved items. Professional craftsmanship with authentic materials.",
		image: "/images/relot front page img 13-6/Relot Repairs.avif",
		link: "/products/?search=repairs&tags=service",
		icon: "🔧",
		badge: "Expert",
	},
	{
		title: "Art of Gifting",
		description:
			"Discover the perfect gift with our curated selection and premium gift wrapping services for special occasions.",
		image: "/images/relot front page img 13-6/art of gifting.avif",
		link: "/products/?search=gifting&tags=service",
		icon: "🎁",
		badge: "Premium",
	},
]

export default function ServicesSection({ services = servicesData }) {
	const [hoveredIndex, setHoveredIndex] = useState(null)

	return (
		<section className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
				{/* Enhanced Section Header */}
				<div className="text-center mb-16">
					<div className="inline-flex items-center gap-3 mb-6">
						<div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-red-500"></div>
						<span className="text-red-600 font-semibold text-lg tracking-wider uppercase">
							Excellence in Service
						</span>
						<div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-red-500"></div>
					</div>
					<h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
						RELOT{" "}
						<span className="text-red-600" style={{ fontVariant: "small-caps" }}>
							SERVICES
						</span>
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Experience our premium services designed to enhance your luxury shopping
						journey
					</p>
				</div>

				{/* Enhanced Services Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
					{services.map((service, index) => (
						<Link
							key={index}
							href={service.link}
							className="group block"
							onMouseEnter={() => setHoveredIndex(index)}
							onMouseLeave={() => setHoveredIndex(null)}
						>
							<div className="relative bg-white rounded-3xl shadow-lg overflow-hidden h-full transition-all duration-500 transform group-hover:-translate-y-3 group-hover:shadow-2xl">
								{/* Image Container with Overlay */}
								<div className="relative w-full h-72 overflow-hidden">
									<Image
										src={service.image || "/placeholder.svg"}
										alt={service.title}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className={`object-cover transition-all duration-700 ${
											hoveredIndex === index
												? "scale-110 brightness-110"
												: "scale-100 brightness-100"
										}`}
										unoptimized
									/>

									{/* Red Gradient Overlay */}
									<div
										className={`absolute inset-0 transition-all duration-500 ${
											hoveredIndex === index
												? "bg-gradient-to-t from-red-900/70 via-red-600/30 to-transparent"
												: "bg-gradient-to-t from-black/30 via-transparent to-transparent"
										}`}
									/>

									{/* Service Icon */}
									<div
										className={`absolute top-6 left-6 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center transition-all duration-500 ${
											hoveredIndex === index
												? "scale-110 bg-red-500"
												: "scale-100"
										}`}
									>
										<span
											className={`text-2xl transition-all duration-300 ${
												hoveredIndex === index
													? "text-white"
													: "text-red-500"
											}`}
										>
											{service.icon}
										</span>
									</div>

									{/* Badge */}
									<div className="absolute top-6 right-6">
										<span
											className={`inline-block px-4 py-2 rounded-full text-sm font-bold transition-all duration-500 ${
												hoveredIndex === index
													? "bg-red-500 text-white shadow-lg scale-110"
													: "bg-white/90 text-red-600 backdrop-blur-sm"
											}`}
										>
											{service.badge}
										</span>
									</div>

									{/* Hover Button */}
									<div
										className={`absolute bottom-6 left-6 right-6 transition-all duration-500 transform ${
											hoveredIndex === index
												? "translate-y-0 opacity-100"
												: "translate-y-4 opacity-0"
										}`}
									>
										<div className="bg-white/95 backdrop-blur-sm rounded-xl px-6 py-3 flex items-center justify-between">
											<span className="text-red-600 font-bold">Learn More</span>
											<svg
												className="w-5 h-5 text-red-600 transform group-hover:translate-x-1 transition-transform duration-300"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M17 8l4 4m0 0l-4 4m4-4H3"
												/>
											</svg>
										</div>
									</div>
								</div>

								{/* Enhanced Content Section */}
								<div className="p-8">
									<div className="flex items-start justify-between mb-4">
										<h3
											className={`text-2xl font-bold transition-colors duration-300 ${
												hoveredIndex === index
													? "text-red-600"
													: "text-gray-900"
											}`}
										>
											{service.title}
										</h3>
										<div
											className={`transform transition-all duration-500 ${
												hoveredIndex === index
													? "rotate-12 scale-110"
													: "rotate-0 scale-100"
											}`}
										>
											<svg
												className="w-6 h-6 text-red-500"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M13 10V3L4 14h7v7l9-11h-7z"
												/>
											</svg>
										</div>
									</div>

									<p className="text-gray-600 leading-relaxed mb-6">
										{service.description}
									</p>

									{/* Action Button */}
									<div
										className={`flex items-center gap-3 text-red-600 font-semibold transition-all duration-300 ${
											hoveredIndex === index
												? "text-red-700"
												: "text-red-600"
										}`}
									>
										<span>Explore Service</span>
										<svg
											className={`w-5 h-5 transition-transform duration-300 ${
												hoveredIndex === index
													? "translate-x-2"
													: "translate-x-0"
											}`}
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17 8l4 4m0 0l-4 4m4-4H3"
											/>
										</svg>
									</div>
								</div>

								{/* Red Border on Hover */}
								<div
									className={`absolute inset-0 rounded-3xl border-4 transition-all duration-500 pointer-events-none ${
										hoveredIndex === index
											? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
											: "border-transparent"
									}`}
								/>

								{/* Glow Effect */}
								<div
									className={`absolute inset-0 rounded-3xl transition-all duration-700 -z-10 ${
										hoveredIndex === index
											? "bg-gradient-to-br from-red-500/20 via-transparent to-red-500/20 blur-xl scale-110"
											: "bg-transparent"
									}`}
								/>
							</div>
						</Link>
					))}
				</div>

				{/* Enhanced Call-to-Action */}
				<div className="mt-20 text-center">
					<div className="bg-gradient-to-r from-red-50 via-white to-red-50 rounded-3xl p-10 border border-red-100 shadow-lg">
						<div className="max-w-4xl mx-auto">
							<h3 className="text-3xl font-bold text-gray-900 mb-6">
								Need Something{" "}
								<span className="text-red-600" style={{ fontVariant: "small-caps" }}>
									Special?
								</span>
							</h3>
							<p className="text-xl text-gray-600 mb-8">
								Can't find what you're looking for? Our expert team is here to help
								with custom solutions and personalized services tailored to your
								unique needs.
							</p>

							<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
								<Link
									href="/contact"
									className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold px-8 py-4 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
								>
									<span>Contact Our Experts</span>
									<svg
										className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 8l4 4m0 0l-4 4m4-4H3"
										/>
									</svg>
								</Link>

								<Link
									href="/products/?category=services"
									className="inline-flex items-center gap-3 bg-white text-red-600 font-bold px-8 py-4 rounded-full border-2 border-red-600 hover:bg-red-50 transition-all duration-300 transform hover:scale-105 group"
								>
									<span>View All Services</span>
									<svg
										className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
										/>
									</svg>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

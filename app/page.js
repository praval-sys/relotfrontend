"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { SET_CART_ITEMS } from "./redux/types"
import { AddWish } from "./redux/reducer/wishSlice"
import api from "./lib/api"

// Components
import HeroSlider from "./components/Home/HeroSlider"
import BestSeller from "./components/Product/Bestsellers"
import Testimonial from "./components/Testimonial"
import CollectionShowcase from "./components/Home/CollectionShowcase"
import ProductCategories from "./components/ProductCategories"
import TrendingProducts from "./components/Product/TrendingProdcuts"
import CategoryBanners from "./components/Home/CategoryBanners"
import ServicesSection from "./components/Home/ServicesSection"

// Data
import { heroData, servicesData } from "../data/homeData"


export default function Home() {
  const dispatch = useDispatch()

  const fetchProducts = async () => {
    try {
      const res = await api.get("/v1/")
      dispatch({
        type: SET_CART_ITEMS,
        payload: res.data.data.items,
      })
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchWishProducts = async () => {
    try {
      const res = await api.get("/v1/wish")
      const items = res.data?.data?.items || []
      dispatch(AddWish(items))
    } catch (error) {
      console.error("Error fetching wish products:", error)
    }
  }

  useEffect(() => {
    fetchWishProducts()
    fetchProducts()
  }, [dispatch])

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="w-full">
        <HeroSlider data={heroData} />
      </section>

      {/* Best Sellers */}
      <section className="py-8 sm:py-12 md:py-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <BestSeller />
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-10 md:py-12 bg-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Testimonial />
        </div>
      </section>

      {/* Collection Showcase */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CollectionShowcase />
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ProductCategories />
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TrendingProducts />
        </div>
      </section>

      {/* Category Banners */}
      <section className="py-8 sm:py-10 md:py-12 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryBanners />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ServicesSection services={servicesData} />
        </div>
      </section>
    </div>
  )
}

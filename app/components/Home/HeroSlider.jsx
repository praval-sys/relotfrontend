"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, EffectFade } from "swiper/modules"
import { Button } from "../ui/Button"
import "swiper/css"
import "swiper/css/effect-fade"

export default function HeroSlider({ data }) {
  return (
    <div className="relative w-full min-h-[60vh] md:h-[100vh] text-white">
      {/* Background Slideshow */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        className="absolute inset-0 w-full h-full z-0"
      >
        {data.images.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${url})`,
                height: '100%',
                paddingTop: '56.25%' // 16:9 Aspect Ratio for mobile
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/40 px-4 md:px-6 py-8 md:py-0 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-6xl font-bold max-w-3xl leading-tight">
          {data.title}
        </h2>
        <p className="text-base sm:text-lg md:text-xl mt-3 md:mt-4 max-w-2xl px-4">
          {data.subtitle}
        </p>
        <Button
          href={data.ctaLink}
          size="lg"
          variant="primary"
          rounded="full"
          className="mt-6 md:mt-8 bg-white text-black hover:bg-gray-100 
                     px-6 py-3 md:px-8 md:py-6 
                     text-base md:text-lg font-medium
                     w-auto mx-4"
        >
          {data.ctaText}
        </Button>
      </div>
    </div>
  )
}

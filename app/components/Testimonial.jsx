// 'use client';

// import Slider from 'react-slick';
// import Image from 'next/image';

// const testimonials = [
//   {
//     name: 'Mark Wilson',
//     job: 'Apple Manager',
//     title: 'Easy To Use',
//     rating: 4,
//     content:
//       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur laoreet cursus volutpat. Aliquam sit amet ligula et justo tincidunt laoreet non vitae lorem.',
//     date: '5 Months Ago',
//     image: 'https://relot.in/wp-content/plugins/elementor/assets/images/placeholder.png',
//   },
//   // Add more testimonials as needed...
// ];

// const TestimonialCarousel = () => {
//   const settings = {
//     dots: true,
//     arrows: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 2,
//     slidesToScroll: 2,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="py-12 bg-white text-black">
//       <div className="max-w-7xl mx-auto px-4">
//         <Slider {...settings}>
//           {testimonials.map((item, i) => (
//             <div key={i} className="p-6">
//               <div className="bg-gray-100 p-6 rounded-xl shadow-md h-full flex flex-col justify-between">
//                 <div>
//                   <div className="flex justify-center">

//                   </div>
//                   <h3 className="text-xl font-semibold text-center mt-4">{item.name}</h3>
//                   <p className="text-sm text-center text-gray-500">{item.job}</p>
//                   <div className="text-center text-yellow-400 mt-2">
//                     {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
//                   </div>
//                   <h4 className="text-lg font-medium text-center mt-4">{item.title}</h4>
//                   <p className="text-sm text-center text-gray-700 mt-2">{item.content}</p>
//                 </div>
//                 <p className="text-xs text-gray-500 text-center mt-6">{item.date}</p>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </div>
//   );
// };

// export default TestimonialCarousel;

// // 'use client';

// // import Slider from 'react-slick';
// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";

// // const Testimonial = () => {
// //   const settings = {
// //     dots: true,
// //     infinite: true,
// //     speed: 500,
// //     arrows: true,
// //     slidesToShow: 1,
// //     slidesToScroll: 1,
// //   };

// //   return (
// //     <div className="max-w-2xl mx-auto py-10">
// //       <Slider {...settings}>
// //         <div>
// //           <div className="bg-gray-100 p-6 rounded-lg shadow text-center">
// //             <p>“Relot is my favorite leather brand. Love the quality!”</p>
// //             <h4 className="mt-4 font-semibold">— Mark Wilson</h4>
// //           </div>
// //         </div>
// //         <div>
// //           <div className="bg-gray-100 p-6 rounded-lg shadow text-center">
// //             <p>“Stylish and built to last. Worth every rupee.”</p>
// //             <h4 className="mt-4 font-semibold">— Aditi Sharma</h4>
// //           </div>
// //         </div>
// //       </Slider>
// //     </div>
// //   );
// // };

// // export default Testimonial;

"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Testimonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Slider {...settings}>
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center space-y-6">
            <p className="text-lg italic text-gray-700 leading-relaxed">
              “Relot is my favorite leather brand. The craftsmanship and
              attention to detail are just unmatched. I’ve been using my Relot
              bag daily for over a year and it still looks brand new.”
            </p>
            <div>
              <h4 className="text-md font-semibold text-gray-800">
                — Mark Wilson
              </h4>
              <span className="text-sm text-gray-500">
                Product Manager, Apple
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center space-y-6">
            <p className="text-lg italic text-gray-700 leading-relaxed">
              “Stylish, durable, and incredibly comfortable to carry. I bought a
              Relot wallet and I can’t stop recommending it to everyone. Totally
              worth every rupee spent!”
            </p>
            <div>
              <h4 className="text-md font-semibold text-gray-800">
                — Aditi Sharma
              </h4>
              <span className="text-sm text-gray-500">
                Fashion Blogger, Delhi
              </span>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Testimonial;

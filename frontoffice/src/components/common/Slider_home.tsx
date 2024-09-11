{/* Slider Section */}

import React from 'react';
import Slider from 'react-slick';
import image1 from '../../assets/header.png';
const SliderHome: React.FC = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
      };
 return (
 
 <div className="relative h-screen">
<Slider {...settings}>
  <div>
    <img
      src={image1}
      alt="Model 1"
      className="w-full h-full object-cover"
    />
  </div>
  <div>
    <img
      src={image1}
      alt="Model 2"
      className="w-full h-full object-cover"
    />
  </div>
  <div>
    <img
      src={image1}
      alt="Model 3"
      className="w-full h-full object-cover"
    />
  </div>
</Slider>
<div className="absolute bottom-8 left-4">
  <h1 className="text-white text-5xl font-bold">STR TEEN</h1>
  <button className="text-white text-lg underline mt-2">AFFICHER TOUT</button>
</div>
</div>
);
}
export default SliderHome;
import React from 'react';
import image1 from '../../assets/AboutAs1.png'; // Import your images
import image2 from '../../assets/AboutAs2.png';
import image3 from '../../assets/AboutAs3.png';
import image4 from '../../assets/AboutAs4.png';

const AboutUs: React.FC = () => {
  const sections = [
    {
      title: 'Harmony',
      text: 'The name "Harmony" was chosen to reflect the perfect balance we strive to achieve in every aspect of our brand. It symbolizes the union of style, comfort, and elegance, creating clothing that not only looks beautiful but also feels good to wear. Harmony represents the seamless blend of modern fashion with timeless grace, allowing every woman to express her unique beauty with confidence.',
      image: image3,
    },
    {
      title: 'Our Commitment to Sustainability',
      text: "At Harmony, we believe that fashion should be both beautiful and responsible. That's why we are committed to sustainable practices at every stage of our production. From sourcing eco-friendly materials to ensuring fair labor practices, we prioritize the well-being of our planet and the people who inhabit it. Our collections are designed to last, encouraging thoughtful consumption and reducing waste, so you can enjoy fashion that doesn't cost the earth.",
      image: image2,
    },
    {
      title: 'Our Work',
      text: "Harmony is part of a dedicated group of professionals who are passionate about creating clothing that resonates with women of all walks of life. Our team is composed of talented designers, skilled artisans, and industry experts who work together to bring you the best in women's fashion. We are committed to innovation and excellence, constantly evolving to meet the needs of our customers while staying true to our core values.",
      image: image4,
    },
    {
      title: 'The Values of Harmony',
      text: 'At the heart of Harmony lies a set of values that guide everything we do. We believe in quality, integrity, and inclusivity. Our goal is to create clothing that empowers women, making them feel confident and comfortable in their own skin. We embrace diversity and celebrate individuality, offering styles that cater to different tastes and preferences. Harmony is more than just a brand; it\'s a community where everyone is welcome to find their own expression of beauty.',
      image: image1,
    },
  ];

  return (
    <div className="space-y-20 p-4 md:p-16 bg-white" style={{ marginTop: '20px', marginBottom: '20px' }}>
      {/* Main Title */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-semibold text-black italic tracking-wide underline-400 decoration-2 underline-offset-4">
          Discover the essence of Harmony
        </h1>
      </div>

      {/* Sections */}
      {sections.map((section, index) => (
        <div
          key={index}
          className={`flex flex-col ${
            index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
          } items-center space-y-8 md:space-y-0 md:space-x-0 p-4 md:p-8 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-lg border border-gray-200 transform transition duration-500 hover:scale-105`}
        >
          {/* Text Section */}
          <div className="w-full md:w-1/2 px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">{section.title}</h2>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed tracking-wide">{section.text}</p>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2">
            <img src={section.image} alt={section.title} className="w-full h-full object-cover rounded-lg border-2 border-gray-200 shadow-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutUs;

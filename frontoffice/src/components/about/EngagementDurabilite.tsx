import React from 'react';
import { FaLeaf, FaRecycle, FaIndustry, FaGlobe, FaBox, FaHandsHelping, FaChartLine } from 'react-icons/fa';

const EngagementDurabilite = () => {
  return (
    <div className="bg-white text-gray-800 p-12 md:p-24" style={{ marginTop: '80px', marginBottom: '80px' }}>
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-8 text-green-600 tracking-wide">Notre Engagement pour la Durabilité</h1>
        <p className="text-lg mb-12 text-gray-700 leading-relaxed">
          Chez Harmony, nous croyons fermement que la mode peut être une force positive pour la planète. Nous sommes déterminés à minimiser notre impact environnemental et à promouvoir des pratiques durables tout au long de notre chaîne de valeur.
        </p>
      </div>

      {/* Sections */}
      <section className="my-16 bg-gradient-to-r from-white to-gray-50 p-8 rounded-lg shadow-md border border-gray-200 transition transform hover:scale-105">
        <h2 className="text-3xl font-semibold mb-6 text-green-700 flex items-center">
          <FaLeaf className="mr-2 text-green-500" /> Matériaux Écologiques
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Nous utilisons des matériaux respectueux de l'environnement comme le coton biologique et le polyester recyclé. Ces choix nous permettent de réduire considérablement notre empreinte écologique tout en offrant des produits de haute qualité.
        </p>
      </section>

      <section className="my-16 bg-gradient-to-r from-white to-gray-50 p-8 rounded-lg shadow-md border border-gray-200 transition transform hover:scale-105">
        <h2 className="text-3xl font-semibold mb-6 text-green-700 flex items-center">
          <FaIndustry className="mr-2 text-green-500" /> Pratiques de Production Responsable
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Nos processus de fabrication sont conçus pour être aussi durables que possible, en réduisant les déchets et en utilisant des énergies renouvelables. Nous collaborons avec des usines certifiées pour garantir des conditions de travail éthiques et justes.
        </p>
      </section>

      <section className="my-16 bg-gradient-to-r from-white to-gray-50 p-8 rounded-lg shadow-md border border-gray-200 transition transform hover:scale-105">
        <h2 className="text-3xl font-semibold mb-6 text-green-700 flex items-center">
          <FaGlobe className="mr-2 text-green-500" /> Réduction de l'Empreinte Carbone
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Nous nous engageons à réduire nos émissions de carbone en optimisant nos chaînes logistiques et en investissant dans des projets de compensation carbone. Notre objectif est de rendre toutes nos opérations neutres en carbone d'ici 2030.
        </p>
      </section>

      <section className="my-16 bg-gradient-to-r from-white to-gray-50 p-8 rounded-lg shadow-md border border-gray-200 transition transform hover:scale-105">
        <h2 className="text-3xl font-semibold mb-6 text-green-700 flex items-center">
          <FaBox className="mr-2 text-green-500" /> Emballages Écologiques
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Nous avons banni les plastiques à usage unique de nos emballages et utilisons des matériaux recyclables ou compostables. C'est un petit changement qui fait une grande différence pour notre planète.
        </p>
      </section>

      <section className="my-16 bg-gradient-to-r from-white to-gray-50 p-8 rounded-lg shadow-md border border-gray-200 transition transform hover:scale-105">
        <h2 className="text-3xl font-semibold mb-6 text-green-700 flex items-center">
          <FaHandsHelping className="mr-2 text-green-500" /> Engagement Communautaire
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Nous soutenons activement les communautés locales à travers des partenariats et des initiatives qui promeuvent la durabilité. Chaque achat chez Harmony contribue à des causes environnementales et sociales.
        </p>
      </section>

      <section className="my-16 bg-gradient-to-r from-white to-gray-50 p-8 rounded-lg shadow-md border border-gray-200 transition transform hover:scale-105">
        <h2 className="text-3xl font-semibold mb-6 text-green-700 flex items-center">
          <FaChartLine className="mr-2 text-green-500" /> Objectifs et Engagements Futurs
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Nous nous fixons des objectifs ambitieux pour continuer à progresser vers une mode plus durable. En 2025, nous visons à ce que 100% de nos matériaux soient d'origine durable, et nous travaillons constamment à réduire notre empreinte environnementale.
        </p>
      </section>

      <div className="text-center mt-24">
        <p className="text-lg text-gray-600 italic">
          Ensemble, construisons un avenir où la mode et la durabilité vont main dans la main.
        </p>
      </div>
    </div>
  );
};

export default EngagementDurabilite;

import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaPinterest, FaTiktok, FaLinkedin } from 'react-icons/fa';
import { SiAppstore, SiAndroid } from 'react-icons/si';
import visa from '../../assets/visa.png';
import deliver from '../../assets/cash-on-delivery.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 mt-auto">
      <div className="container mx-auto py-8 px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between mb-8">
          {/* Harmonie Section */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Harmony</h2>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="/about" className="hover:underline">À propos de Harmony</a>
              </li>
              <li>
                <a href="/Engagement" className="hover:underline">Notre engagement pour la durabilité</a>
              </li>
              <li>
                <a href="/DemandeAdmin" className="hover:underline">Envoyer une demande d'administration</a>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-lg font-semibold mb-4">Besoin d'aide?</h2>
            <ul className="space-y-2">
              <li><a href="/contact" className="hover:underline">FAQ et Contact</a></li>
              <li><a href="/check-order" className="hover:underline">Localisez votre commande</a></li>
              <li>
                <a href="/cookie" className="hover:underline">Préférences de cookies</a>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-lg font-semibold mb-4">Payment methods</h2>
            <ul className="space-y-2">
              <li className="flex items-center">
                <img src={visa} alt="Visa" className="h-5 mr-2" />
                <span>Visa</span>
              </li>
              <li className="flex items-center">
                <img src={deliver} alt="Cash on Delivery" className="h-5 mr-2" />
                <span>Cash on delivery</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-300 pt-8">
          {/* Social Media Icons */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" aria-label="Facebook" className="text-2xl text-gray-600 hover:text-gray-800"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram" className="text-2xl text-gray-600 hover:text-gray-800"><FaInstagram /></a>
            <a href="#" aria-label="Twitter" className="text-2xl text-gray-600 hover:text-gray-800"><FaTwitter /></a>
            <a href="#" aria-label="YouTube" className="text-2xl text-gray-600 hover:text-gray-800"><FaYoutube /></a>
            <a href="#" aria-label="Pinterest" className="text-2xl text-gray-600 hover:text-gray-800"><FaPinterest /></a>
            <a href="#" aria-label="TikTok" className="text-2xl text-gray-600 hover:text-gray-800"><FaTiktok /></a>
            <a href="#" aria-label="LinkedIn" className="text-2xl text-gray-600 hover:text-gray-800"><FaLinkedin /></a>
          </div>

          {/* Mobile App Links */}
          <div className="flex space-x-4">
            <a href="#" aria-label="App Store" className="flex items-center space-x-2">
              <SiAppstore className="text-2xl text-gray-600 hover:text-gray-800" />
              <span>iOS</span>
            </a>
            <a href="#" aria-label="Google Play" className="flex items-center space-x-2">
              <SiAndroid className="text-2xl text-gray-600 hover:text-gray-800" />
              <span>Android</span>
            </a>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>©️ 2024 Harmony · Conditions générales · Cookies · Politique de confidentialité · Se désabonner de la newsletter · SiteMap</p>
          <p>Maroc | Français</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
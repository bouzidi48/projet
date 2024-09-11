import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Footer from './Components/Footer';
import Dashboard from './Components/Dashboard';
import Customers from './Components/Customers';
import Products from './Components/Products';
import Categories from './Components/Categories';
import Payment from './Components/Payment';
import Orders from './Components/Orders';
import ContactUs from './Components/ContactUs';

import { useEffect, useState } from 'react';

import DemandeAdmin from './Components/DemandeAdmin';
import Reviews from './Components/Review';

function App() {
  const [isLg, setIsLg] = useState(window.innerWidth >= 1024);
  const [theme, setTheme] = useState('light');
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }

    const handleResize = () => {
      setIsLg(window.innerWidth >= 1024);
      if (window.innerWidth < 1024) {
        setSidebarVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  console.log("isAuthenticated",isAuthenticated)

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>
      <Router>
        <Header theme={theme} setTheme={handleThemeChange} toggleSidebar={toggleSidebar} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <div className="flex">
          <Sidebar theme={theme} isSidebarVisible={isSidebarVisible} toggleSidebar={toggleSidebar} isLg={isLg} setIsLg={setIsLg} />
          <main className={`flex-1 p-4 transition-all duration-300 ${isSidebarVisible ? 'ml-44' : ''}`}>
            <div className="overflow-x-auto">
              {isAuthenticated ? (
                <Routes>
                  <Route path="/" element={<Dashboard theme={theme} isSidebarVisible={isSidebarVisible}/>} />
                  <Route path="/customers" element={<Customers theme={theme} />} />
                  <Route path="/products" element={<Products theme={theme} isLg={isLg} />} />
                  <Route path="/categories" element={<Categories theme={theme} isLg={isLg} />} />
                  <Route path="/payment" element={<Payment theme={theme} />} />
                  <Route path="/orders" element={<Orders theme={theme} />} />
                  <Route path="/contact" element={<ContactUs theme={theme} />} />
                  <Route path="/DemandeAdmin" element={<DemandeAdmin theme={theme} />} />
                  <Route path="/reviews" element={<Reviews theme={theme} />} />
                  
                </Routes>
              ) : (
                <div className="flex m-48 justify-center items-center h-full">
                  <p className={`text-xl ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Please log in to view the content.</p>
                </div>
              )}
            </div>
          </main>
        </div>
        <Footer theme={theme} isSidebarVisible={isSidebarVisible} />
      </Router>
    </div>
  );
}

export default App;

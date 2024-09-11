import React, { useEffect } from 'react';
import { cilArrowLeft, cilBasket, cilCart, cilCommentSquare, cilCreditCard, cilEnvelopeClosed, cilList, cilSpeedometer, cilStar, cilStorage, cilUser, cilUserFollow } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CNavGroup, CNavItem, CNavTitle, CSidebar, CSidebarNav } from "@coreui/react";
import '@coreui/coreui/dist/css/coreui.min.css';

const Sidebar = (props) => {
  

  useEffect(() => {
    const handleResize = () => {
      props.setIsLg(window.innerWidth >= 1024);
    };
  
    window.addEventListener('resize', handleResize);
    // Call handleResize initially to set the state based on the initial window size
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [props]);
  
  const toggleSidebar = () => {
    props.toggleSidebar();
  };
  console.log(props.isLg)
  console.log(props.isSidebarVisible)
  

  return (
    <CSidebar
      className={`h-screen top-0 left-0 border-end transition-all duration-300  `}
      visible={props.isSidebarVisible ? true : false}
      size={props.isLg ? 'sm': 'md' }
      
      position="fixed"
      colorScheme={props.theme === 'dark' ? 'dark' : 'light'}
    >
      <CSidebarNav>
      <button
        className={` p-2 rounded ${props.theme === 'dark' ? 'bg-gray-800 text-white':'bg-gray-200 text-dark'}`}
        onClick={toggleSidebar}
      >
        <CIcon icon={cilArrowLeft} />
      </button>
        <CNavTitle>E-Commerce</CNavTitle>
        <CNavItem href="/"><CIcon customClassName="nav-icon" icon={cilSpeedometer} /> Dashboard</CNavItem>
        <CNavItem href="/customers"><CIcon customClassName="nav-icon" icon={cilUser} /> Customers</CNavItem>
        <CNavGroup toggler={<><CIcon customClassName="nav-icon" icon={cilBasket} /> Manage Products </>}>
          <CNavItem href="/products"><CIcon className="nav-icon" icon={cilStorage} /> Products</CNavItem>
          <CNavItem href="/categories"><CIcon className="nav-icon" icon={cilList} /> Categories</CNavItem>
        </CNavGroup>
        <CNavItem href="/payment"><CIcon customClassName="nav-icon" icon={cilCreditCard} /> Payment</CNavItem>
        <CNavItem href="/orders"><CIcon className="nav-icon" icon={cilCart} /> Orders</CNavItem>
        <CNavItem href="/contact"><CIcon className="nav-icon" icon={cilEnvelopeClosed} /> ContactUs</CNavItem>
        <CNavItem href="/DemandeAdmin"><CIcon className="nav-icon" icon={cilUserFollow} /> DemandeAdmin</CNavItem>
        <CNavItem href="/reviews"><CIcon className="nav-icon" icon={cilStar} /> Review</CNavItem>
        
      </CSidebarNav>
    </CSidebar>
  );
};

export default Sidebar;

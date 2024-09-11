import { CFooter } from '@coreui/react';
import React from 'react';

const Footer = (props) => {
  console.log(props.theme)
  return (
    <div className={`flex-1 transition-all duration-300 ${props.isSidebarVisible ? 'ml-44' : ''}`}>
    <CFooter className={props.theme==='dark' ? 'bg-dark text-white text-center p-4 mt-auto' :'bg-gray-200 text-dark text-center p-4 mt-auto'}>
      <div >
        <span>&copy; 2024 creativeLabs.</span>
      </div>
      
    </CFooter>
    </div>
  );
};

export default Footer;

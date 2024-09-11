import React, { useEffect, useState } from 'react';
import {
  cilExitToApp,
  cilMenu,
  cilMoon,
  cilSettings,
  cilSun,
  cilUser,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CHeader,
  CButton,
  CLink,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import axiosInstance from '../axiosConfig'; // Assurez-vous que le chemin est correct

const Header = (props) => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Utilisez sessionStorage à la place de localStorage
  useEffect(() => {
    const auth = sessionStorage.getItem('authToken');
    if (auth) {
      props.setIsAuthenticated(true);
    }
  }, []); // Ajoutez les crochets pour exécuter l'effet uniquement une fois au montage

  const toggleMode = () => {
    props.theme === 'light' ? props.setTheme('dark') : props.setTheme('light');
  };

  const toggleSidebar = () => {
    props.toggleSidebar();
  };

  const handleLoginClick = () => {
    setIsLoginModalVisible(true);
  };

  const handleLogoutClick = async () => {
    try {
      await axiosInstance.post('/authentification/logout', {}, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      props.setIsAuthenticated(false);
      sessionStorage.removeItem('authToken'); // Supprimez le token de sessionStorage
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleModalClose = () => {
    setIsLoginModalVisible(false);
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await axiosInstance.post('/authentification/login', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.statusCode === 200) {
        props.setIsAuthenticated(true);
        setIsLoginModalVisible(false);
        sessionStorage.setItem('authToken', response.data.token); // Stockez le token dans sessionStorage
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <CHeader
      className={`flex justify-between items-center transition-colors duration-300 border-b ${props.theme === 'dark' ? 'bg-dark text-white' : 'bg-gray-200 text-dark'
        }`}
    >
      <button
        className={`p-2 rounded ${props.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-dark'
          }`}
        onClick={toggleSidebar}
      >
        <CIcon icon={cilMenu} />
      </button>
      <h1 className="text-2xl font-bold">
        <CLink
          href="/"
          className={`decoration-0 no-underline ml-24 ${props.theme === 'dark' ? 'text-slate-100' : 'text-slate-900'
            }`}
        >
          Admin Dashboard
        </CLink>
      </h1>
      <div className="flex items-center space-x-10">
        <button
          onClick={!props.isAuthenticated ? handleLoginClick : handleLogoutClick}
          className={`p-2 rounded transition-colors duration-300 border ${props.theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-dark'
            }`}
        >
          <CIcon
            icon={props.isAuthenticated ? cilExitToApp : cilUser}
            className="mr-2"
          />
          {props.isAuthenticated ? 'Logout' : 'Login'}
        </button>
        <button
          onClick={toggleMode}
          className={`p-3 rounded transition-colors duration-300 border ${props.theme === 'dark' ? 'bg-gray-800 ' : 'bg-gray-200 '
            }`}
        >
          <CIcon
            icon={props.theme === 'dark' ? cilSun : cilMoon}
            className="w-8 h-8"
          />
        </button>
      </div>
      <CModal visible={isLoginModalVisible} onClose={handleModalClose} size="md">
        <CModalHeader
          closeButton={true}
          className={`p-4 border ${props.theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-0 text-dark'
            }`}
        >
          <h5>Login</h5>
        </CModalHeader>
        <CModalBody
          className={`p-4 border-r border-l ${props.theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-0 text-dark'
            }`}
        >
          <div className="mb-2">
            <label htmlFor="username" className="font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control w-auto h-auto"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control w-auto h-auto"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </CModalBody>
        <div className={`border-t ${props.theme === 'dark' ? 'bg-gray-700 ' : 'bg-gray-200'
          }`}>
        <CModalFooter >
          <CButton color="success" onClick={handleLoginSubmit} className="mr-2">
            Login
          </CButton>
          <CButton color="danger" onClick={handleModalClose}>
            Cancel
          </CButton>
        </CModalFooter>
        </div>
      </CModal>
    </CHeader>
  );
};

export default Header;

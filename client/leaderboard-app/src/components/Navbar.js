import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import './Navbar.css';
import logo from '../assets/logo.png'; 

const Navbar = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false); 
  const location = useLocation();

  useEffect(() => {
    const showAdminFromLocalStorage = localStorage.getItem('ShowAdmin');
    setShowAdmin(showAdminFromLocalStorage === 'true');

    setIsOpen(false);
  }, [location]);

  const toggleNavbar = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.getElementById('navbarNav');
      const toggler = document.querySelector('.navbar-toggler');

      if (navbar && !navbar.contains(event.target) && !toggler.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <div className="navbar-left d-flex align-items-center"> 
          <Link className="navbar-brand" to="https://www.slanglabs.in/" target="_blank">
            <img src={logo} alt="Logo" style={{ height: '30px', width: 'auto', marginRight: '10px' }} />
          </Link>
          <div className="mx-auto">
            <Link to="/" className="navbar-title no-underline">
              Agent Arena
            </Link>
          </div>
        </div>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleNavbar} 
          aria-controls="navbarNav" 
          aria-expanded={isOpen} 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/" 
                onClick={handleMenuItemClick} 
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/arena' ? 'active' : ''}`} 
                to="/arena" 
                onClick={handleMenuItemClick} 
              >
                Arena
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/leaderboard' ? 'active' : ''}`} 
                to="/leaderboard" 
                onClick={handleMenuItemClick} 
              >
                Leaderboard
              </Link>
            </li>
            {showAdmin && (
              <li className="nav-item">
                <Link 
                  className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} 
                  to="/admin" 
                  onClick={handleMenuItemClick} 
                >
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { FaGithub } from 'react-icons/fa';
import './Footer.css';

const Footer = () => (
  <footer className="footer py-2 text-center">
    <p className="text-white">
      &copy; {new Date().getFullYear()} Slang Labs. All Rights Reserved.
    </p>
    <p className="footer-text">
      <a
        href="https://github.com/slanglabs-projects/prompt-benchmark"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white"
      >
        Source Code: <FaGithub size={22} />
      </a>
    </p>
  </footer>
);

export default Footer;

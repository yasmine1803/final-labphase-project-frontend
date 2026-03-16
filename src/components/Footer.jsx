// Simple footer component
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Bitely. Made for independent living.</p>
      </div>
    </footer>
  );
};

export default Footer;
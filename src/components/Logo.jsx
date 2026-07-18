import React from 'react'
import logo from '../assets/logo.png';
import logoFull from '../assets/logo_full.png';

function Logo({ width = '100px', full = false, className = '' }) {
  return (
    <img 
      src={full ? logoFull : logo}
      alt="BlogWorld Logo"
      style={{ width }}
      className={`object-contain ${className}`}
    />
  );
}

export default Logo
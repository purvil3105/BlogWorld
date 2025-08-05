import React from 'react'
import blogLogo from '../assets/blog.png';

function Logo({ width = '100px' }) {
  return (
    <img 
      src={blogLogo}
      alt="BlogWorld Logo"
      style={{ width }}
    />
  );
}

export default Logo
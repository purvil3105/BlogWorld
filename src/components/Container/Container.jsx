import React from 'react'

function Container({ children }) {
  return (
    <div className="w-full mx-auto px-2">
      {children}
    </div>
  );
}

export default Container

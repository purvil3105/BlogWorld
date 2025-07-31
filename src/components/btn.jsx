import React from 'react'

function btn({
  children,
  type = "button",
  bgcolor = 'bg-blue-600 hover:bg-blue-700',
  textcolor = 'text-white',
  classname = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`px-5 py-2 rounded-lg shadow-sm transition duration-200 font-medium ${bgcolor} ${textcolor} ${classname}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default btn

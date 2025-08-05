import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <footer className=" w-full bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
        {/* Left: Logo & Brand */}
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
          <Logo width="40px" />
          <div>
            <h2 className="text-lg font-bold text-gray-800">BlogWorld</h2>
            <p className="text-xs text-gray-500">Share Your Stories</p>
          </div>
        </div>

        {/* Center: Links */}
        <div className="flex flex-col md:flex-row md:space-x-10 space-y-2 md:space-y-0 items-center">
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-1">Company</h3>
            <ul className="flex space-x-4">
              {['Features', 'Pricing', 'Affiliate', 'Press'].map((item) => (
                <li key={item}>
                  <Link className="text-sm text-gray-700 hover:text-blue-600 transition" to="/">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-1">Support</h3>
            <ul className="flex space-x-4">
              {['Account', 'Help', 'Contact', 'Support'].map((item) => (
                <li key={item}>
                  <Link className="text-sm text-gray-700 hover:text-blue-600 transition" to="/">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-600 mb-1">Legal</h3>
            <ul className="flex space-x-4">
              {['Terms', 'Privacy', 'Licensing'].map((item) => (
                <li key={item}>
                  <Link className="text-sm text-gray-700 hover:text-blue-600 transition" to="/">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Newsletter & Social */}
        <div className="flex flex-col items-end space-y-2">
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="px-2 py-1 border border-gray-300 rounded-l text-sm focus:outline-none"
            />
            <button className="px-3 py-1 bg-blue-600 text-white rounded-r text-sm hover:bg-blue-700 transition">
              Subscribe
            </button>
          </form>
          <div className="flex space-x-2">
            {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
              <a key={social} href="#" className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-blue-500 transition">
                {/* Placeholder for social icon */}
                <span className="text-xs text-gray-600">{social[0].toUpperCase()}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-2 bg-gray-50 border-t border-gray-100">
        &copy; 2023 BlogWorld. All Rights Reserved.
      </div>
    </footer>
  )
}

export default Footer
import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'
import { Globe, Link as LinkIcon, ArrowRight } from 'lucide-react'

function Footer() {
  return (
    <footer className="w-full bg-[var(--color-secondary-bg)] border-t border-[var(--color-border-light)] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row justify-between gap-12">
        {/* Left: Brand & Newsletter */}
        <div className="flex flex-col space-y-6 max-w-sm">
          <div className="flex items-center space-x-3">
            <Logo width="24px" />
            <h2 className="text-xl font-bold font-heading">BlogWorld</h2>
          </div>
          <p className="text-sm text-[var(--color-secondary-text)] leading-relaxed">
            Thoughtful stories for curious minds and passionate hearts.
          </p>
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-3">Never miss a story</h3>
            <form className="flex items-center border-b border-[var(--color-border-light)] pb-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent text-sm focus:outline-none placeholder:text-gray-400"
              />
              <button type="submit" className="text-[var(--color-primary-text)] hover:text-[var(--color-accent-primary)] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Center: Links */}
        <div className="flex space-x-16 md:space-x-24">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4">Explore</h3>
            <ul className="flex flex-col space-y-3">
              {['Home', 'Explore', 'Categories', 'About'].map((item) => (
                <li key={item}>
                  <Link className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors" to="/">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4">Resources</h3>
            <ul className="flex flex-col space-y-3">
              {['Write for us', 'Guidelines', 'Help Center', 'Contact'].map((item) => (
                <li key={item}>
                  <Link className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors" to="/">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4">Legal</h3>
            <ul className="flex flex-col space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <li key={item}>
                  <Link className="text-sm text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors" to="/">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-[var(--color-border-light)] flex flex-col md:flex-row items-center justify-between">
        <div className="text-xs text-[var(--color-secondary-text)]">
          &copy; 2024 BlogWorld. All rights reserved.
        </div>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors"><Globe className="w-4 h-4" /></a>
          <a href="#" className="text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] transition-colors"><LinkIcon className="w-4 h-4" /></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
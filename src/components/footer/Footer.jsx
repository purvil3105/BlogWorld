import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 border-t border-white/20">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-pink-900/30 animate-pulse"></div>
      
      {/* Glass morphism effect */}
      <div className="absolute inset-0 backdrop-blur-sm bg-white/5"></div>
      
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Logo and Brand Section */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Logo Container */}
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 shadow-lg">
                  <Logo width="60px" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    BlogWorld
                  </h2>
                  <p className="text-sm text-white/70 font-medium">Share Your Stories</p>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-white/80 leading-relaxed max-w-md">
                Express yourself through powerful storytelling. Join our community of writers and readers who believe every story matters.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="group relative p-2 rounded-lg bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-sm border border-white/30 hover:from-white/20 hover:to-white/30 transition-all duration-300 hover:scale-110"
                  >
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/0 to-pink-400/0 transition-all duration-300 group-hover:from-blue-400/20 group-hover:to-pink-400/20 blur-xl"></div>
                    <div className="relative w-5 h-5 bg-white/70"></div>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Copyright */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-sm text-white/60">
                &copy; Copyright 2023. All Rights Reserved by{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                  BlogWorld
                </span>
              </p>
            </div>
          </div>
          
          {/* Company Section */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Company
              </h3>
              <ul className="space-y-4">
                {['Features', 'Pricing', 'Affiliate Program', 'Press Kit'].map((item) => (
                  <li key={item}>
                    <Link
                      className="group relative text-white/80 hover:text-white transition-all duration-300 font-medium"
                      to="/"
                    >
                      <span className="relative z-10">{item}</span>
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Support Section */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Support
              </h3>
              <ul className="space-y-4">
                {['Account', 'Help', 'Contact Us', 'Customer Support'].map((item) => (
                  <li key={item}>
                    <Link
                      className="group relative text-white/80 hover:text-white transition-all duration-300 font-medium"
                      to="/"
                    >
                      <span className="relative z-10">{item}</span>
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Legal Section */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-pink-300 to-red-300 bg-clip-text text-transparent">
                Legal
              </h3>
              <ul className="space-y-4">
                {['Terms & Conditions', 'Privacy Policy', 'Licensing'].map((item) => (
                  <li key={item}>
                    <Link
                      className="group relative text-white/80 hover:text-white transition-all duration-300 font-medium"
                      to="/"
                    >
                      <span className="relative z-10">{item}</span>
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-red-400 transition-all duration-300 group-hover:w-full"></div>
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Newsletter Signup */}
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-sm border border-white/30">
                <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
                <p className="text-white/70 text-sm mb-3">Get the latest stories delivered to your inbox.</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/30 rounded-l-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-r-lg text-white font-medium text-sm hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-xl animate-pulse"></div>
    </footer>
  )
}

export default Footer
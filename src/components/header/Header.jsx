import React from 'react'
import {Container, Logo, Logoutbtn} from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  // const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
    
  const state = useSelector((state) => state)
  console.log('Full Redux State:', state)
 
  console.log("From Header");
        
  const authStatus = useSelector((state) => state.auth.status)
  console.log(authStatus);
     
  // ... rest of your component
   
  const naItems = [
    {name: 'Home',
       slug: "/",
       active: true},
     {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
  },
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  {
      name: "Edit Post",
      slug: "/edit-post",
      active: authStatus,
  },
  ]

  return (
    <header className="relative w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-2xl backdrop-blur-sm border-b border-white/20">
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
      
      {/* Glass morphism effect */}
      <div className="absolute inset-0 backdrop-blur-md bg-white/5"></div>
      
      <Container>
        <nav className="relative flex flex-wrap items-center justify-between py-4 px-4 sm:px-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 shadow-lg">
              <Logo />
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                BlogWorld
              </h1>
              <p className="text-xs text-white/70 font-medium">Share Your Stories</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-2">
            {naItems.map((item) =>
              item.active ? (
                <button
                  key={item.name}
                  onClick={() => navigate(item.slug)}
                  className="group relative px-6 py-3 font-semibold text-white transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  {/* Button background with gradient */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-white/20 backdrop-blur-sm border border-white/30 shadow-lg transition-all duration-300 group-hover:from-white/20 group-hover:to-white/30 group-hover:shadow-xl group-hover:border-white/50"></div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/0 to-pink-400/0 transition-all duration-300 group-hover:from-blue-400/20 group-hover:to-pink-400/20 blur-xl"></div>
                  
                  {/* Button text */}
                  <span className="relative z-10 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-300">
                    {item.name}
                  </span>
                  
                  {/* Active indicator */}
                  {item.slug === "/" && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg animate-pulse"></div>
                  )}
                </button>
              ) : null
            )}
            
            {/* Logout Button */}
            {authStatus && (
              <div className="ml-4 pl-4 border-l border-white/30">
                <div className="group relative">
                  {/* Logout button with special styling */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 shadow-lg transition-all duration-300 group-hover:from-red-500/30 group-hover:to-pink-500/30 group-hover:shadow-xl group-hover:border-red-400/50"></div>
                  <Logoutbtn className="relative z-10" />
                </div>
              </div>
            )}
          </div>
        </nav>
      </Container>
      
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
    </header>
  )
}

export default Header
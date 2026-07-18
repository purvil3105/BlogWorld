import React from 'react'
import { Container, Logo, Logoutbtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import appwriteService from "../../appwrite/config"

function Header() {
  const navigate = useNavigate()
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const [avatarSrc, setAvatarSrc] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  useEffect(() => {
    const uid = userData?.$id || userData?.userData?.$id;
    if (uid) {
       const name = userData?.name || userData?.userData?.name || 'User';
       
       appwriteService.getProfile(uid).then((profile) => {
           if (profile && profile.avatarId) {
               setAvatarSrc(appwriteService.getFilePreview(profile.avatarId));
           } else {
               setAvatarSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`);
           }
       }).catch(() => {
           setAvatarSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`);
       })
    }
  }, [userData])

    const navItems = [
      { name: 'Home', slug: "/", active: true },
      { name: "Explore", slug: "/explore", active: true },
      { name: "Categories", slug: "/categories", active: true },
      { name: "Bookmarks", slug: "/bookmarks", active: authStatus },
      { name: "About", slug: "/about", active: true },
    ]

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-primary-bg)]/90 backdrop-blur-md border-b border-[var(--color-border-light)] transition-all">
      <Container>
        <nav className="flex items-center justify-between py-4">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <Logo width="24px" />
            <h1 className="text-xl font-bold ml-3 font-heading">BlogWorld</h1>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) =>
              item.active ? (
                <button
                  key={item.name}
                  onClick={() => navigate(item.slug)}
                  className="text-sm font-medium text-[var(--color-primary-text)] underline-hover transition-colors"
                >
                  {item.name}
                </button>
              ) : null
            )}
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex relative w-full max-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-secondary-text)]" />
                <input 
                  type="text" 
                  placeholder="Search articles, authors..." 
                  className="w-full bg-white/50 border border-[var(--color-border-light)] rounded-full py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-[var(--color-primary-text)] transition-colors placeholder:text-[var(--color-secondary-text)]" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                />
            </div>
            
            {!authStatus && (
              <div className="flex items-center space-x-4">
                <button onClick={() => navigate('/login')} className="text-sm font-medium underline-hover">Login</button>
                <button onClick={() => navigate('/signup')} className="text-sm font-medium bg-[var(--color-primary-text)] text-white px-4 py-1.5 rounded-full hover:bg-black transition-colors">Sign up</button>
              </div>
            )}

            {authStatus && (
              <div className="flex items-center space-x-4">
                 <button onClick={() => navigate('/add-post')} className="text-sm font-medium underline-hover">Write</button>
                 <Logoutbtn />
                 <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-[var(--color-border-light)] cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/profile')}>
                    <img src={avatarSrc || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || userData?.userData?.name || 'User')}&background=random`} alt="avatar" className="w-full h-full object-cover" />
                 </div>
              </div>
            )}
          </div>
        </nav>
      </Container>
    </header>
  )
}

export default Header
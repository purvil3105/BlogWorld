import React from 'react'
import { Container, Logo, Logoutbtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  const authStatus = useSelector((state) => state.auth.status)

  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
    { name: "Edit Post", slug: "/edit-post", active: authStatus },
  ]

  return (
    <header className="w-full bg-white shadow-md">
      <Container>
        <nav className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Logo />
            <h1 className="text-3xl font-bold ml-2">BlogWorld</h1>
          </div>

          <div className="flex items-center space-x-4">
            {navItems.map((item) =>
              item.active ? (
                <button
                  key={item.name}
                  onClick={() => navigate(item.slug)}
                  className="text-white text-lg font-medium rounded-xl bg-blue-600 px-5 py-2.5 hover:shadow-xl hover:scale-105 active:scale-95 transition duration-200 "
                >
                  {item.name}
                </button>
              ) : null
            )}

            {authStatus && (
              <Logoutbtn />
            )}
          </div>
        </nav>
      </Container>
    </header>
  )
}

export default Header
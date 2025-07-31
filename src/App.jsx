import { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'
import authservice from './appwrite/auth'
import { login, logout } from "./store/authslice"
import {Header, Footer} from './components/index'
import {Outlet} from 'react-router-dom'
import './App.css'

function App() {

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(()=>{
    authservice.getCurrentuser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .finally( () => setLoading(false))
  }, [])

  return !loading ? (
    <div className= "min-h-screen flex flex-wrap content-between bg-blue-300">
      <div className="w-full block">
      <Header />
      <main>
        <Outlet/>
      </main>
      <Footer />
      </div>
    </div>
  ) : null
}

export default App

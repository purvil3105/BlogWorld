import React from 'react'
import { useDispatch } from 'react-redux'
import authservice from '../../appwrite/auth'
import { logout } from '../../store/authslice'

function Logoutbtn() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    authservice.logout().then(() => {
      dispatch(logout())
    })
  }

  return (
    <button
      className="inline-block px-5 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md transition duration-200"
      onClick={logoutHandler}
    >
      Logout
    </button>
  )
}

export default Logoutbtn

import React from 'react';
import { useDispatch } from 'react-redux';
import authservice from '../../appwrite/auth';
import { logout } from '../../store/authslice';

function Logoutbtn() {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    await authservice.logout();
    dispatch(logout());
  };

  return (
    <button
      className="text-white text-lg font-medium rounded-xl bg-red-700 px-5 py-2.5 hover:shadow-xl hover:scale-105 active:scale-95 transition duration-200"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default Logoutbtn;
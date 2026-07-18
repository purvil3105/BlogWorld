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
      className="text-sm font-medium text-[var(--color-primary-text)] underline-hover"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default Logoutbtn;
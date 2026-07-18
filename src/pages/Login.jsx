import React from 'react'
import {Login as LoginComp} from '../components';

function Login() {
  return (
    <div className='min-h-[calc(100vh-80px)] flex flex-col'>
        <LoginComp/>
    </div>
  )
}

export default Login
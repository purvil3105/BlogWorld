import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {login as authLogin} from '../store/authslice'
import {Button, Input, Logo } from './index'
import { useDispatch } from 'react-redux'
import authservice from '../appwrite/auth'
import {useForm} from "react-hook-form"

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")

    const login = async(data) =>{
        setError("")
        try{
            const session = await authservice.login(data)
            if (session){
                const userData = await authservice.getCurrentuser();
                if(userData) dispatch(authLogin(userData))
                navigate('/')
            }
        }catch(error) {
            setError(error.message)
        }
    }
    
   return (
    <div className='w-full flex-1 flex flex-col md:flex-row bg-[var(--color-primary-bg)]'>
        {/* Left Side: Brand & Image */}
        <div className="hidden md:flex md:w-1/2 bg-[var(--color-secondary-bg)] p-12 flex-col justify-between relative overflow-hidden border-r border-[var(--color-border-light)]">
                <div className="relative z-10">
                <h1 className="text-4xl lg:text-5xl font-bold font-heading mt-12 leading-tight">
                    Where curious minds <br/> find their next read.
                </h1>
                <p className="mt-6 text-[var(--color-secondary-text)] text-lg max-w-md">
                    Join a community of thoughtful writers and readers exploring ideas that matter.
                </p>
            </div>
            <div className="relative z-10 mt-12">
                <p className="text-sm font-medium">Trusted by millions of readers worldwide.</p>
            </div>
            {/* Elegant Background Image with blend mode */}
            <img 
                src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2787&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-multiply" 
                alt="Editorial" 
            />
        </div>
        
        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-md bg-[var(--color-card-bg)] rounded-[24px] p-8 sm:p-10 shadow-[var(--shadow-editorial)] border border-[var(--color-border-light)] relative z-10 text-center">
                <div className="flex justify-center mb-6">
                     <Logo width="160px" full={true} className="mix-blend-multiply" />
                </div>
                <h2 className="text-3xl font-bold font-heading mb-2 text-left">Welcome back</h2>
                <p className="text-[var(--color-secondary-text)] mb-8 text-left">
                    Don't have an account?&nbsp;
                    <Link to="/signup" className="text-[var(--color-primary-text)] font-medium underline-hover">
                        Sign up
                    </Link>
                </p>
                
                {error && (
                    <div className="mb-6 p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-[14px] text-center">
                        <p className="text-[var(--color-error)] text-sm font-medium">{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit(login)} className='space-y-6'>
                    <Input
                        label="Email address"
                        placeholder="name@example.com"
                        type="email"
                        {...register("email", {
                            required: true,
                            validate: {
                                matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Email address must be a valid address",
                            }
                        })}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        {...register("password", {
                            required: true,
                        })}
                    />
                    <div className="pt-2">
                        <Button type="submit" variant="primary" className="w-full">
                            Sign in to continue
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}
export default Login
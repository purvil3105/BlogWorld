import React, { useState } from 'react'
import authservice from '../appwrite/auth'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Button, Logo, Input } from './index'
import { useDispatch } from 'react-redux'
import { login } from '../store/authslice'

function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState('');

    const create = async(data) => {
        setError('');
        try {
            const userData = await authservice.createAccount(data);
            if (userData) {
                const currentUser = await authservice.getCurrentuser();
                if (currentUser) {
                    dispatch(login({userData: currentUser}));
                    navigate("/");
                }
            }
        } catch (error) {
            if (error.message) {
                setError(error.message);
            } else if (error.type === 'user_already_exists') {
                setError('Email already registered');
            } else {
                setError('Signup failed. Please try again.');
            }
            console.error("Signup error:", error);
        }
    }

    return (
        <div className='w-full flex-1 flex flex-col md:flex-row bg-[var(--color-primary-bg)]'>
            {/* Left Side: Brand & Image */}
            <div className="hidden md:flex md:w-1/2 bg-[var(--color-secondary-bg)] p-12 flex-col justify-between relative overflow-hidden border-r border-[var(--color-border-light)]">
                <div className="relative z-10">
                    <h1 className="text-4xl lg:text-5xl font-bold font-heading mt-12 leading-tight">
                        Start your <br/> writing journey.
                    </h1>
                    <p className="mt-6 text-[var(--color-secondary-text)] text-lg max-w-md">
                        Create an account to start writing, sharing, and engaging with stories that matter.
                    </p>
                </div>
                <div className="relative z-10 mt-12">
                    <p className="text-sm font-medium">Join thousands of writers and readers.</p>
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
                    <h2 className="text-3xl font-bold font-heading mb-2 text-left">Create account</h2>
                    <p className="text-[var(--color-secondary-text)] mb-8 text-left">
                        Already have an account?&nbsp;
                        <Link to="/login" className="text-[var(--color-primary-text)] font-medium underline-hover">
                            Sign in
                        </Link>
                    </p>
                    
                    {error && (
                        <div className="mb-6 p-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-[14px] text-center">
                            <p className="text-[var(--color-error)] text-sm font-medium">{error}</p>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit(create)} className='space-y-6'>
                        <Input
                            label="Full Name"
                            placeholder="Jane Doe"
                            {...register("name", { required: "Name is required" })}
                            error={errors.name?.message}
                        />
                        <Input
                            label="Email address"
                            placeholder="name@example.com"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Email address must be valid"
                                }
                            })}
                            error={errors.email?.message}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            {...register("password", { 
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters"
                                }
                            })}
                            error={errors.password?.message}
                        />
                        <div className="pt-2">
                            <Button type="submit" variant="primary" className="w-full">
                                Create Account
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup
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
                    dispatch(login(currentUser));
                    navigate("/");
                }
            }
        } catch (error) {
            // Handle specific error messages
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
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                
                {/* Display error message properly */}
                {error && (
                    <p className="text-red-600 mt-4 p-2 bg-red-50 rounded text-center">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("name", { required: "Name is required" })}
                            error={errors.name?.message}
                        />
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
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
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", { 
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password must be at least 8 characters"
                                }
                            })}
                            error={errors.password?.message}
                        />
                        <Button 
                            type="submit" 
                            className="w-full rounded-2xl bg-blue-600 text-white text-lg py-2 px-2 font-bold hover:bg-blue-500"
                        >
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup
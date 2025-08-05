import React, { useEffect, useState } from 'react';
import appwriteService from "../appwrite/config";
import { Container, Postcard } from '../components';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const userData = useSelector(state => state.auth.userData);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await appwriteService.getPosts();
                if (response) {
                    setPosts(response.documents);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
        
        if (userData) {
            fetchPosts();
        } else {
            setLoading(false);
        }
    }, [userData]);

    if (loading) {
        return (
            <div className="w-full py-8">
                <Container>
                    <div className="text-center">Loading...</div>
                </Container>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="w-full py-8">
                <Container>
                    <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4">Welcome to our Blog</h2>
                        <p className="text-gray-600 mb-6">
                            Please login or sign up to view all posts and create your own content.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link 
                                to="/login" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/signup" 
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <h1 className="text-3xl font-bold text-center mb-6">Latest Posts</h1>
                <div className='flex flex-wrap'>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.$id} className='p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
                                <Postcard {...post} />
                            </div>
                        ))
                    ) : (
                        <div className='w-full text-center'>
                            <p className="text-lg">No posts available at the moment.</p>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default Home;
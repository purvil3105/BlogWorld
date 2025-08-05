import React, { useState, useEffect } from 'react';
import { Container, Postcard } from '../components';
import appwriteService from '../appwrite/config';
import { useSelector } from 'react-redux';

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const userData = useSelector(state => state.auth.userData);
    console.log("userData in AllPosts:", userData);
    
   useEffect(() => {
        const fetchPosts = async () => {
            try {
                    const response = await appwriteService.getCurrentUserPosts(userData.userData.$id);
                    if (response) {
                        setPosts(response.documents);
                    }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } 
        };

        fetchPosts();
    }, [userData]);

    return (
        <div className='w-full py-8'>
            <Container>
                <h1 className='text-3xl font-bold text-center mb-6'> My Posts</h1>
                <div className='flex flex-wrap'>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.$id} className='p-4 w-full md:w-1/3 lg:w-1/4'>
                                <Postcard {...post} />
                            </div>
                        ))
                    ) : (
                        <div className='w-full text-center'>
                            <p className='text-lg'>No posts available.</p>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
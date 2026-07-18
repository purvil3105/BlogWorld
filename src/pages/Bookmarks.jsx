import React, { useState, useEffect } from 'react'
import { Container, Postcard } from '../components'
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import { Bookmark } from 'lucide-react';

function Bookmarks() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBookmarks = async () => {
            const savedBookmarks = await authService.getUserBookmarks();
            
            if (savedBookmarks.length === 0) {
                setPosts([]);
                setLoading(false);
                return;
            }

            try {
                const postsResponse = await appwriteService.getPosts([]);
                if (postsResponse) {
                    const bookmarkedPosts = postsResponse.documents.filter(post => savedBookmarks.includes(post.$id));
                    setPosts(bookmarkedPosts);
                }
            } catch (error) {
                console.error("Error fetching bookmarks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [])

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[var(--color-primary-bg)]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-black rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--color-secondary-text)] font-medium tracking-widest uppercase text-xs">Loading</p>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen py-24 bg-[var(--color-primary-bg)]'>
            <Container>
                <div className="flex flex-col items-center justify-center mb-16 text-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-[var(--shadow-editorial)] flex items-center justify-center mb-6 border border-[var(--color-border-light)]">
                        <Bookmark className="w-8 h-8 text-[var(--color-primary-text)]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-4 text-[var(--color-primary-text)]">Bookmarks</h1>
                    <p className="text-[var(--color-secondary-text)] max-w-xl mx-auto">Your personal collection of saved stories to read later.</p>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.$id}>
                                <Postcard {...post} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-[var(--color-secondary-text)]">
                            You haven't saved any stories yet.
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Bookmarks

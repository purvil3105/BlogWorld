import React, { useState, useEffect } from 'react'
import { Container, Postcard } from '../components'
import appwriteService from "../appwrite/config";
import { Grid } from 'lucide-react';

function Categories() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('All')

    const categories = ['All', 'Technology', 'Design', 'Lifestyle', 'Development', 'Business', 'Education', 'Sports', 'Entertainment', 'Food', 'Space', 'Science', 'Politics', 'History', 'Corporate', 'Government', 'Nations', 'Tourism', 'Places', 'Location']

    useEffect(() => {
        appwriteService.getPosts([]).then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
            setLoading(false)
        })
    }, [])

    const filteredPosts = activeCategory === 'All' 
        ? posts 
        : posts.filter(post => (post.category || 'Editorial') === activeCategory);

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
                <div className="flex flex-col items-center justify-center mb-12 text-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-[var(--shadow-editorial)] flex items-center justify-center mb-6 border border-[var(--color-border-light)]">
                        <Grid className="w-8 h-8 text-[var(--color-primary-text)]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-4 text-[var(--color-primary-text)]">Categories</h1>
                    <p className="text-[var(--color-secondary-text)] max-w-xl mx-auto">Browse our collection of thoughts by topic.</p>
                </div>

                {/* Categories Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                                activeCategory === category 
                                ? 'bg-black text-white shadow-md' 
                                : 'bg-white border border-[var(--color-border-light)] text-[var(--color-secondary-text)] hover:border-black hover:text-black'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <div key={post.$id}>
                                <Postcard {...post} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-[var(--color-secondary-text)]">
                            No posts found in this category.
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Categories

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import { Container, Postcard } from '../components';
import { Search as SearchIcon } from 'lucide-react';

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                // Fetch all active posts
                const response = await appwriteService.getPosts();
                if (response && response.documents) {
                    const lowercaseQuery = query.toLowerCase();
                    // Filter locally by title or author name
                    const filteredPosts = response.documents.filter(post => 
                        (post.title && post.title.toLowerCase().includes(lowercaseQuery)) ||
                        (post.authorName && post.authorName.toLowerCase().includes(lowercaseQuery))
                    );
                    setPosts(filteredPosts);
                }
            } catch (error) {
                console.error("Error searching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        } else {
            setPosts([]);
            setLoading(false);
        }
    }, [query]);

    if (loading) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center bg-[var(--color-primary-bg)]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-black rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--color-secondary-text)] font-medium tracking-widest uppercase text-xs">Searching</p>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen py-24 bg-[var(--color-primary-bg)]'>
            <Container>
                <div className="flex flex-col items-center justify-center mb-16 text-center">
                    <div className="w-16 h-16 bg-white rounded-full shadow-[var(--shadow-editorial)] flex items-center justify-center mb-6 border border-[var(--color-border-light)]">
                        <SearchIcon className="w-8 h-8 text-[var(--color-primary-text)]" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-4 text-[var(--color-primary-text)]">
                        Search Results
                    </h1>
                    <p className="text-[var(--color-secondary-text)] text-lg">
                        Showing results for <span className="font-bold text-black">"{query}"</span>
                    </p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.$id}>
                                <Postcard {...post} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-xl text-[var(--color-secondary-text)] font-heading">
                                No articles or authors found matching "{query}".
                            </p>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default Search;

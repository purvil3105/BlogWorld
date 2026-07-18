import React, { useState, useEffect } from 'react';
import { Container } from '../components';
import appwriteService from '../appwrite/config';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Edit3, Trash2, ExternalLink } from 'lucide-react';

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const userData = useSelector(state => state.auth.userData);
    const navigate = useNavigate();
    
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

        if (userData?.userData?.$id) {
            fetchPosts();
        }
    }, [userData]);

    return (
        <div className='w-full min-h-[calc(100vh-80px)] py-12 bg-[var(--color-primary-bg)]'>
            <Container>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
                    <div>
                        <h1 className='text-4xl font-bold font-heading mb-2'>Dashboard</h1>
                        <p className="text-[var(--color-secondary-text)] text-lg">Manage your published articles and drafts.</p>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <Link to="/add-post" className="inline-flex items-center justify-center px-6 py-3 rounded-[14px] bg-[var(--color-primary-text)] text-white text-sm font-medium hover:bg-black hover:-translate-y-0.5 hover:shadow-lg transition-all">
                            Write New Article
                        </Link>
                    </div>
                </div>

                <div className="bg-[var(--color-card-bg)] rounded-[24px] border border-[var(--color-border-light)] shadow-[var(--shadow-editorial)] overflow-hidden">
                    <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-[var(--color-border-light)] text-xs font-semibold uppercase tracking-wider text-[var(--color-secondary-text)]">
                        <div className="col-span-6">Article</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>
                    
                    <div className="divide-y divide-[var(--color-border-light)]">
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post.$id} className='p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-[var(--color-secondary-bg)] transition-colors group'>
                                    <div className="col-span-1 md:col-span-6 flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-[var(--color-border-light)]">
                                            {post.featuredimage ? (
                                                 <img src={appwriteService.getFilePreview(post.featuredimage)} alt={post.title} className="w-full h-full object-cover" />
                                            ) : (
                                                 <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Img</div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg font-heading leading-tight group-hover:text-[var(--color-accent-primary)] transition-colors line-clamp-1">{post.title}</h3>
                                            <p className="text-sm text-[var(--color-secondary-text)] mt-1 hidden sm:block">By {userData?.userData?.name || 'You'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="col-span-1 md:col-span-2">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20">
                                            Published
                                        </span>
                                    </div>
                                    
                                    <div className="col-span-1 md:col-span-2 text-sm text-[var(--color-secondary-text)]">
                                        May 24, 2024
                                    </div>
                                    
                                    <div className="col-span-1 md:col-span-2 flex items-center justify-end space-x-2">
                                        <Link to={`/post/${post.$id}`} className="p-2 text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] bg-white border border-transparent hover:border-[var(--color-border-light)] rounded-lg transition-all shadow-sm hover:shadow">
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                        <Link to={`/edit-post/${post.$id}`} className="p-2 text-[var(--color-secondary-text)] hover:text-[var(--color-accent-primary)] bg-white border border-transparent hover:border-[var(--color-border-light)] rounded-lg transition-all shadow-sm hover:shadow">
                                            <Edit3 className="w-4 h-4" />
                                        </Link>
                                        <button className="p-2 text-[var(--color-secondary-text)] hover:text-[var(--color-error)] bg-white border border-transparent hover:border-[var(--color-border-light)] rounded-lg transition-all shadow-sm hover:shadow">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className='p-12 text-center'>
                                <p className='text-lg text-[var(--color-secondary-text)]'>No articles published yet.</p>
                                <Link to="/add-post" className="mt-4 inline-block text-[var(--color-primary-text)] font-medium underline-hover">Write your first article</Link>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
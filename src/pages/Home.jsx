import React, { useEffect, useState } from 'react';
import appwriteService from "../appwrite/config";
import { Container, Postcard } from '../components';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Clock } from 'lucide-react';

function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('foryou');
    const userData = useSelector(state => state.auth.userData);
    const userId = userData?.userData?.$id;

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                let response;
                if (activeTab === 'foryou') {
                    response = await appwriteService.getTrendingFeed();
                } else if (activeTab === 'following' && userId) {
                    response = await appwriteService.getFollowingFeed(userId);
                } else {
                    response = await appwriteService.getPosts();
                }
                
                if (response) {
                    setPosts(response.documents);
                } else {
                    setPosts([]);
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
    }, [userData, activeTab, userId]);

    if (loading) {
        return (
            <div className="w-full min-h-[60vh] flex items-center justify-center">
                <Container>
                    <div className="text-center font-heading text-xl text-[var(--color-secondary-text)] animate-pulse">
                        Curating stories...
                    </div>
                </Container>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="w-full min-h-[80vh] flex flex-col justify-center py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--color-accent-primary)]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--color-warning)]/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4"></div>
                <Container>
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h1 className="text-5xl md:text-7xl font-bold font-heading leading-tight tracking-tight mb-8">
                            The Future of <br/> Work and How <br/> We Adapt
                        </h1>
                        <p className="text-lg md:text-xl text-[var(--color-secondary-text)] mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                            Exploring the shifts shaping our careers, workplaces, and the skills we'll need to thrive in the future. Discover thoughtful stories for curious minds.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
                            <Link 
                                to="/login" 
                                className="w-full sm:w-auto bg-[var(--color-primary-text)] hover:bg-black text-white px-8 py-4 rounded-[14px] font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center"
                            >
                                Start Reading <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                            <Link 
                                to="/signup" 
                                className="w-full sm:w-auto bg-transparent border border-[var(--color-border-light)] text-[var(--color-primary-text)] hover:border-[var(--color-primary-text)] hover:bg-white px-8 py-4 rounded-[14px] font-medium transition-all duration-300"
                            >
                                Become an Author
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    const featuredPost = posts.length > 0 ? posts[0] : null;
    const gridPosts = posts.length > 1 ? posts.slice(1) : [];

    let featuredReadTime = '6 min read';
    let featuredDate = 'Recent';
    if (featuredPost) {
        const wordCount = featuredPost.content ? featuredPost.content.replace(/<[^>]*>?/gm, '').split(/\s+/).length : 0;
        featuredReadTime = wordCount > 0 ? `${Math.ceil(wordCount / 200)} min read` : '6 min read';
        featuredDate = featuredPost.createdAt ? new Date(featuredPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';
    }

    return (
        <div className='w-full py-12'>
            <Container>
                {/* Hero Section */}
                {featuredPost && (
                    <div className="mb-20">
                        <Link to={`/post/${featuredPost.slug || featuredPost.$id}`} className="group block">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                                <div className="order-2 lg:order-1 pr-0 lg:pr-10">
                                    <span className="inline-block px-3 py-1 bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
                                        Featured
                                    </span>
                                    <h1 className="text-4xl md:text-6xl font-bold font-heading leading-tight mb-6 group-hover:text-[var(--color-accent-primary)] transition-colors">
                                        {featuredPost.title}
                                    </h1>
                                    <p className="text-[var(--color-secondary-text)] text-lg mb-8 line-clamp-3 leading-relaxed">
                                        Join us as we explore deep ideas, compelling narratives, and thoughtful discussions curated just for you. This featured editorial breaks down the essence of modern living and learning.
                                    </p>
                                    <div className="flex items-center text-sm font-medium">
                                        <span className="px-5 py-2.5 bg-[var(--color-primary-text)] text-white rounded-full group-hover:bg-black transition-colors">
                                            Read Article
                                        </span>
                                        <div className="ml-6 flex items-center text-[var(--color-secondary-text)]">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-3 border border-[var(--color-border-light)]">
                                                 <img src={featuredPost.authorAvatarId ? appwriteService.getFilePreview(featuredPost.authorAvatarId) : `https://ui-avatars.com/api/?name=${encodeURIComponent(featuredPost.authorName || 'Author')}&background=random`} alt="author" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-[var(--color-primary-text)] font-semibold leading-tight">{featuredPost.authorName || 'Anonymous Author'}</p>
                                                <p className="text-xs">{featuredDate} &middot; {featuredReadTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="order-1 lg:order-2 w-full aspect-[4/3] rounded-[32px] overflow-hidden image-zoom-container bg-gray-100 shadow-xl">
                                    {featuredPost.featuredimage && (
                                        <img src={appwriteService.getFilePreview(featuredPost.featuredimage)} alt={featuredPost.title} className="w-full h-full object-cover" />
                                    )}
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Tabbed Feed Section */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border-light)] pb-0">
                    <div className="flex items-center space-x-6">
                        <button 
                            onClick={() => setActiveTab('foryou')}
                            className={`flex items-center space-x-2 text-lg font-bold font-heading pb-4 -mb-[1px] border-b-2 transition-colors ${activeTab === 'foryou' ? 'border-black text-black' : 'border-transparent text-[var(--color-secondary-text)] hover:text-black'}`}
                        >
                            <TrendingUp className="w-5 h-5" />
                            <span>For You</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('following')}
                            className={`flex items-center space-x-2 text-lg font-bold font-heading pb-4 -mb-[1px] border-b-2 transition-colors ${activeTab === 'following' ? 'border-black text-black' : 'border-transparent text-[var(--color-secondary-text)] hover:text-black'}`}
                        >
                            <Users className="w-5 h-5" />
                            <span>Following</span>
                        </button>
                        <button 
                            onClick={() => setActiveTab('latest')}
                            className={`flex items-center space-x-2 text-lg font-bold font-heading pb-4 -mb-[1px] border-b-2 transition-colors ${activeTab === 'latest' ? 'border-black text-black' : 'border-transparent text-[var(--color-secondary-text)] hover:text-black'}`}
                        >
                            <Clock className="w-5 h-5" />
                            <span>Latest</span>
                        </button>
                    </div>
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[360px] grid-flow-dense'>
                    {gridPosts.length > 0 ? (
                        gridPosts.map((post, index) => {
                            // Assign varying spans to create a masonry bento effect
                            let colSpan = "col-span-1";
                            let rowSpan = "row-span-1";
                            
                            if (index === 0) {
                                colSpan = "md:col-span-2 lg:col-span-2";
                                rowSpan = "md:row-span-2 lg:row-span-2"; // large square
                            } else if (index === 3) {
                                colSpan = "md:col-span-2 lg:col-span-2"; // wide card
                            } else if (index === 5) {
                                rowSpan = "md:row-span-2 lg:row-span-2"; // tall card
                            }

                            return (
                                <div key={post.$id} className={`${colSpan} ${rowSpan}`}>
                                    <Postcard {...post} />
                                </div>
                            )
                        })
                    ) : (
                        !featuredPost && (
                            <div className='col-span-full py-20 text-center'>
                                <p className="text-xl text-[var(--color-secondary-text)] font-heading">No posts available at the moment. Check back later.</p>
                            </div>
                        )
                    )}
                </div>
            </Container>
        </div>
    );
}

export default Home;
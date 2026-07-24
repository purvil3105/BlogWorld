import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import authService from "../appwrite/auth";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { UserAvatar } from '../components';
import { Edit3, Trash2, ArrowLeft, Clock, Share2, Heart, MessageCircle, Bookmark, Plus, Check } from 'lucide-react';

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData?.userData?.$id : false;

    const [loading, setLoading] = useState(true);
    
    // Social Features State
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [showComments, setShowComments] = useState(true);
    const commentsRef = useRef(null);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (post) {
            // Load comments
            if (post.comments) {
                try {
                    setComments(JSON.parse(post.comments));
                } catch(e) {
                    setComments([]);
                }
            }
            
            // Load likes
            const currentUserId = userData?.userData?.$id;
            const postLikes = post.likes || [];
            setLikeCount(postLikes.length);
            if (currentUserId) {
                setIsLiked(postLikes.includes(currentUserId));
            }

            // Load bookmarks
            authService.getUserBookmarks().then(bookmarks => {
                setIsBookmarked(bookmarks.includes(post.$id));
            });
            // Load follow status
            if (currentUserId && post.userId && currentUserId !== post.userId) {
                appwriteService.isFollowing(currentUserId, post.userId).then(followDoc => {
                    setIsFollowing(!!followDoc);
                });
            }
        }
    }, [post, userData]);

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                    setLoading(false);
                } else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

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

    const deletePost = () => {
        if(window.confirm("Are you sure you want to delete this article? This action cannot be undone.")) {
            appwriteService.Deletepost(post.$id).then((status) => {
                if (status) {
                    appwriteService.deleteFile(post.featuredimage);
                    navigate(-1);
                }
            });
        }
    };

    const toggleLike = async () => {
        if (!userData) {
            alert("Please login to like this post");
            return;
        }
        const currentUserId = userData.userData.$id;
        let newLikes = post.likes || [];
        
        if (isLiked) {
            newLikes = newLikes.filter(id => id !== currentUserId);
        } else {
            newLikes = [...newLikes, currentUserId];
        }
        
        setIsLiked(!isLiked);
        setLikeCount(newLikes.length);
        
        // Update local post object
        setPost({...post, likes: newLikes});
        
        // Update in backend
        await appwriteService.updatePostInteractions(post.$id, { likes: newLikes });
        
        if (!isLiked) {
            appwriteService.logActivity(currentUserId, 'like', post.$id, `Liked the story: ${post.title}`);
        }
    };

    const toggleBookmark = async () => {
        if (!userData) {
            alert("Please login to bookmark this post");
            return;
        }
        const currentBookmarks = await authService.getUserBookmarks();
        let newBookmarks;
        
        if (isBookmarked) {
            newBookmarks = currentBookmarks.filter(id => id !== post.$id);
        } else {
            newBookmarks = [...currentBookmarks, post.$id];
        }
        
        setIsBookmarked(!isBookmarked);
        await authService.updateUserBookmarks(newBookmarks);
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: post.title,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing", err);
        }
    };

    const toggleFollow = async () => {
        if (!userData) {
            alert("Please login to follow authors");
            return;
        }
        const currentUserId = userData.userData.$id;
        const targetUserId = post.userId;
        
        if (isFollowing) {
            await appwriteService.unfollowUser(targetUserId);
            setIsFollowing(false);
        } else {
            const followerName = userData?.userData?.name || "Author";
            const followingName = post.authorName || "Author";
            await appwriteService.followUser(currentUserId, targetUserId, followerName, followingName);
            setIsFollowing(true);
            appwriteService.logActivity(currentUserId, 'follow', targetUserId, `Started following ${post.authorName}`);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if(!commentText.trim()) return;
        
        const newComment = {
            id: Date.now(),
            author: userData?.userData?.name || "Anonymous",
            userId: userData?.userData?.$id,
            text: commentText,
            time: new Date().toLocaleDateString()
        };
        
        const newComments = [newComment, ...comments];
        setComments(newComments);
        setCommentText("");
        
        // Update local post object
        setPost({...post, comments: JSON.stringify(newComments)});
        
        // Update in backend
        await appwriteService.updatePostInteractions(post.$id, { comments: JSON.stringify(newComments) });
        appwriteService.logActivity(userData.userData.$id, 'comment', post.$id, `Commented on the story: ${post.title}`);
    };

    return post ? (
        <article className="w-full min-h-screen bg-[var(--color-primary-bg)] pb-32">
            {/* Header / Hero Section */}
            <div className="w-full max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-12">
                <button onClick={() => navigate(-1)} className="inline-flex items-center space-x-2 text-sm font-medium text-[var(--color-secondary-text)] hover:text-black transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to stories</span>
                </button>

                <div className="flex items-center space-x-4 mb-6 text-sm text-[var(--color-secondary-text)] uppercase tracking-wider font-semibold">
                    <span>{post.category || 'Editorial'}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> 5 min read</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading leading-[1.1] tracking-tight text-[var(--color-primary-text)] mb-8">
                    {post.title}
                </h1>

                <div className="flex items-center justify-between py-6 border-y border-[var(--color-border-light)] mb-12">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400 overflow-hidden">
                            <UserAvatar userId={post.userId} name={post.authorName} />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-3">
                                <Link to={`/user/${post.userId}`} className="font-semibold text-lg text-[var(--color-primary-text)] leading-tight hover:underline">
                                    {post.authorName || 'By Author'}
                                </Link>
                                {!isAuthor && (
                                    <button 
                                        onClick={toggleFollow}
                                        className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                                            isFollowing ? 'bg-gray-100 text-[var(--color-secondary-text)]' : 'bg-black text-white hover:bg-gray-800'
                                        }`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-[var(--color-secondary-text)]">{post.status === 'inactive' ? 'Draft' : 'Published recently'}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-3">
                        <button onClick={toggleLike} className="flex items-center space-x-1.5 h-10 px-3 rounded-full border border-[var(--color-border-light)] text-[var(--color-secondary-text)] hover:bg-white hover:text-red-500 hover:shadow-sm transition-all bg-transparent">
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                            <span className="text-sm font-medium">{likeCount}</span>
                        </button>
                        <button onClick={() => {
                            setShowComments(true);
                            commentsRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }} className="flex items-center space-x-1.5 h-10 px-3 rounded-full border border-[var(--color-border-light)] text-[var(--color-secondary-text)] hover:bg-white hover:text-black hover:shadow-sm transition-all bg-transparent">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">{comments.length}</span>
                        </button>
                        <button onClick={toggleBookmark} className="w-10 h-10 rounded-full border border-[var(--color-border-light)] flex items-center justify-center text-[var(--color-secondary-text)] hover:bg-white hover:text-black hover:shadow-sm transition-all bg-transparent">
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-black text-black' : ''}`} />
                        </button>
                        <button onClick={handleShare} className="w-10 h-10 rounded-full border border-[var(--color-border-light)] flex items-center justify-center text-[var(--color-secondary-text)] hover:bg-white hover:text-black hover:shadow-sm transition-all bg-transparent">
                            <Share2 className="w-4 h-4" />
                        </button>
                        
                        {isAuthor && (
                            <>
                                <Link to={`/edit-post/${post.$id}`} className="w-10 h-10 rounded-full border border-[var(--color-border-light)] flex items-center justify-center text-[var(--color-secondary-text)] hover:bg-[var(--color-accent-primary)] hover:text-white hover:border-transparent hover:shadow-sm transition-all bg-transparent">
                                    <Edit3 className="w-4 h-4" />
                                </Link>
                                <button onClick={deletePost} className="w-10 h-10 rounded-full border border-[var(--color-border-light)] flex items-center justify-center text-[var(--color-secondary-text)] hover:bg-red-500 hover:text-white hover:border-transparent hover:shadow-sm transition-all bg-transparent">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            {post.featuredimage && (
                <div className="w-full max-w-6xl mx-auto px-4 md:px-6 mb-16 md:mb-24">
                    <figure className="w-full aspect-[21/9] md:aspect-[2.5/1] overflow-hidden rounded-[24px] md:rounded-[32px] shadow-[var(--shadow-editorial)]">
                        <img
                            src={appwriteService.getFilePreview(post.featuredimage)}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out"
                        />
                    </figure>
                </div>
            )}

            {/* Content Body */}
            <div className="w-full max-w-3xl mx-auto px-6">
                <div className="prose prose-lg md:prose-xl max-w-none text-[var(--color-primary-text)] font-body font-light leading-relaxed prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[var(--color-accent-primary)] prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-md prose-blockquote:border-l-4 prose-blockquote:border-[var(--color-accent-primary)] prose-blockquote:bg-[var(--color-secondary-bg)] prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:font-heading prose-blockquote:text-xl prose-blockquote:italic mb-16">
                    {parse(post.content)}
                </div>

                {/* Comments Section */}
                {showComments && (
                    <div ref={commentsRef} className="border-t border-[var(--color-border-light)] pt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-2xl font-bold font-heading mb-8">Responses ({comments.length})</h3>
                        
                        {/* Comment Form */}
                        {userData ? (
                            <form onSubmit={handleAddComment} className="mb-10">
                                <div className="flex space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-400 overflow-hidden flex-shrink-0">
                                        <UserAvatar userId={userData?.userData?.$id} name={userData?.userData?.name} />
                                    </div>
                                    <div className="flex-1">
                                        <textarea 
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="What are your thoughts?" 
                                            className="w-full bg-white border border-[var(--color-border-light)] rounded-2xl p-4 focus:outline-none focus:border-black transition-colors resize-none h-24"
                                        ></textarea>
                                        <div className="flex justify-end mt-3">
                                            <button 
                                                type="submit" 
                                                disabled={!commentText.trim()}
                                                className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                            >
                                                Respond
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-gray-50 border border-[var(--color-border-light)] rounded-2xl p-6 text-center mb-10">
                                <p className="text-[var(--color-secondary-text)] mb-4">Sign in to join the conversation.</p>
                                <Link to="/login" className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors inline-block">Login</Link>
                            </div>
                        )}

                        {/* Comments List */}
                        <div className="space-y-8">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                        <UserAvatar userId={comment.userId} name={comment.author} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-white border border-[var(--color-border-light)] rounded-2xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-sm">{comment.author}</h4>
                                                <span className="text-xs text-[var(--color-secondary-text)]">{comment.time}</span>
                                            </div>
                                            <p className="text-[var(--color-secondary-text)] text-sm leading-relaxed">{comment.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    ) : null;
}
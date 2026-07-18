import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import { Container, Postcard } from '../components';
import { useSelector } from 'react-redux';
import { MapPin, Users, FileText } from 'lucide-react';

export default function PublicProfile() {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [followersCount, setFollowersCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const userData = useSelector(state => state.auth.userData);
    
    useEffect(() => {
        const fetchPublicData = async () => {
            setLoading(true);
            try {
                // Fetch public profile from the profiles collection
                const profileData = await appwriteService.getProfile(userId);
                setProfile(profileData);
                
                // Fetch user's posts
                const userPosts = await appwriteService.getCurrentUserPosts(userId);
                if (userPosts) setPosts(userPosts.documents);
                
                // Fetch followers count
                const count = await appwriteService.getFollowersCount(userId);
                setFollowersCount(count || 0);
                
                // Check if current logged-in user is following this profile
                if (userData?.userData?.$id && userData.userData.$id !== userId) {
                    const followDoc = await appwriteService.isFollowing(userData.userData.$id, userId);
                    setIsFollowing(!!followDoc);
                }
            } catch (error) {
                console.error("Error fetching public profile", error);
            } finally {
                setLoading(false);
            }
        };
        
        if (userId) {
            fetchPublicData();
        }
    }, [userId, userData]);
    
    const handleFollowToggle = async () => {
        if (!userData) {
            alert("Please login to follow authors");
            return;
        }
        
        const currentUserId = userData.userData.$id;
        if (currentUserId === userId) return; // Can't follow self
        
        if (isFollowing) {
            const followDoc = await appwriteService.isFollowing(currentUserId, userId);
            if (followDoc) {
                await appwriteService.unfollowUser(followDoc.$id);
                setIsFollowing(false);
                setFollowersCount(prev => prev - 1);
            }
        } else {
            const followerName = userData?.userData?.name || "Author";
            const followingName = profile?.name || "Author";
            await appwriteService.followUser(currentUserId, userId, followerName, followingName);
            setIsFollowing(true);
            setFollowersCount(prev => prev + 1);
            appwriteService.logActivity(currentUserId, 'follow', userId, `Started following ${followingName}`);
        }
    };
    
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
    
    if (!profile && posts.length === 0) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[var(--color-primary-bg)]">
                <p className="text-[var(--color-secondary-text)] font-medium">Profile not found.</p>
            </div>
        );
    }

    const displayName = profile?.name || "Author";
    const displayBio = profile?.bio || "No bio provided.";

    return (
        <div className='w-full min-h-screen bg-[var(--color-primary-bg)] pb-24'>
            {/* Profile Header */}
            <div className="w-full bg-white border-b border-[var(--color-border-light)] py-16 mb-16">
                <Container>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl mx-auto">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-[var(--shadow-editorial)] border border-[var(--color-border-light)] overflow-hidden flex-shrink-0 bg-gray-100">
                            {profile?.avatarId ? (
                                <img src={appwriteService.getFilePreview(profile.avatarId)} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`} alt={displayName} className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="flex-1 text-center md:text-left pt-2">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight text-[var(--color-primary-text)]">{displayName}</h1>
                                
                                {userData?.userData?.$id !== userId && (
                                    <button 
                                        onClick={handleFollowToggle}
                                        className={`mt-4 md:mt-0 px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${
                                            isFollowing 
                                                ? 'bg-gray-100 text-[var(--color-secondary-text)] hover:bg-gray-200' 
                                                : 'bg-black text-white hover:bg-gray-800'
                                        }`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                )}
                            </div>
                            
                            <p className="text-[var(--color-secondary-text)] text-lg mb-6 max-w-2xl">{displayBio}</p>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-semibold text-[var(--color-secondary-text)]">
                                {profile?.country && (
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {profile.country}
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <FileText className="w-4 h-4 mr-2" />
                                    {posts.length} Stories
                                </div>
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2" />
                                    {followersCount} Followers
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* User's Stories */}
            <Container>
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl font-bold font-heading mb-8 text-[var(--color-primary-text)]">Stories by {displayName}</h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <div key={post.$id}>
                                    <Postcard {...post} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-[var(--color-secondary-text)]">No stories published yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}

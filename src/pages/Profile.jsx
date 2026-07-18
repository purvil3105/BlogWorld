import React, { useState, useEffect, useMemo } from 'react'
import { Container, Postcard, ActivityTimeline, UserAvatar } from '../components'
import appwriteService from "../appwrite/config"
import { useSelector } from 'react-redux'
import { UserCircle, MapPin, Calendar, Mail, Edit2, FileText, Heart, MessageCircle, Activity, Users } from 'lucide-react'
import authService from '../appwrite/auth'

function Profile() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [userPrefs, setUserPrefs] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [followersCount, setFollowersCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const [activity, setActivity] = useState([])
    const [activeTab, setActiveTab] = useState('stories')
    const userData = useSelector(state => state.auth.userData)
    const userName = userData?.userData?.name || "Author";

    const [followersList, setFollowersList] = useState([])
    const [profileDoc, setProfileDoc] = useState(null)
    const [editForm, setEditForm] = useState({
        name: '',
        bio: '',
        country: '',
        avatarId: '',
        newAvatarFile: null
    })

    const stats = useMemo(() => {
        if (!posts || posts.length === 0) {
            return { totalArticles: 0, totalLikes: 0, totalComments: 0 };
        }
        
        const totalArticles = posts.length;
        const totalLikes = posts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
        // Fallback for comments if they are directly on the document (or we just mock it for now since there might not be a comment count field directly without fetching)
        const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
        
        return { totalArticles, totalLikes, totalComments };
    }, [posts]);

    useEffect(() => {
        const uid = userData?.userData?.$id || userData?.$id;
        if (uid) {
            Promise.all([
                appwriteService.getCurrentUserPosts(uid),
                appwriteService.getProfile(uid),
                appwriteService.getFollowersCount(uid),
                appwriteService.getFollowingCount(uid),
                appwriteService.getUserActivity(uid),
                appwriteService.getFollowersList(uid)
            ]).then(([postsResponse, profileResponse, followers, following, activityResp, followersListResp]) => {
                if (postsResponse) {
                    setPosts(postsResponse.documents)
                }
                
                if (profileResponse) {
                    setProfileDoc(profileResponse);
                    setUserPrefs(profileResponse);
                    setEditForm({
                        name: profileResponse.name || userName || '',
                        bio: profileResponse.bio || '',
                        country: profileResponse.country || '',
                        avatarId: profileResponse.avatarId || '',
                        newAvatarFile: null
                    });
                } else {
                    setEditForm({
                        name: userName || '',
                        bio: '',
                        country: '',
                        avatarId: '',
                        newAvatarFile: null
                    });
                }
                
                setFollowersCount(followers || 0);
                setFollowingCount(following || 0);
                setActivity(activityResp ? activityResp.documents : []);
                setFollowersList(followersListResp ? followersListResp.documents : []);
                setLoading(false)
            }).catch(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [userData])

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[var(--color-primary-bg)]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-t-2 border-b-2 border-black rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--color-secondary-text)] font-medium tracking-widest uppercase text-xs">Loading</p>
                </div>
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[var(--color-primary-bg)]">
                <p className="text-[var(--color-secondary-text)] font-medium">Please login to view your profile.</p>
            </div>
        )
    }

    const userEmail = userData?.userData?.email || userData?.email || '';

    const isProfileComplete = userPrefs?.bio && userPrefs?.country;

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            if (editForm.name && editForm.name !== userName) {
                await authService.updateName(editForm.name);
            }
            
            let finalAvatarId = editForm.avatarId;
            if (editForm.newAvatarFile) {
                const fileRes = await appwriteService.uploadFile(editForm.newAvatarFile);
                if (fileRes) {
                    finalAvatarId = fileRes.$id;
                }
            }

            const profileData = {
                name: editForm.name,
                bio: editForm.bio,
                country: editForm.country,
                avatarId: finalAvatarId
            };
            
            if (profileDoc) {
                await appwriteService.updateProfile(profileDoc.$id, profileData);
            } else {
                const uid = userData?.userData?.$id || userData?.$id;
                const newDoc = await appwriteService.createProfile(uid, profileData);
                setProfileDoc(newDoc);
            }
            
            setUserPrefs(profileData);
            setIsEditing(false);
            window.location.reload(); 
        } catch (error) {
            alert('Error updating profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className='w-full min-h-screen bg-[var(--color-primary-bg)] pb-24'>
            {/* Profile Header */}
            <div className="w-full bg-white border-b border-[var(--color-border-light)] py-16 mb-16">
                <Container>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-4xl mx-auto">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-[var(--shadow-editorial)] border border-[var(--color-border-light)] overflow-hidden flex-shrink-0 bg-gray-100 relative group">
                            {editForm.newAvatarFile ? (
                                <img src={URL.createObjectURL(editForm.newAvatarFile)} alt={userName} className="w-full h-full object-cover" />
                            ) : (editForm.avatarId || profileDoc?.avatarId) ? (
                                <img src={appwriteService.getFilePreview(editForm.avatarId || profileDoc.avatarId)} alt={userName} className="w-full h-full object-cover" />
                            ) : (
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`} alt={userName} className="w-full h-full object-cover" />
                            )}
                            {isEditing && (
                                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white text-xs font-semibold">
                                    <Edit2 className="w-6 h-6 mb-1" />
                                    Change Photo
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/png, image/jpg, image/jpeg, image/gif"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setEditForm({...editForm, newAvatarFile: e.target.files[0]});
                                            }
                                        }} 
                                    />
                                </label>
                            )}
                        </div>
                        <div className="flex-1 text-center md:text-left pt-2">
                            <h1 className="text-4xl md:text-5xl font-bold font-heading tracking-tight mb-4 text-[var(--color-primary-text)]">{userName}</h1>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6 text-sm text-[var(--color-secondary-text)]">
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {userEmail}
                                </div>
                                {userPrefs?.country && (
                                    <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        {userPrefs.country}
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Joined Recently
                                </div>
                                <div className="flex items-center">
                                    <UserCircle className="w-4 h-4 mr-2" />
                                    {posts.length} stories published
                                </div>
                            </div>

                            {/* Inline Profile Form */}
                            <div className="w-full max-w-2xl bg-white/50 rounded-2xl border border-[var(--color-border-light)] p-6 space-y-4 text-left">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--color-secondary-text)] uppercase tracking-wider mb-1">Display Name</label>
                                        <input 
                                            type="text" 
                                            value={editForm.name} 
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            disabled={!isEditing}
                                            className="w-full bg-transparent border-b border-[var(--color-border-light)] py-2 text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-70 disabled:bg-transparent"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-[var(--color-secondary-text)] uppercase tracking-wider mb-1">Country</label>
                                        <input 
                                            type="text" 
                                            value={editForm.country} 
                                            onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                                            disabled={!isEditing}
                                            className="w-full bg-transparent border-b border-[var(--color-border-light)] py-2 text-sm focus:outline-none focus:border-black transition-colors disabled:opacity-70 disabled:bg-transparent"
                                            placeholder="e.g. United States"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-semibold text-[var(--color-secondary-text)] uppercase tracking-wider mb-1">Bio</label>
                                    <textarea 
                                        value={editForm.bio} 
                                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                        disabled={!isEditing}
                                        className="w-full bg-transparent border-b border-[var(--color-border-light)] py-2 text-sm focus:outline-none focus:border-black transition-colors resize-none h-auto disabled:opacity-70 disabled:bg-transparent"
                                        placeholder="Tell us a little about yourself"
                                        rows={2}
                                    ></textarea>
                                </div>

                            </div>
                            
                            <div className="mt-8 flex justify-center md:justify-start gap-3">
                                {!isEditing ? (
                                    <button 
                                        onClick={handleEditProfile}
                                        className="flex items-center space-x-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        <span>{isProfileComplete ? "Edit Profile" : "Complete Profile"}</span>
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2.5 rounded-full text-sm font-medium border border-[var(--color-border-light)] text-[var(--color-secondary-text)] hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="flex items-center space-x-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                        >
                                            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Statistics Dashboard */}
            <Container>
                <div className="max-w-6xl mx-auto mb-16">
                    <h2 className="text-xl font-bold font-heading mb-6 border-b border-[var(--color-border-light)] pb-4 text-[var(--color-primary-text)]">Creator Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                            <Users className="w-6 h-6 text-indigo-500 mb-2" />
                            <span className="text-3xl font-bold text-[var(--color-primary-text)] font-heading">{followersCount}</span>
                            <span className="text-xs font-semibold text-[var(--color-secondary-text)] uppercase tracking-wider mt-1">Followers</span>
                        </div>
                        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                            <Users className="w-6 h-6 text-teal-500 mb-2" />
                            <span className="text-3xl font-bold text-[var(--color-primary-text)] font-heading">{followingCount}</span>
                            <span className="text-xs font-semibold text-[var(--color-secondary-text)] uppercase tracking-wider mt-1">Following</span>
                        </div>
                        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                            <FileText className="w-6 h-6 text-[var(--color-secondary-text)] mb-2" />
                            <span className="text-3xl font-bold text-[var(--color-primary-text)] font-heading">{stats.totalArticles}</span>
                            <span className="text-xs font-semibold text-[var(--color-secondary-text)] uppercase tracking-wider mt-1">Stories</span>
                        </div>
                        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                            <Heart className="w-6 h-6 text-red-500 mb-2" />
                            <span className="text-3xl font-bold text-[var(--color-primary-text)] font-heading">{stats.totalLikes}</span>
                            <span className="text-xs font-semibold text-[var(--color-secondary-text)] uppercase tracking-wider mt-1">Total Likes</span>
                        </div>
                        <div className="bg-white rounded-2xl border border-[var(--color-border-light)] p-5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                            <Activity className="w-6 h-6 text-green-500 mb-2" />
                            <span className="text-3xl font-bold text-[var(--color-primary-text)] font-heading">{posts.length > 0 ? "Active" : "New"}</span>
                            <span className="text-xs font-semibold text-[var(--color-secondary-text)] uppercase tracking-wider mt-1">Status</span>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Profile Content Tabs */}
            <Container>
                <div className="max-w-6xl mx-auto">
                    <div className="flex space-x-8 border-b border-[var(--color-border-light)] mb-8">
                        <button 
                            onClick={() => setActiveTab('stories')} 
                            className={`pb-4 text-xl font-bold font-heading transition-colors ${activeTab === 'stories' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
                        >
                            Stories
                        </button>
                        <button 
                            onClick={() => setActiveTab('activity')} 
                            className={`pb-4 text-xl font-bold font-heading transition-colors ${activeTab === 'activity' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
                        >
                            Activity Timeline
                        </button>
                        <button 
                            onClick={() => setActiveTab('network')} 
                            className={`pb-4 text-xl font-bold font-heading transition-colors ${activeTab === 'network' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
                        >
                            Network
                        </button>
                    </div>
                    
                    {activeTab === 'stories' && (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <div key={post.$id}>
                                        <Postcard {...post} />
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 bg-white/50 border border-[var(--color-border-light)] rounded-[24px]">
                                    <p className="text-[var(--color-secondary-text)] mb-4">You haven't written any stories yet.</p>
                                    <a href="/add-post" className="text-black font-medium hover:underline">Start writing</a>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'activity' && (
                        <ActivityTimeline activities={activity} />
                    )}
                    
                    {activeTab === 'network' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {followersList.length > 0 ? (
                                followersList.map((follower) => (
                                    <a href={`/user/${follower.followerId}`} key={follower.$id} className="bg-white border border-[var(--color-border-light)] rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow group">
                                        <div className="w-20 h-20 rounded-full mb-4 bg-gray-100 overflow-hidden group-hover:scale-105 transition-transform">
                                            <UserAvatar userId={follower.followerId} name={follower.followerName} />
                                        </div>
                                        <h3 className="font-bold font-heading text-lg text-[var(--color-primary-text)] group-hover:text-[var(--color-accent-primary)] transition-colors">{follower.followerName || 'Anonymous'}</h3>
                                    </a>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20 bg-white/50 border border-[var(--color-border-light)] rounded-[24px]">
                                    <p className="text-[var(--color-secondary-text)]">You don't have any followers yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Profile

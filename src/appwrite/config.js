import axiosInstance from '../conf/axiosInstance';
import conf from '../conf/conf';

export class Service {
    async createPost({ title, slug, content, featuredimage, status, userId, category, likes, comments, authorName, authorAvatarId }) {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('slug', slug);
            formData.append('content', content);
            formData.append('status', status);
            if (category) formData.append('category', category);
            if (authorName) formData.append('authorName', authorName);
            if (authorAvatarId) formData.append('authorAvatarId', authorAvatarId);
            
            if (featuredimage) {
                // If it's a File object from an input type="file"
                formData.append('featuredimage', featuredimage);
            }
            
            const response = await axiosInstance.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return { $id: response.data._id, ...response.data };
        } catch (error) {
            console.log("Service :: createPost :: error", error);
        }
    }

    async updatePost(slug, { title, content, featuredimage, status, category }) {
        try {
            // First we need to get the post ID from slug because our backend update route uses ID
            const postResponse = await axiosInstance.get(`/posts/slug/${slug}`);
            const postId = postResponse.data._id;

            const formData = new FormData();
            if (title) formData.append('title', title);
            if (content) formData.append('content', content);
            if (status) formData.append('status', status);
            if (category) formData.append('category', category);
            // We pass featuredimage only if a new file is selected
            if (featuredimage && typeof featuredimage !== 'string') {
                formData.append('featuredimage', featuredimage);
            }

            const response = await axiosInstance.put(`/posts/${postId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return { $id: response.data._id, ...response.data };
        } catch (error) {
            console.log("Service :: updatePost :: error", error);
        }
    }
    
    async updatePostInteractions(postId, { likes, comments }) {
        try {
            const payload = {};
            if (likes !== undefined) payload.likes = likes;
            if (comments !== undefined) payload.comments = comments;
            const response = await axiosInstance.put(`/posts/${postId}/interactions`, payload);
            return response.data;
        } catch (error) {
            console.log("Service :: updatePostInteractions :: error", error);
            return false;
        }
    }

    async deletePost(slug) {
        try {
            const postResponse = await axiosInstance.get(`/posts/slug/${slug}`);
            const postId = postResponse.data._id;
            
            await axiosInstance.delete(`/posts/${postId}`);
            return true;
        } catch (error) {
            console.log("Service :: deletePost :: error", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            const response = await axiosInstance.get(`/posts/slug/${slug}`);
            return { $id: response.data._id, ...response.data };
        } catch (error) {
            console.log("Service :: getPost :: error", error);
            return false;
        }
    }

    async getPosts() {
        try {
            const response = await axiosInstance.get('/posts');
            // Map MongoDB _id to $id for frontend compatibility
            const docs = response.data.documents.map(doc => ({ $id: doc._id, ...doc }));
            return { documents: docs };
        } catch (error) {
            console.log("Service :: getPosts :: error", error);
            return false;
        }
    }

    async getTrendingFeed() {
        try {
            const response = await axiosInstance.get('/posts/trending');
            const docs = response.data.documents.map(doc => ({ $id: doc._id, ...doc }));
            return { documents: docs };
        } catch (error) {
            console.log("Service :: getTrendingFeed :: error", error);
            return false;
        }
    }

    async getFollowingFeed(userId) {
        try {
            const response = await axiosInstance.get('/posts/following');
            const docs = response.data.documents.map(doc => ({ $id: doc._id, ...doc }));
            return { documents: docs };
        } catch (error) {
            console.log("Service :: getFollowingFeed :: error", error);
            return false;
        }
    }

    async getCurrentUserPosts(userId) {
        try {
            const response = await axiosInstance.get(`/posts/user/${userId}`);
            const docs = response.data.documents.map(doc => ({ $id: doc._id, ...doc }));
            return { documents: docs };
        } catch (error) {
            console.log("Service :: getCurrentUserPosts :: error", error);
            return false;
        }
    }

    // Storage service
    async uploadFile(file) {
        try {
            // In the new backend, files are uploaded along with the post data
            // We return the file object itself so it can be passed to createPost/updatePost
            return file; 
        } catch (error) {
            console.log("Service :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        // Cloudinary handles this via backend when deleting a post, or we leave it.
        return true;
    }

    getFilePreview(fileId) {
        if (!fileId) return null;
        if (fileId.startsWith('http')) return fileId;
        // Legacy Cloudinary fallback or no image
        return null;
    }

    async isFollowing(followerId, followingId) {
        try {
            const response = await axiosInstance.get(`/users/follow/status/${followingId}`);
            return response.data.isFollowing;
        } catch (error) {
            console.log("Service :: isFollowing :: error", error);
            return false;
        }
    }

    async getFollowersCount(userId) {
        try {
            const response = await axiosInstance.get(`/users/followers/count/${userId}`);
            return response.data.count;
        } catch (error) {
            console.log("Service :: getFollowersCount :: error", error);
            return 0;
        }
    }

    async getFollowingCount(userId) {
        try {
            const response = await axiosInstance.get(`/users/following/count/${userId}`);
            return response.data.count;
        } catch (error) {
            console.log("Service :: getFollowingCount :: error", error);
            return 0;
        }
    }

    async getFollowersList(userId) {
        try {
            const response = await axiosInstance.get(`/users/followers/list/${userId}`);
            const docs = response.data.map(doc => ({ $id: doc._id, ...doc }));
            return { documents: docs };
        } catch (error) {
            console.log("Service :: getFollowersList :: error", error);
            return { documents: [] };
        }
    }

    async followUser(followerId, targetUserId, followerName, followingName) {
        try {
            const response = await axiosInstance.post('/users/follow', { targetUserId });
            return response.data;
        } catch (error) {
            console.log("Service :: followUser :: error", error);
            return false;
        }
    }

    async unfollowUser(targetUserId) {
        try {
            const response = await axiosInstance.post('/users/unfollow', { targetUserId });
            return response.data;
        } catch (error) {
            console.log("Service :: unfollowUser :: error", error);
            return false;
        }
    }

    // --- Public Profiles ---

    async getProfile(userId) {
        try {
            const response = await axiosInstance.get(`/users/profile/${userId}`);
            return response.data;
        } catch (error) {
            console.log("Service :: getProfile :: error", error);
            return null;
        }
    }

    async createProfile(userId, { name, bio, country, avatarId }) {
        try {
            const formData = new FormData();
            if (bio) formData.append('bio', bio);
            if (country) formData.append('country', country); // Need to add to backend model if desired
            if (avatarId && typeof avatarId !== 'string') {
                formData.append('avatar', avatarId); // Assuming avatarId is the File
            }
            const response = await axiosInstance.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.log("Service :: createProfile :: error", error);
            return false;
        }
    }

    async updateProfile(documentId, { name, bio, country, avatarId }) {
        // documentId is likely the profile id, but our backend uses the logged in user
        return this.createProfile(null, { name, bio, country, avatarId });
    }

    async getProfiles(queries = []) {
        try {
            const response = await axiosInstance.get('/users/profiles');
            const docs = response.data.map(doc => {
                const userName = doc.name || (doc.userId ? doc.userId.name : 'Unknown');
                const finalUserId = doc.userId ? doc.userId._id || doc.userId : null;
                return { ...doc, $id: doc._id, name: userName, userId: finalUserId };
            });
            return { documents: docs };
        } catch (error) {
            console.log("Service :: getProfiles :: error", error);
            return { documents: [] };
        }
    }

    // --- Activity Timeline ---

    async logActivity(userId, type, targetId, message) {
        try {
            const response = await axiosInstance.post('/activities', { userId, type, targetId, message });
            return response.data;
        } catch (error) {
            console.log("Appwrite service :: logActivity :: error", error);
            return false;
        }
    }

    async getUserActivity(userId) {
        try {
            const response = await axiosInstance.get(`/activities/${userId}`);
            return response.data;
        } catch (error) {
            console.log("Appwrite service :: getUserActivity :: error", error);
            return false;
        }
    }
}

const service = new Service();
export default service

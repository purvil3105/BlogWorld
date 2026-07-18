import conf from '../conf/conf'
import { Client, ID, Databases, Storage, Query, Permission, Role } from "appwrite";


export class Service {
    client = new Client();
    databases;
    bucket;
    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredimage, status, userId, authorName, authorAvatarId, category, likes, comments }) {
        try {
            const payload = {
                title,
                content,
                featuredimage,
                status,
                userId,
                authorName,
                category,
            };
            if (authorAvatarId) payload.authorAvatarId = authorAvatarId;
            if (likes) payload.likes = likes;
            if (comments) payload.comments = comments;

            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                payload
            )
        }
        catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            throw error;
        }
    }

    async Updatepost(slug, { title, content, featuredimage, status, category }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status,
                    category
                }
            )
        } catch (error) {
            console.log("Appwrite service :: Updatepost :: error", error);
        }
    }

    async updatePostInteractions(slug, { likes, comments }) {
        try {
            const updateData = {};
            if (likes !== undefined) updateData.likes = likes;
            if (comments !== undefined) updateData.comments = comments;

            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                updateData
            )
        } catch (error) {
            console.log("Appwrite service :: updatePostInteractions :: error", error);
        }
    }

    async Deletepost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: Deletepost :: error", error);
            return false
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
        } catch (error) {
            console.log("Appwrite service :: getpost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")], userId = null) {
        try {
            if (userId) {
                queries.push(Query.equal("userId", userId));
            }
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
        }
    }

    async getTrendingFeed(queries = []) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal("status", "active"),
                    Query.orderDesc("trendingScore"),
                    Query.limit(20),
                    ...queries
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: getTrendingFeed :: error", error);
            return false;
        }
    }

    async getFollowingFeed(userId) {
        try {
            // Step 1: Get people the user follows
            const follows = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteFollowersCollectionId,
                [
                    Query.equal("followerId", userId),
                    Query.limit(500)
                ]
            );
            
            const followingIds = follows.documents.map(f => f.followingId);
            if (followingIds.length === 0) return { documents: [], total: 0 };

            // Step 2: Get posts from those users
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal("status", "active"),
                    Query.equal("userId", followingIds),
                    Query.orderDesc("$createdAt"),
                    Query.limit(20)
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: getFollowingFeed :: error", error);
            return false;
        }
    }

    async getCurrentUserPosts(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [Query.equal("userId", userId)]
            );
        } catch (error) {
            console.log("Appwrite service :: getCurrentUserPosts :: error", error);
            return false;
        }
    }

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }


    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        return this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId
        )
    }

    // --- Followers System ---

    async followUser(followerId, followingId, followerName = "Unknown", followingName = "Unknown") {
        try {
            // First check if already following to prevent duplicates
            const existing = await this.isFollowing(followerId, followingId);
            if (existing) return existing;

            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteFollowersCollectionId,
                ID.unique(),
                {
                    followerId,
                    followingId,
                    followerName,
                    followingName
                },
                [
                    Permission.delete(Role.user(followerId))
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: followUser :: error", error);
            return false;
        }
    }

    async unfollowUser(documentId) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteFollowersCollectionId,
                documentId
            );
            return true;
        } catch (error) {
            console.log("Appwrite service :: unfollowUser :: error", error);
            return false;
        }
    }

    async isFollowing(followerId, followingId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteFollowersCollectionId,
                [
                    Query.equal("followerId", followerId),
                    Query.equal("followingId", followingId)
                ]
            );
            return response.documents.length > 0 ? response.documents[0] : false;
        } catch (error) {
            console.log("Appwrite service :: isFollowing :: error", error);
            return false;
        }
    }

    async getFollowersCount(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteFollowersCollectionId,
                [Query.equal("followingId", userId)]
            );
            return response.total;
        } catch (error) {
            console.log("Appwrite service :: getFollowersCount :: error", error);
            return 0;
        }
    }

    async getFollowingCount(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteFollowersCollectionId,
                [Query.equal("followerId", userId)]
            );
            return response.total;
        } catch (error) {
            console.log("Appwrite service :: getFollowingCount :: error", error);
            return 0;
        }
    }

    async getFollowersList(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteFollowersCollectionId,
                [Query.equal("followingId", userId), Query.limit(100)]
            );
        } catch (error) {
            console.log("Appwrite service :: getFollowersList :: error", error);
            return false;
        }
    }

    // --- Public Profiles ---

    async getProfile(userId) {
        try {
            const response = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteProfilesCollectionId,
                [Query.equal("userId", userId)]
            );
            return response.documents.length > 0 ? response.documents[0] : null;
        } catch (error) {
            console.log("Appwrite service :: getProfile :: error", error);
            return null;
        }
    }

    async createProfile(userId, { name, bio, country, avatarId }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfilesCollectionId,
                ID.unique(),
                {
                    userId,
                    name,
                    bio: bio || "",
                    country: country || "",
                    avatarId: avatarId || ""
                },
                [
                    Permission.update(Role.user(userId))
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: createProfile :: error", error);
            return false;
        }
    }

    async updateProfile(documentId, { name, bio, country, avatarId }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteProfilesCollectionId,
                documentId,
                { name, bio, country, avatarId }
            );
        } catch (error) {
            console.log("Appwrite service :: updateProfile :: error", error);
            return false;
        }
    }

    async getProfiles(queries = []) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteProfilesCollectionId,
                queries
            );
        } catch (error) {
            console.log("Appwrite service :: getProfiles :: error", error);
            return false;
        }
    }

    // --- Activity Timeline ---

    async logActivity(userId, type, targetId, message) {
        try {
            if (!conf.appwriteActivityCollectionId) return; // Silent fail if not setup
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteActivityCollectionId,
                ID.unique(),
                {
                    userId,
                    type,
                    targetId,
                    message
                }
            );
        } catch (error) {
            console.log("Appwrite service :: logActivity :: error", error);
            return false;
        }
    }

    async getUserActivity(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteActivityCollectionId,
                [
                    Query.equal("userId", userId),
                    Query.orderDesc("$createdAt"),
                    Query.limit(20)
                ]
            );
        } catch (error) {
            console.log("Appwrite service :: getUserActivity :: error", error);
            return false;
        }
    }
}

const service = new Service();
export default service

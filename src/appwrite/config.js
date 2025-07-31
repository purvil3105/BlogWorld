import conf from '../conf/conf'
import { Client, ID, Databases, Storage, Query, Permission, Role } from "appwrite";


export class Service{
    client= new Client();
    databases;
    bucket;
    constructor(){
        this.client
                .setEndpoint(conf.appwriteUrl)
                .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, featuredimage, status, userId}){
        try{
            console.log(featuredimage);
            
             return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status,
                    userId,
                }
             )
        }
        catch(error){
            console.log("Appwrite service :: createPost :: error", error);
        }
    }

    async Updatepost(slug, {title, content, featuredimage, status}){
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
                }
            )
        } catch (error) {
            console.log("Appwrite service :: Updatepost :: error", error);
        }
    }

    async Deletepost(slug){
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

    async getPost(slug){
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
    
    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )
            
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            
        }
    }

    async uploadFile(file){
    try {
        return await this.bucket.createFile(
            conf.appwriteBucketId,
            ID.unique(),
            file,
            [
                Permission.read(Role.any())  // ✅ Public read permission
            ]
        )
    } catch (error) {
        console.log("Appwrite service :: uploadFile :: error", error);
        return false;
    }
}


    async deleteFile(fileId){
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

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        ).href
    }

    
}

const service = new Service();
export default service

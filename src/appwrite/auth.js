import conf from '../conf/conf';
import { Client, Account, ID } from "appwrite";

export class AuthService{
     client= new Client();
     account;

     constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
        console.log(conf.appwriteProjectId);
     }

     async createAccount({email, password, name}){
        try{
             await this.logout();
            const UserAccount = await this.account.create(ID.unique(), email, password, name);
            if(UserAccount){
                return this.login({email, password});
            }
            else{
                return UserAccount;
            }
        }
        catch(error){
            throw error;
        }
     }

     async login({email, password}){
        try {
            // Check if user is already logged in
            const currentUser = await this.getCurrentuser();
            if (currentUser) {
                console.log('User already logged in:', currentUser);
                return currentUser; // Return existing session info
            }
            
            // If no current user, proceed with login
            const session = await this.account.createEmailPasswordSession(email, password);
            console.log('Login successful:', session);
            return session;
        } catch (error) {
            // If error is about existing session, try to get current user
            if (error.code === 401 && error.type === 'user_session_already_exists') {
                console.log('Session already exists, getting current user');
                return await this.getCurrentUser();
            }
            
            console.error("Appwrite service :: login :: error", error);
            throw error;
        }
     }

     async getCurrentuser(){
        try{
            return await this.account.get();
        }
        catch(error){
            console.log("Appwrite service :: getCurrentuser :: error", error);
        }
        return null;
     }

     async logout(){
        try{
            await this.account.deleteSessions();
        }
        catch(error){
            console.log("Appwrite service :: Logout :: error", error);
            
        }
     }
      
}

const authservice = new AuthService();
export default authservice
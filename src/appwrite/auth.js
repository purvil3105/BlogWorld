import axiosInstance from '../conf/axiosInstance';

export class AuthService {
    async createAccount({ email, password, name }) {
        try {
            const response = await axiosInstance.post('/auth/register', { name, email, password });
            if (response.data) {
                return this.login({ email, password });
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                // Return a structure compatible with previous code
                return { $id: response.data._id, ...response.data };
            }
            return response.data;
        } catch (error) {
            console.error("AuthService :: login :: error", error);
            throw error;
        }
    }

    async getCurrentuser() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;
            
            const response = await axiosInstance.get('/auth/me');
            // Mapping to expected Appwrite format
            return {
                $id: response.data._id,
                name: response.data.name,
                email: response.data.email,
                prefs: { bookmarks: response.data.bookmarks }
            };
        } catch (error) {
            console.log("AuthService :: getCurrentuser :: error", error);
            return null;
        }
    }

    async logout() {
        try {
            await axiosInstance.post('/auth/logout');
            localStorage.removeItem('token');
        } catch (error) {
            console.log("AuthService :: Logout :: error", error);
        }
    }

    async updateUserPrefs(newPrefs) {
        try {
            if (newPrefs.bookmarks) {
                await axiosInstance.put('/users/bookmarks', { bookmarks: newPrefs.bookmarks });
            }
            return newPrefs;
        } catch (error) {
            console.log("AuthService :: updateUserPrefs :: error", error);
            throw error;
        }
    }

    async getUserPrefs() {
        try {
            const response = await axiosInstance.get('/users/bookmarks');
            return { bookmarks: response.data };
        } catch (error) {
            console.log("AuthService :: getUserPrefs :: error", error);
            return { bookmarks: [] };
        }
    }

    async updateUserBookmarks(bookmarksArray) {
        try {
            const response = await axiosInstance.put('/users/bookmarks', { bookmarks: bookmarksArray });
            return response.data;
        } catch (error) {
            console.log("AuthService :: updateUserBookmarks :: error", error);
        }
    }

    async getUserBookmarks() {
        try {
            const response = await axiosInstance.get('/users/bookmarks');
            return response.data || [];
        } catch (error) {
            console.log("AuthService :: getUserBookmarks :: error", error);
            return [];
        }
    }

    async updateName(name) {
        try {
            // Profile logic is separated in new backend, but if needed, we can call it here
            // const response = await axiosInstance.put('/users/profile', { name });
            // return response.data;
            return { name }; // Placeholder if the API doesn't support direct name update easily
        } catch (error) {
            console.log("AuthService :: updateName :: error", error);
            throw error;
        }
    }
}

const authservice = new AuthService();
export default authservice;
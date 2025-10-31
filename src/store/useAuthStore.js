import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set,get) => ({
            user: null,
            token: null,
            loading: false,
            error:null,

            // Login action
            login : async (username, password) => {
                set({loading:true, error:null});
                try {
                    console.log("Attempting login with:", username, password);
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network delay
                    // Mock authentication logic
                    if (username === 'pisi' && password === 'Aa123456') {
                        await get().fetchUser(); // fetch user data
                        set({token: 'mock-token-123456', loading:false});
                        localStorage.setItem('token', get().token);
                    } else {
                        throw new Error('Invalid credentials');
                    }
                } catch (error) {
                    set({error: 'Login failed'});
                }
            },

            // Get user data from mock API
            fetchUser: async () => {
                if(get().user) return; // if user already exists, no need to fetch again
                set({loading:true, error:null});
                try {
                    const response = await fetch('/mock/user.json');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    set({user: data, loading:false});
                } catch (error) {
                    set({error: 'Failed to fetch user data'});
                }
            },
            
            logout: () => {
                localStorage.removeItem('token');
                set({user: null, token: null})
            },
        }),
        {name: 'user-storage'} // name of the item in storage
    )
);

export default useAuthStore;
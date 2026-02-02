import { create } from "zustand";
import { persist } from "zustand/middleware";
import { register, login, getUserInfo } from "../api/index.js";
import toast from "react-hot-toast";

const useAuthStore = create(
    persist(
        (set,get) => ({
            user: null,
            token: null,
            loading: false,
            error:null,

            // Login action
            login : async (identifier, password) => {
                set({loading:true, error:null});
                const payload = {
                    identifier,   
                    password
                }
                try {
                    const {data, status} = await login(payload);
                    if(status === 200){
                        set({token: data.token, loading:false});
                        localStorage.setItem('token', get().token);

                        await get().getUserData(data.userId);
                    }
                } catch (error) {
                    console.log("Login failed",error);
                    if(error?.response?.status === 400){
                       toast.error('Invalid username or password');
                    }else{
                        toast.error('Login Failed');
                    }
                    set({error: 'Login Failed'});
                }
            },

            register : async (payload) => {
                set({loading:true, error:null});
                try {
                    const result = await register(payload);
                    console.log("Register success",result);
                    toast.success('Register Success');
                    set({loading:false});
                } catch (error) {
                    console.log("Register failed",error);
                    toast.error('Register Failed');
                    set({error: 'Register Failed'});
                }
            },

            getUserData : async (userId,from) => {
                set({loading:true, error:null});
                try {
                    const result = await getUserInfo(userId);
                    console.log("Get user info success",result);
                    set({user: result.data, loading:false});
                    if(from !== 'home') {
                        toast.success(`Welcome, ${result.data.username}`);
                    }
                } catch (error) {
                    console.log("Get user info failed",error);
                    toast.error('Get User Info Failed');
                    set({error: 'Get User Info Failed'});
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
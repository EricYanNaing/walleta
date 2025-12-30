import core from "./core";

export const register = (params) => {
    return core.post("/auth/register", params);
}

export const login = (params) => {
    return core.post("/auth/login", params);
}

export const getUserInfo = (userId) => {
    return core.get(`/auth/${userId}`);
}

export const getTransactionsList = async (query) => {
   return core.get("/transactions", {
       params: query
   });
}
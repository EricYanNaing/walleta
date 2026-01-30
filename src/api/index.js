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

export const getUserBalance = (userId) => {
    return core.get(`/user/balance`, {
        params: {
            userId
        }
    });
}

// Transaction
export const createTransaction = (params) => {
    return core.post("/transactions", params);
}

export const getTransactionsList = async (query) => {
   return core.get("/transactions", {
       params: query
   });
}

// Sub-Category
export const getSubCategoryList = (query) => {
    return core.get("/sub-category", {
        params: query
    });
}

export const createSubCategory = (params) => {
    return core.post("/sub-category", params);
}

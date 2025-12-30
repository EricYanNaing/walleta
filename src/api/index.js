import core from "./core";
import { transactionsResponse } from "../pages/Home/fakeTransactionsList";

// Simulation delay helper
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const register = (params) => {
    return core.post("/auth/register", params);
}

export const login = (params) => {
    return core.post("/auth/login", params);
}

export const getUserInfo = (userId) => {
    return core.get(`/auth/${userId}`);
}

export const getTransactions = async () => {
    // Simulate async fetch
    await delay(500);
    return transactionsResponse;
}
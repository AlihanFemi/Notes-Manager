import API from "./api.js";

export const register = async (username, email, password) => {
    const response = await API.post("/auth/register", { username, email, password });
    return response.data;
};

export const login = async (username, password) => {
    const response = await API.post("/auth/login", { username, password });
    return response.data;
};
export default { login, register };
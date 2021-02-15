import { getApiPath } from "./utils";
import AuthService from "./AuthService";

export const fetchWrapper = (path, method = "GET", body) => {
    let headers = {
        "Content-Type": "application/json",
    };

    const authHeader = AuthService.getAuthorizationHeader();
    if (authHeader) headers = { ...headers, ...authHeader };
    let options = {
        method,
        withCredentials: true,
        headers,
    };

    if (body) {
        options = { ...options, body: JSON.stringify(body) };
    }
    return fetch(getApiPath(path), options)
        .then((res) => res.json())
        .catch((error) => ({ success: false, message: error }));
};

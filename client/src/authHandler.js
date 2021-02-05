/**
 * key string to use for the localstorage
 */
const LS_KEY = "jwt_token";
const getApiPath = (path) => {
    return process.env.REACT_APP_API_HOST + path;
};

const handleAuth = (path, body) => {

    const res = await fetch(getApiPath(path), {
        method: "POST",
        body: JSON.stringify(body)
    });

    // token has expired, is invalid or
    // Authorization header not present
    if(res.status === 403) {
        // redirect to login page
        // remove token from localstorage
    }

    if(res.status === 401) {
        // redirect to login page
        // remove token from ls
    }

    if (res.status === 200) {
        
    } else {
        // unexpected error code
        // remove token
        // redirect to login page
    }
    
}


const saveToken = (token) => {
    localStorage.setItem(LS_KEY, token);
};

const removeToken = () => {
    localStorage.removeItem(LS_KEY);
};

const getToken = () => {
    return localStorage.getItem(LS_KEY);
};

export const signIn = (email, password) => {
    const data = await handleAuth("/auth/signin", {email, password});
};

export const signout = () => {
    removeToken();
    // react router redirect user to login page
};


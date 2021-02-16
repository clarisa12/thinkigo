import { getApiPath } from "./utils";

/**
 * Use a service singleton
 * more info: https://www.sitepoint.com/javascript-design-patterns-singleton/
 *
 */
const LS_KEY = "jwt_token";
const USER_DATA = "user_data";

class AuthService {
    /**
     * key string to use for the localstorage
     */
    constructor() {
        this.auth = { isSignedIn: Boolean(this._getToken()) };
    }

    /**
     * private methods
     */

    _saveUserData(data) {
        localStorage.setItem(USER_DATA, JSON.stringify(data));
    }

    _rmUserData() {
        localStorage.removeItem(USER_DATA);
    }

    getUserData() {
        return JSON.parse(localStorage.getItem(USER_DATA));
    }

    _saveToken(token) {
        localStorage.setItem(LS_KEY, token);
    }

    _removeToken() {
        localStorage.removeItem(LS_KEY);
    }

    _getToken() {
        return localStorage.getItem(LS_KEY);
    }

    async _handleAuth(path, body) {
        try {
            const res = await fetch(getApiPath(path), {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(body),
            });
            return await res.json();
        } catch (error) {
            // token has expired, is invalid or
            // Authorization header not present
            this._removeToken();
            this.auth.isSignedIn = false;
            return { success: false, message: "Incorrect login or password" };
        }
    }

    getAuthorizationHeader() {
        if (!this.auth.isSignedIn) return null;
        return { Authorization: `Bearer ${this._getToken()}` };
    }

    async signIn(email, password) {
        const response = await this._handleAuth("/auth/signin", {
            email,
            password,
        });
        if (response.success) {
            this._saveUserData(response.userData);
            this._saveToken(response.token);
            this.auth.isSignedIn = true;
        }
        return response;
    }

    signOut() {
        this._removeToken();
        this._rmUserData();
        this.auth.isSignedIn = false;
        // react router redirect user to login page
    }

    async register(fname, lname, email, password) {
        const response = await this._handleAuth("/user/add", {
            fname,
            lname,
            email,
            password,
        });
        if (response.success) {
            this._saveUserData(response.userData);
            this._saveToken(response.token);
            this.auth.isSignedIn = true;
        }
        console.log(response);
        return response;
    }
}

const instance = new AuthService();
Object.freeze(instance);

export default instance;

/**
 * For auth handling the `Authorization` header will be used
 * A JWT token will be in the form
 * `Authorization: Bearer eyJh......HgQ`
 * @param {Request} req
 * @returns {string | null}
 */
export function getJWTTokenFromHeader(req) {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
        return req.headers.authorization.split(" ")[1];
    }

    return null;
}

import { decodeToken } from "../utils/index";
export const getUserFromToken = (token: string) => {
    if (!token) {
        throw new Error("Token not found or invalid.");
    }

    const user = decodeToken(token);
    if (!user || !user.id) {
        throw new Error("Invalid token payload.");
    }

    return user;
};

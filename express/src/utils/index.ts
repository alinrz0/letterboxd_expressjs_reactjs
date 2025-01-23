import jwt from 'jsonwebtoken'
const SECRECT = "THIAISMYSECRET"

export const encodeToken = (payload : any) =>{
    const token = jwt.sign(payload , SECRECT , {expiresIn : "1h"})
    return token;
}

interface DecodedToken {
    id: number;  // or string, depending on your token structure
    iat: number;
    exp: number;
  }
  
  export const decodeToken = (token: string): DecodedToken => {
    const decoded = jwt.verify(token, SECRECT) as DecodedToken; // Cast the result to DecodedToken
    return decoded;
  }
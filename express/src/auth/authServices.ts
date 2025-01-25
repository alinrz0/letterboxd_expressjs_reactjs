import { encodeToken} from './../utils/index';
import UsersModel from "../models/usersModel";
import LoginDto from "./dtos/loginDto";
import SignupDto from "./dtos/signupDto";
import bcrypt from "bcrypt";
import ServerError from '../errors/serverError';


export const signup = async (data: SignupDto) => {
    const user = await UsersModel.findOne({ where: { email: data.email } });
    if (user) throw new ServerError(409, "User already exists");
  
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await UsersModel.create({...data , password : hashedPassword})
  
    const token = encodeToken({id : newUser.id})
    return {token : `${token}`}
  };


export const login = async  (data : LoginDto) =>{
    const user = await UsersModel.findOne({ where: { email: data.email } }); 
    if (!user) throw new ServerError(404 , "User not found")
    const compare = await bcrypt.compare(data.password , user.password)
    if (!compare) throw new ServerError(400 , "Invalid credentials")
    const token = encodeToken({id : user.id})
    return {token : `${token}`}

}
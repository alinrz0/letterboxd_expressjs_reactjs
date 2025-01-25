import { encodeToken} from './../utils/index';
import AdminModel from "../models/adminModel";
import bcrypt from "bcrypt";
import ServerError from '../errors/serverError';
import LoginDto from "./dtos/loginDto";
// import SignupDto from './dtos/signupDto';


import UsersModel from "../models/usersModel";
import UpdateUserDto from "./dtos/updateUserDto";


export const login = async  (data :LoginDto) =>{
    const user = await AdminModel.findOne({ where: { username: data.username } }); 
    if (!user) throw new ServerError(404 , "User not found")
    const compare = await bcrypt.compare(data.password , user.password)
    if (!compare) throw new ServerError(400 , "Invalid credentials")
    const token = encodeToken({id : user.id})
    return {admin_token : `${token}`}

}
// Get user list
export const getUsers = async () => {
    const users = await UsersModel.findAll({
        attributes: ["id", "name", "email", "createdAt", "updatedAt"], // Include only necessary fields
    });

    return users;
};

export const getUser = async (id: number) => {
    const user = await UsersModel.findByPk(id);
    if (!user) {
        throw new ServerError(404, "User not found.");
    }
    return user;
};
// Update user details
export const updateUser = async (id: number, data: UpdateUserDto) => {
    const user = await UsersModel.findByPk(id);

    if (!user) {
        throw new ServerError(404, "User not found.");
    }

    // Update the user's details
    await user.update(data);

    return user;
};

// Delete a user
export const deleteUser = async (id: number) => {
    const user = await UsersModel.findByPk(id);

    if (!user) {
        throw new ServerError(404, "User not found.");
    }
    // Delete the user (can also use soft delete if needed)
    await user.destroy();

    return { id };
};

// export const signup = async (data: SignupDto) => {
  
//     const hashedPassword = await bcrypt.hash(data.password, 10);
//     const newUser = await AdminModel.create({...data , password : hashedPassword})
  
//     const token = encodeToken({id : newUser.id})
//     return {token : `${token}`}
//   };

import { IsDefined, IsEmail, MinLength, IsNotEmpty } from "class-validator";

export default class LoginDto {
  @IsDefined({ message: "Email is required." })
  username!: string;

  @IsDefined({ message: "Password is required." })
  password!: string;
}

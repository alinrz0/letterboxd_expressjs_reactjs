import { IsDefined, IsEmail, MinLength, IsNotEmpty } from "class-validator";

export default class LoginDto {
  @IsDefined({ message: "Email is required." })
  @IsNotEmpty({ message: "Email cannot be empty." })
  @IsEmail({}, { message: "Email must be a valid email address." })
  email!: string;

  @IsDefined({ message: "Password is required." })
  @IsNotEmpty({ message: "Password cannot be empty." })
  password!: string;
}

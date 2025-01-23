import { IsDefined, IsEmail, MaxLength, MinLength, IsNotEmpty } from "class-validator";

export default class SignupDto {
  @IsDefined({ message: "Name is required." })
  @IsNotEmpty({ message: "Name cannot be empty." })
  @MaxLength(20, { message: "Name must not exceed 20 characters." })
  name!: string;

  @IsDefined({ message: "Email is required." })
  @IsNotEmpty({ message: "Email cannot be empty." })
  @IsEmail({}, { message: "Email must be a valid email address." })
  email!: string;

  @IsDefined({ message: "Password is required." })
  @IsNotEmpty({ message: "Password cannot be empty." })
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  password!: string;
}

import { IsString, IsEmail, IsOptional } from "class-validator";

export default class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string; // Include only if updating passwords
}

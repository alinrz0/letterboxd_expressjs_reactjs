import {
    IsDefined,
    IsNotEmpty,
    IsString,
    IsNumber,
    IsPositive,
    MaxLength,
    IsOptional,
  } from "class-validator";
  
  class CreateMovieDto {
    @IsDefined({ message: "Title is required." })
    @IsString({ message: "Title must be a string." })
    @IsNotEmpty({ message: "Title cannot be empty." })
    @MaxLength(100, { message: "Title must not exceed 100 characters." })
    title!: string;
  
    @IsDefined({ message: "Description is required." })
    @IsString({ message: "Description must be a string." })
    @IsNotEmpty({ message: "Description cannot be empty." })
    @MaxLength(1000, { message: "Description must not exceed 1000 characters." })
    description!: string;
  
    @IsDefined({ message: "Year is required." })
    @IsString( { message: "Year must be a valid date string." })
    year!: string;
  
    @IsDefined({ message: "Genre is required." })
    @IsString({ message: "Genre must be a string." })
    @IsNotEmpty({ message: "Genre cannot be empty." })
    @MaxLength(50, { message: "Genre must not exceed 50 characters." })
    genre!: string;
  
    @IsDefined({ message: "Rate is required." })
    @IsNumber({}, { message: "Rate must be a number." })
    @IsPositive({ message: "Rate must be a positive number." })
    @IsNotEmpty({ message: "Rate cannot be empty." })

    @IsOptional()
    rate!: number;

    poster!:string;
  }
  
  export default CreateMovieDto;
  
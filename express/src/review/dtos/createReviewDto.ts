import {
    IsDefined,
    IsInt,
    IsString,
    Min,
    Max,
    ValidateIf,
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from "class-validator";

// Custom decorator to check divisibility by 0.25
function IsDivisibleByQuarter(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isDivisibleByQuarter",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return typeof value === "number" && value % 0.25 === 0;
                },
                defaultMessage: (args: ValidationArguments) =>
                    `${args.property} must be a number between 0 and 5, incremented by 0.25.`,
            },
        });
    };
}

class CreateReviewDto {
    @IsDefined({ message: "Movie ID is required." })
    @IsInt({ message: "Movie ID must be an integer." })
    movie_id!: number;

    @IsDefined({ message: "Review is required." })
    @IsString({ message: "Review must be a string." })
    review!: string;

    @IsDefined({ message: "Rating is required." })
    @Min(0, { message: "Rating must be at least 0." })
    @Max(5, { message: "Rating cannot exceed 5." })
    @IsDivisibleByQuarter({ message: "Rating must increment by 0.25." })
    rating!: number;
}

export default CreateReviewDto;

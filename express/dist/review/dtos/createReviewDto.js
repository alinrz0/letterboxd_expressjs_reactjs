"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
// Custom decorator to check divisibility by 0.25
function IsDivisibleByQuarter(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: "isDivisibleByQuarter",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value, args) {
                    return typeof value === "number" && value % 0.25 === 0;
                },
                defaultMessage: (args) => `${args.property} must be a number between 0 and 5, incremented by 0.25.`,
            },
        });
    };
}
class CreateReviewDto {
}
__decorate([
    (0, class_validator_1.IsDefined)({ message: "Movie ID is required." }),
    (0, class_validator_1.IsInt)({ message: "Movie ID must be an integer." })
], CreateReviewDto.prototype, "movie_id", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: "Review is required." }),
    (0, class_validator_1.IsString)({ message: "Review must be a string." })
], CreateReviewDto.prototype, "review", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: "Rating is required." }),
    (0, class_validator_1.Min)(0, { message: "Rating must be at least 0." }),
    (0, class_validator_1.Max)(5, { message: "Rating cannot exceed 5." }),
    IsDivisibleByQuarter({ message: "Rating must increment by 0.25." })
], CreateReviewDto.prototype, "rating", void 0);
exports.default = CreateReviewDto;

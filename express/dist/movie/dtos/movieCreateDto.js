"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
class CreateMovieDto {
}
__decorate([
    (0, class_validator_1.IsDefined)({ message: "Title is required." }),
    (0, class_validator_1.IsString)({ message: "Title must be a string." }),
    (0, class_validator_1.IsNotEmpty)({ message: "Title cannot be empty." }),
    (0, class_validator_1.MaxLength)(100, { message: "Title must not exceed 100 characters." })
], CreateMovieDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: "Description is required." }),
    (0, class_validator_1.IsString)({ message: "Description must be a string." }),
    (0, class_validator_1.IsNotEmpty)({ message: "Description cannot be empty." }),
    (0, class_validator_1.MaxLength)(1000, { message: "Description must not exceed 1000 characters." })
], CreateMovieDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: "Year is required." }),
    (0, class_validator_1.IsString)({ message: "Year must be a valid date string." })
], CreateMovieDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: "Genre is required." }),
    (0, class_validator_1.IsString)({ message: "Genre must be a string." }),
    (0, class_validator_1.IsNotEmpty)({ message: "Genre cannot be empty." }),
    (0, class_validator_1.MaxLength)(50, { message: "Genre must not exceed 50 characters." })
], CreateMovieDto.prototype, "genre", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: "Rate is required." }),
    (0, class_validator_1.IsNumber)({}, { message: "Rate must be a number." }),
    (0, class_validator_1.IsPositive)({ message: "Rate must be a positive number." }),
    (0, class_validator_1.IsNotEmpty)({ message: "Rate cannot be empty." })
], CreateMovieDto.prototype, "rate", void 0);
exports.default = CreateMovieDto;

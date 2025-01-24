import ReviewModel from "../models/reviewsModel";
import MoviesModel from "../models/moviesModel";
import { decodeToken } from "../utils/index";

interface CreateReviewDto {
    movie_id: number;
    review: string;
    rating: number;
}

export const addReview = async (
    token: string,
    createReviewDto: CreateReviewDto
): Promise<object> => {
    // Decode user information from token
    const user = decodeToken(token);

    // Validate movie existence
    const movie = await MoviesModel.findByPk(createReviewDto.movie_id);
    if (!movie) {
        throw new Error("Movie not found.");
    }

    // Save the review
    const newReview = await ReviewModel.create({
        user_id: user.id,
        movie_id: createReviewDto.movie_id,
        review: createReviewDto.review,
        rating: createReviewDto.rating,
    });

    return newReview;
};

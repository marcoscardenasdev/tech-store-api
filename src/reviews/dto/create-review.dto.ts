import { IsInt, IsString, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateReviewDto {

    @IsString()
    @MinLength(5)
    @MaxLength(500)
    comment: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    @MinLength(3)
    @MaxLength(80)
    reviewerName: string;

    constructor(
        comment: string,
        rating: number,
        reviewerName: string,
    ) {
        this.comment = comment;
        this.rating = rating;
        this.reviewerName = reviewerName;
    }
}

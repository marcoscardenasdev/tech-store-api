import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;
    @IsString()
    @MinLength(10)
    @MaxLength(300)
    description: string;

    constructor(
        name: string,
        description: string
    ) {
        this.name = name;
        this.description = description;
    }
}

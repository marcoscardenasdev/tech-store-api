import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(3)
    @MaxLength(100)
    public name: string;

    @IsString()
    @MinLength(10)
    @MaxLength(500)
    public description: string;

    @IsNumber({
        maxDecimalPlaces: 2,
    })
    @Min(0.01, {
    })
    @Type(() => Number)
    public price: number;

    @IsInt()
    @Min(0)
    @Type(() => Number)
    public stock: number;

    @IsIn(['smartphone',
    'laptop',
    'tablet',
    'accesory',
    'wearable'])
    public category: string;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    public isActive?: boolean;

    constructor(
        name: string,
        description: string,
        price: number,
        stock: number,
        category: string,
        isActive: boolean,
    ) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.isActive = isActive;
    }
}
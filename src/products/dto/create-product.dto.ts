import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, MinLength } from "class-validator";

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

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public categoryId: number;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    public isActive?: boolean;

    constructor(
        name: string,
        description: string,
        price: number,
        stock: number,
        categoryId: number,
        isActive: boolean,
    ) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.categoryId = categoryId;
        this.isActive = isActive;
    }
}
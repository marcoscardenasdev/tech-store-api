import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
    
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public limit?: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public offset?: number;

    constructor(
        limit: number,
        offset: number,
    ) {
        this.limit = limit;
        this.offset = offset;
    }
}
import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';
import { IDENTIFIER_TYPES } from 'src/core/utils/constants';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BalanceQueryDto {
    @ApiPropertyOptional({ example: '600496', description: 'Optional shortcode override. Defaults to BALANCE_SHORTCODE.' })
    @IsOptional()
    @IsString()
    partyA?: string; // Shortcode (defaults to config)

    @ApiPropertyOptional({ example: 4, description: 'Identifier type. Shortcode is typically 4.' })
    @IsOptional()
    @IsInt()
    identifierType?: number; // Default: 4 (shortcode)

    @ApiPropertyOptional({ example: 'Balance check' })
    @IsOptional()
    @IsString()
    remarks?: string;
}

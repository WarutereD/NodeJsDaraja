import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StatusQueryDto {
    @ApiProperty({ example: 'LHG31AA5TV', description: 'Original M-Pesa transaction ID to query.' })
    @IsNotEmpty()
    @IsString()
    transactionID: string; // Original transaction ID to query

    @ApiPropertyOptional({ example: '600496', description: 'Optional shortcode override.' })
    @IsOptional()
    @IsString()
    partyA?: string; // Shortcode (defaults to config)

    @ApiPropertyOptional({ example: 4, description: 'Identifier type. Shortcode is typically 4.' })
    @IsOptional()
    @IsInt()
    identifierType?: number; // Default: 4 (shortcode)

    @ApiPropertyOptional({ example: 'Status check' })
    @IsOptional()
    @IsString()
    remarks?: string;

    @ApiPropertyOptional({ example: 'Support follow-up' })
    @IsOptional()
    @IsString()
    occasion?: string;
}

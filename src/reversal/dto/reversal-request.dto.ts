import { IsNotEmpty, IsNumber, IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReversalRequestDto {
    @ApiProperty({ example: 'LHG31AA5TV', description: 'Original transaction ID to reverse.' })
    @IsNotEmpty()
    @IsString()
    transactionID: string; // Original transaction ID to reverse

    @ApiProperty({ example: 100, minimum: 1, description: 'Amount to reverse.' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    amount: number;

    @ApiProperty({ example: '600496', description: 'Receiving shortcode or phone number.' })
    @IsNotEmpty()
    @IsString()
    receiverParty: string; // Shortcode or phone number

    @ApiPropertyOptional({ example: 4, description: 'Receiver identifier type. Shortcode is typically 4.' })
    @IsOptional()
    @IsInt()
    receiverIdentifierType?: number; // Default: 4 (shortcode)

    @ApiPropertyOptional({ example: 'Reversal for wrong payment' })
    @IsOptional()
    @IsString()
    remarks?: string;

    @ApiPropertyOptional({ example: 'Customer support case' })
    @IsOptional()
    @IsString()
    occasion?: string;
}

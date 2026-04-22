import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, Min } from 'class-validator';
import { TRANSACTION_TYPES } from 'src/core/utils/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentRequestDto {
    @ApiProperty({ example: '254712345678', description: 'Recipient phone number in international format.' })
    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @ApiProperty({ example: 100, minimum: 10, description: 'Amount to send to the customer.' })
    @IsNotEmpty()
    @IsNumber()
    @Min(10)
    amount: number;

    @ApiPropertyOptional({ example: 'BusinessPayment', enum: Object.values(TRANSACTION_TYPES.B2C) })
    @IsOptional()
    @IsString()
    @IsEnum(Object.values(TRANSACTION_TYPES.B2C))
    commandId?: string;

    @ApiPropertyOptional({ example: 'Salary payment' })
    @IsOptional()
    @IsString()
    remarks?: string;

    @ApiPropertyOptional({ example: 'Monthly salary' })
    @IsOptional()
    @IsString()
    occasion?: string;
}

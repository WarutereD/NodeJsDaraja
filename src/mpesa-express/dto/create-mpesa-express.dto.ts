import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMpesaExpressDto {
    @ApiProperty({ example: '254712345678', description: 'Customer phone number in international format.' })
    @IsNotEmpty()
    @IsString()
    phoneNum: string;

    @ApiProperty({ example: 100, description: 'Amount to charge via STK push.' })
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty({ example: 'INV001', description: 'Account reference displayed to the customer.' })
    @IsNotEmpty()
    @IsString()
    accountRef: string;
}

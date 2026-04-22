import { IsNotEmpty, IsNumber, IsString, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SimulateC2BDto {
    @ApiProperty({ example: '600496', description: 'Sandbox shortcode receiving the simulated payment.' })
    @IsNotEmpty()
    @IsString()
    shortCode: string;

    @ApiProperty({ example: 'CustomerPayBillOnline', enum: ['CustomerPayBillOnline', 'CustomerBuyGoodsOnline'] })
    @IsNotEmpty()
    @IsEnum(['CustomerPayBillOnline', 'CustomerBuyGoodsOnline'])
    commandID: string;

    @ApiProperty({ example: 100, description: 'Amount to simulate.' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    amount: number;

    @ApiProperty({ example: '254708374149', description: 'Customer MSISDN in international format.' })
    @IsNotEmpty()
    @IsString()
    msisdn: string; // Phone number (254XXXXXXXXX format)

    @ApiProperty({ example: 'ACC001', description: 'Bill reference or account reference.' })
    @IsNotEmpty()
    @IsString()
    billRefNumber: string; // Account reference
}

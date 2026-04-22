import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, Min } from 'class-validator';
import { QR_TRANSACTION_CODES } from 'src/core/utils/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QRGenerateDto {
    @ApiProperty({ example: 'Acme Stores', description: 'Merchant name printed into the QR payload.' })
    @IsNotEmpty()
    @IsString()
    merchantName: string;

    @ApiProperty({ example: 'ORDER-1001', description: 'Unique merchant reference.' })
    @IsNotEmpty()
    @IsString()
    refNo: string; // Reference number (unique identifier)

    @ApiProperty({ example: 150, minimum: 1, description: 'Amount encoded into the QR request.' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    amount: number;

    @ApiProperty({ example: 'PB', enum: Object.values(QR_TRANSACTION_CODES), description: 'QR transaction type.' })
    @IsNotEmpty()
    @IsString()
    @IsEnum(Object.values(QR_TRANSACTION_CODES))
    trxCode: string; // Transaction code: BG, PB, WA, SM

    @ApiPropertyOptional({ example: 'Acme Paybill', description: 'Credit party identifier. Falls back to QR_MERCHANT_NAME.' })
    @IsOptional()
    @IsString()
    cpi?: string; // Credit Party Identifier

    @ApiPropertyOptional({ example: '300', description: 'QR image size.' })
    @IsOptional()
    @IsString()
    size?: string; // QR code size (default: 300)
}

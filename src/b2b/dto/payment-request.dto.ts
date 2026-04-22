import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { TRANSACTION_TYPES, IDENTIFIER_TYPES } from 'src/core/utils/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class B2BPaymentRequestDto {
    @ApiProperty({ example: 'BusinessPayBill', enum: Object.values(TRANSACTION_TYPES.B2B) })
    @IsNotEmpty()
    @IsString()
    @IsEnum(Object.values(TRANSACTION_TYPES.B2B))
    commandId: string;

    @ApiProperty({ example: 1000, minimum: 1, description: 'Amount to transfer.' })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    amount: number;

    @ApiProperty({ example: '600000', description: 'Receiver shortcode.' })
    @IsNotEmpty()
    @IsString()
    partyB: string; // Receiver shortcode

    @ApiPropertyOptional({ example: 4, description: 'Sender identifier type. Defaults to shortcode.' })
    @IsOptional()
    @IsInt()
    senderIdentifierType?: number; // Default: 4 (shortcode)

    @ApiPropertyOptional({ example: 4, description: 'Receiver identifier type. Defaults to shortcode.' })
    @IsOptional()
    @IsInt()
    receiverIdentifierType?: number; // Default: 4 (shortcode)

    @ApiProperty({ example: 'ACC001', description: 'Account reference attached to the transfer.' })
    @IsNotEmpty()
    @IsString()
    accountReference: string;

    @ApiPropertyOptional({ example: 'Payment to supplier' })
    @IsOptional()
    @IsString()
    remarks?: string;
}

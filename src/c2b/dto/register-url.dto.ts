import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { RESPONSE_TYPES } from 'src/core/utils/constants';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUrlDto {
    @ApiProperty({ example: '600496', description: 'C2B shortcode to register with Safaricom.' })
    @IsNotEmpty()
    @IsString()
    shortCode: string;

    @ApiProperty({ example: 'Completed', enum: Object.values(RESPONSE_TYPES), description: 'How Safaricom should treat the validation result.' })
    @IsNotEmpty()
    @IsEnum(Object.values(RESPONSE_TYPES))
    responseType: string; // 'Completed' or 'Cancelled'

    @ApiProperty({ example: 'https://w52nr4f3-3003.uks1.devtunnels.ms/api/c2b/confirmation', description: 'Public confirmation callback URL.' })
    @IsNotEmpty()
    @IsString()
    confirmationURL: string;

    @ApiProperty({ example: 'https://w52nr4f3-3003.uks1.devtunnels.ms/api/c2b/validation', description: 'Public validation callback URL.' })
    @IsNotEmpty()
    @IsString()
    validationURL: string;
}

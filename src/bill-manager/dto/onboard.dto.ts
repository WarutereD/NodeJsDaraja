import { IsNotEmpty, IsString, IsEmail, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OnboardDto {
    @ApiProperty({ example: '600496', description: 'Bill Manager shortcode to onboard.' })
    @IsNotEmpty()
    @IsString()
    shortCode: string;

    @ApiProperty({ example: 'billing@example.com', description: 'Official billing email.' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '254712345678', description: 'Official contact phone number or contact label.' })
    @IsNotEmpty()
    @IsString()
    officialContact: string;

    @ApiPropertyOptional({ example: true, description: 'Whether reminders should be sent.' })
    @IsOptional()
    @IsBoolean()
    sendReminders?: boolean;

    @ApiPropertyOptional({ example: 'base64-encoded-logo', description: 'Optional base64-encoded logo.' })
    @IsOptional()
    @IsString()
    logo?: string; // Base64 encoded logo

    @ApiProperty({ example: 'https://w52nr4f3-3003.uks1.devtunnels.ms/api/bill-manager/callback', description: 'Public callback URL for bill payments.' })
    @IsNotEmpty()
    @IsString()
    callBackUrl: string;
}

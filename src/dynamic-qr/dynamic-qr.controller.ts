import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { DynamicQRService } from './dynamic-qr.service';
import { QRGenerateDto } from './dto/qr-generate.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('dynamic-qr')
@ApiTags('Dynamic QR')
export class DynamicQRController {
    private readonly logger = new Logger(DynamicQRController.name);

    constructor(private readonly qrService: DynamicQRService) {}

    @Post('/generate')
    @ApiOperation({ summary: 'Generate dynamic QR code', description: 'Creates an M-Pesa dynamic QR code payload and stores the response.' })
    @ApiBody({ type: QRGenerateDto })
    @ApiOkResponse({ description: 'QR generation request completed successfully.' })
    async generateQR(@Body() dto: QRGenerateDto) {
        try {
            const result = await this.qrService.generateQR(dto);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            this.logger.error(`QR generation failed: ${error.message}`);
            throw new HttpException('Failed to generate QR code', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

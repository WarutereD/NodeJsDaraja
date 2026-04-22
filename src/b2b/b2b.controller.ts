import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { B2BService } from './b2b.service';
import { B2BPaymentRequestDto } from './dto/payment-request.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('b2b')
@ApiTags('B2B')
export class B2BController {
    private readonly logger = new Logger(B2BController.name);

    constructor(private readonly b2bService: B2BService) {}

    @Post('/payment')
    @ApiOperation({ summary: 'Initiate B2B payment', description: 'Transfers funds between business shortcodes.' })
    @ApiBody({ type: B2BPaymentRequestDto })
    @ApiOkResponse({ description: 'B2B transfer request accepted.' })
    async initiatePayment(@Body() dto: B2BPaymentRequestDto) {
        try {
            const result = await this.b2bService.sendPayment(dto);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            this.logger.error(`B2B payment failed: ${error.message}`);
            throw new HttpException('Failed to initiate B2B payment', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/callback/result')
    @ApiOperation({ summary: 'Handle B2B result callback' })
    async handleResultCallback(@Body() callback: any) {
        return this.b2bService.processResultCallback(callback);
    }

    @Post('/callback/timeout')
    @ApiOperation({ summary: 'Handle B2B timeout callback' })
    async handleTimeoutCallback(@Body() callback: any) {
        return this.b2bService.processTimeoutCallback(callback);
    }
}

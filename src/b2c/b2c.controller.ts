import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { B2CService } from './b2c.service';
import { PaymentRequestDto } from './dto/payment-request.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('b2c')
@ApiTags('B2C')
export class B2CController {
    private readonly logger = new Logger(B2CController.name);

    constructor(private readonly b2cService: B2CService) {}

    @Post('/payment')
    @ApiOperation({ summary: 'Initiate B2C payment', description: 'Sends funds from the business shortcode to a customer phone number.' })
    @ApiBody({ type: PaymentRequestDto })
    @ApiOkResponse({ description: 'B2C payout request accepted.' })
    async initiatePayment(@Body() dto: PaymentRequestDto) {
        try {
            const result = await this.b2cService.sendPayment(dto);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            this.logger.error(`B2C payment failed: ${error.message}`);
            throw new HttpException('Failed to initiate B2C payment', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/callback/result')
    @ApiOperation({ summary: 'Handle B2C result callback' })
    async handleResultCallback(@Body() callback: any) {
        return this.b2cService.processResultCallback(callback);
    }

    @Post('/callback/timeout')
    @ApiOperation({ summary: 'Handle B2C timeout callback' })
    async handleTimeoutCallback(@Body() callback: any) {
        return this.b2cService.processTimeoutCallback(callback);
    }
}

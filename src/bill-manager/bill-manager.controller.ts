import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { BillManagerService } from './bill-manager.service';
import { OnboardDto } from './dto/onboard.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('bill-manager')
@ApiTags('Bill Manager')
export class BillManagerController {
    private readonly logger = new Logger(BillManagerController.name);

    constructor(private readonly billService: BillManagerService) {}

    @Post('/onboard')
    @ApiOperation({ summary: 'Onboard bill account', description: 'Registers a Bill Manager account with Safaricom.' })
    @ApiBody({ type: OnboardDto })
    @ApiOkResponse({ description: 'Bill Manager onboarding request accepted.' })
    async onboardAccount(@Body() dto: OnboardDto) {
        try {
            const result = await this.billService.onboardAccount(dto);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            this.logger.error(`Onboarding failed: ${error.message}`);
            throw new HttpException('Failed to onboard bill account', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/callback')
    @ApiOperation({ summary: 'Handle Bill Manager payment callback' })
    async handlePaymentCallback(@Body() callback: any) {
        return this.billService.processPaymentCallback(callback);
    }
}

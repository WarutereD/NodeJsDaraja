import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ReversalService } from './reversal.service';
import { ReversalRequestDto } from './dto/reversal-request.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('reversal')
@ApiTags('Reversal')
export class ReversalController {
    private readonly logger = new Logger(ReversalController.name);

    constructor(private readonly reversalService: ReversalService) {}

    @Post('/request')
    @ApiOperation({ summary: 'Reverse a transaction', description: 'Initiates reversal for a previous M-Pesa transaction.' })
    @ApiBody({ type: ReversalRequestDto })
    @ApiOkResponse({ description: 'Reversal request accepted for processing.' })
    async reverseTransaction(@Body() dto: ReversalRequestDto) {
        try {
            const result = await this.reversalService.reverseTransaction(dto);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            this.logger.error(`Reversal failed: ${error.message}`);
            throw new HttpException('Failed to reverse transaction', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/callback')
    @ApiOperation({ summary: 'Handle reversal callback' })
    async handleResultCallback(@Body() callback: any) {
        return this.reversalService.processResultCallback(callback);
    }

    @Post('/timeout')
    @ApiOperation({ summary: 'Handle reversal timeout callback' })
    async handleTimeoutCallback(@Body() callback: any) {
        return this.reversalService.processTimeoutCallback(callback);
    }
}

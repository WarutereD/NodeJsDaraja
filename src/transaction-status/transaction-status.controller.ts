import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionStatusService } from './transaction-status.service';
import { StatusQueryDto } from './dto/status-query.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('transaction-status')
@ApiTags('Transaction Status')
export class TransactionStatusController {
    private readonly logger = new Logger(TransactionStatusController.name);

    constructor(private readonly statusService: TransactionStatusService) {}

    @Post('/query')
    @ApiOperation({ summary: 'Query transaction status', description: 'Retrieves the status of a previously submitted M-Pesa transaction.' })
    @ApiBody({ type: StatusQueryDto })
    @ApiOkResponse({ description: 'Transaction status query accepted for processing.' })
    async queryStatus(@Body() dto: StatusQueryDto) {
        try {
            const result = await this.statusService.queryStatus(dto);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            this.logger.error(`Status query failed: ${error.message}`);
            throw new HttpException('Failed to query transaction status', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/callback')
    @ApiOperation({ summary: 'Handle transaction status callback' })
    async handleResultCallback(@Body() callback: any) {
        return this.statusService.processResultCallback(callback);
    }

    @Post('/timeout')
    @ApiOperation({ summary: 'Handle transaction status timeout callback' })
    async handleTimeoutCallback(@Body() callback: any) {
        return this.statusService.processTimeoutCallback(callback);
    }
}

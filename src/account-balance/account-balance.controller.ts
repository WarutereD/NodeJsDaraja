import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AccountBalanceService } from './account-balance.service';
import { BalanceQueryDto } from './dto/balance-query.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('account-balance')
@ApiTags('Account Balance')
export class AccountBalanceController {
    private readonly logger = new Logger(AccountBalanceController.name);

    constructor(private readonly balanceService: AccountBalanceService) {}

    @Post('/query')
    @ApiOperation({ summary: 'Query account balance', description: 'Requests the M-Pesa balance for the configured shortcode.' })
    @ApiBody({ type: BalanceQueryDto })
    @ApiOkResponse({ description: 'Balance query accepted for processing.' })
    async queryBalance(@Body() dto: BalanceQueryDto) {
        try {
            const result = await this.balanceService.queryBalance(dto);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            this.logger.error(`Balance query failed: ${error.message}`);
            throw new HttpException('Failed to query account balance', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/callback')
    @ApiOperation({ summary: 'Handle account balance callback' })
    async handleResultCallback(@Body() callback: any) {
        return this.balanceService.processResultCallback(callback);
    }

    @Post('/timeout')
    @ApiOperation({ summary: 'Handle account balance timeout callback' })
    async handleTimeoutCallback(@Body() callback: any) {
        return this.balanceService.processTimeoutCallback(callback);
    }
}

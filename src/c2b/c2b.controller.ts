import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { C2BService } from './c2b.service';
import { RegisterUrlDto } from './dto/register-url.dto';
import { SimulateC2BDto } from './dto/simulate-c2b.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('c2b')
@ApiTags('C2B')
export class C2BController {
    private readonly logger = new Logger(C2BController.name);

    constructor(private readonly c2bService: C2BService) {}

    @Post('/register')
    @ApiOperation({ summary: 'Register C2B URLs', description: 'Registers validation and confirmation URLs with Safaricom for a C2B shortcode.' })
    @ApiBody({ type: RegisterUrlDto })
    @ApiOkResponse({ description: 'URLs registered successfully.' })
    async registerUrls(@Body() dto: RegisterUrlDto) {
        try {
            const result = await this.c2bService.registerUrls(dto);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            this.logger.error(`C2B URL registration failed: ${error.message}`);
            throw new HttpException('Failed to register C2B URLs', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/simulate')
    @ApiOperation({ summary: 'Simulate C2B transaction', description: 'Triggers a sandbox C2B transaction for local and integration testing.' })
    @ApiBody({ type: SimulateC2BDto })
    @ApiOkResponse({ description: 'Sandbox C2B simulation accepted.' })
    async simulateTransaction(@Body() dto: SimulateC2BDto) {
        try {
            const result = await this.c2bService.simulateTransaction(dto);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            this.logger.error(`C2B simulation failed: ${error.message}`);
            throw new HttpException('Failed to simulate C2B transaction', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/validation')
    @ApiOperation({ summary: 'Handle C2B validation callback' })
    async handleValidation(@Body() callback: any) {
        return this.c2bService.processValidation(callback);
    }

    @Post('/confirmation')
    @ApiOperation({ summary: 'Handle C2B confirmation callback' })
    async handleConfirmation(@Body() callback: any) {
        return this.c2bService.processConfirmation(callback);
    }
}

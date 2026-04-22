import { Controller, Post, Body, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MpesaExpressService } from './mpesa-express.service';
import { CreateMpesaExpressDto } from './dto/create-mpesa-express.dto';
import { Redis } from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { PrismaService } from 'src/services/prisma.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

interface STKCallback {
    Body: {
        stkCallback: {
            MerchantRequestID: string;
            CheckoutRequestID: string;
            ResultCode: number;
            ResultDesc: string;
        };
    };
}

interface PaymentStatus {status: 'PENDING' | 'COMPLETED' | 'FAILED';[key: string]: any;}

@Controller('mpesa')
@ApiTags('M-Pesa Express')
export class MpesaExpressController {
    private readonly logger = new Logger(MpesaExpressController.name);
    private readonly redis: Redis;

    constructor(
        private readonly mpesaExpressService: MpesaExpressService,
        private readonly redisService: RedisService,
        private readonly prisma: PrismaService,
    ) {this.redis = this.redisService.getOrThrow();}

    @Post('/stkpush')
    @ApiOperation({ summary: 'Initiate STK push', description: 'Prompts the customer on their phone to complete a Lipa Na M-Pesa Online payment.' })
    @ApiBody({ type: CreateMpesaExpressDto })
    @ApiOkResponse({
        description: 'STK push accepted for processing.',
        schema: {
            example: {
                success: true,
                data: {
                    MerchantRequestID: '29115-34620561-1',
                    CheckoutRequestID: 'ws_CO_191220191020363925',
                    ResponseCode: '0',
                    ResponseDescription: 'Success. Request accepted for processing',
                },
            },
        },
    })
    async initiateSTKPush(@Body() createMpesaExpressDto: CreateMpesaExpressDto) {
        try {
            const result = await this.mpesaExpressService.stkPush(createMpesaExpressDto);
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            this.logger.error(`STK Push failed: ${error.message}`);
            throw new HttpException('Failed to initiate payment', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/callback')
    @ApiOperation({ summary: 'Handle STK callback', description: 'Callback endpoint invoked by Safaricom after STK push processing.' })
    async handleSTKCallback(@Body() callback: STKCallback) {
        return this.mpesaExpressService.processCallback(callback);
    }
}

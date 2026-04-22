import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        logger: ['error', 'warn', 'log', 'debug', 'verbose', 'fatal'],
    });
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );
    app.enableCors();
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3000;

    const swaggerConfig = new DocumentBuilder()
        .setTitle('NodeJS Daraja API')
        .setDescription(
            'Interactive API documentation for the Daraja / M-Pesa integration service. Callback endpoints are included for completeness, but the main testing flow starts from the payment, query, and onboarding endpoints.',
        )
        .setVersion('1.0.0')
        .addTag('M-Pesa Express', 'STK push payment initiation and callback handling')
        .addTag('C2B', 'Customer to business registration, simulation, and callbacks')
        .addTag('B2C', 'Business to customer payouts and callbacks')
        .addTag('B2B', 'Business to business transfers and callbacks')
        .addTag('Account Balance', 'Account balance queries and callbacks')
        .addTag('Transaction Status', 'Transaction status queries and callbacks')
        .addTag('Reversal', 'Transaction reversals and callbacks')
        .addTag('Dynamic QR', 'Dynamic QR code generation')
        .addTag('Bill Manager', 'Bill Manager onboarding and payment callbacks')
        .addServer(`http://localhost:${port}`, 'Local development')
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(`${globalPrefix}/docs`, app, swaggerDocument, {
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'list',
        },
        customSiteTitle: 'NodeJS Daraja API Docs',
    });

    await app.listen(port);
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    Logger.log(`📘 Swagger docs available at: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();

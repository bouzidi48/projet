import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { OrderService } from './order/order.service';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.use(cookieParser());
  
  // Configure session
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { 
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        secure: process.env.NODE_ENV === 'production', // secure cookies in production
        httpOnly: true // HTTP only, prevents JavaScript cookie access
      }
    }),
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true,
  });

  // Use validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use('/payment/webhook', bodyParser.raw({ type: 'application/json' }));

  // Start server
  await app.listen(3000);

  // Start scheduled task
  const orderService = app.get(OrderService);
  orderService.startScheduledTask();
}

bootstrap();

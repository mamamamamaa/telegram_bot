import { Module } from '@nestjs/common';
import { TelegramModule } from '../telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { OpenAiModule } from '@/openAi/openAi.module';
import { InstagramModule } from '../instagram/instagram.module';
import { TiktokModule } from '../tiktok/tiktok.module';
import { YoutubeModule } from '../youtube/youtube.module';
import { ConversionModule } from '../conversion/conversion.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TelegramModule,
    OpenAiModule,
    InstagramModule,
    TiktokModule,
    YoutubeModule,
    ConversionModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { OpenAiModule } from '@/openAi/openAi.module';
import { InstagramModule } from './instagram/instagram.module';
import { TiktokModule } from './tiktok/tiktok.module';
import { YoutubeModule } from './youtube/youtube.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TelegramModule,
    OpenAiModule,
    InstagramModule,
    TiktokModule,
    YoutubeModule,
  ],
})
export class AppModule {}

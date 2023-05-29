import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from './telegraf-config.factory';
import { OpenAiModule } from '@/openAi/openAi.module';
import { InstagramModule } from '@/instagram/instagram.module';
import { TiktokModule } from '@/tiktok/tiktok.module';
import { HttpModule } from '@nestjs/axios';
import { YoutubeModule } from '@/youtube/youtube.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync(options()),
    OpenAiModule,
    InstagramModule,
    TiktokModule,
    HttpModule,
    YoutubeModule,
  ],
  providers: [TelegramService],
})
export class TelegramModule {}

import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from './telegraf-config.factory';
import { OpenAiModule } from '@/openAi/openAi.module';
import { InstagramModule } from '@/instagram/instagram.module';
import { TiktokModule } from '@/tiktok/tiktok.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TelegrafModule.forRootAsync(options()),
    OpenAiModule,
    InstagramModule,
    TiktokModule,
    HttpModule,
  ],
  providers: [TelegramService],
})
export class TelegramModule {}

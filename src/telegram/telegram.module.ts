import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from './telegraf-config.factory';
import { ChatgptModule } from '@/chatgpt/chatgpt.module';
import { InstagramModule } from '@/instagram/instagram.module';
import { TiktokModule } from '@/tiktok/tiktok.module';
import { ConversionService } from './conversion/conversion.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TelegrafModule.forRootAsync(options()),
    ChatgptModule,
    InstagramModule,
    TiktokModule,
    HttpModule,
  ],
  providers: [TelegramService, ConversionService],
})
export class TelegramModule {}

import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { options } from './telegraf-config.factory';
import { ChatgptModule } from '@/chatgpt/chatgpt.module';
import { InstagramModule } from '@/instagram/instagram.module';
import { TiktokModule } from '@/tiktok/tiktok.module';
import { ConversionService } from './conversion/conversion.service';

@Module({
  imports: [
    TelegrafModule.forRootAsync(options()),
    ChatgptModule,
    InstagramModule,
    TiktokModule,
  ],
  providers: [TelegramService, ConversionService],
})
export class TelegramModule {}

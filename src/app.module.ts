import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { ChatgptModule } from './chatgpt/chatgpt.module';
import { InstagramModule } from './instagram/instagram.module';
import { TiktokModule } from './tiktok/tiktok.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TelegramModule,
    ChatgptModule,
    InstagramModule,
    TiktokModule,
  ],
})
export class AppModule {}

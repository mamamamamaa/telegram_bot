import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { HttpModule } from '@nestjs/axios';
import { ConversionModule } from '@/conversion/conversion.module';

@Module({
  imports: [HttpModule, ConversionModule],
  providers: [YoutubeService],
  exports: [YoutubeService],
})
export class YoutubeModule {}

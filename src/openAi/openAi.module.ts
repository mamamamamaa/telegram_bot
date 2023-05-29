import { Module } from '@nestjs/common';
import { OpenAiService } from './openAi.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}

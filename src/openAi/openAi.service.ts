import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, of } from 'rxjs';
import { ChatGptResponse, ImageGenerateResponse } from '@/types/chatgpt';

@Injectable()
export class OpenAiService {
  private readonly logger = new Logger(OpenAiService.name);
  private readonly chatGptUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly imageGenerationUrl =
    'https://api.openai.com/v1/images/generations';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const apiKey = this.configService.get('OPENAI_API');

    this.httpService.axiosRef.defaults.headers.common = {
      Authorization: `Bearer ${apiKey}`,
    };
  }

  async generateChatResponse(content: string): Promise<string> {
    const reqData = {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content }],
      temperature: 1,
    };

    const { data } = await firstValueFrom(
      this.httpService.post<ChatGptResponse>(this.chatGptUrl, reqData).pipe(
        catchError((err) => {
          this.logger.error(err);
          return of(err.response.statusText);
        }),
      ),
    );

    return data.choices[0].message.content.trim();
  }

  async generateImage(prompt: string): Promise<string> {
    const reqData = {
      prompt,
      n: 1,
      size: '256x256',
    };

    const { data } = await firstValueFrom(
      this.httpService
        .post<ImageGenerateResponse>(this.imageGenerationUrl, reqData)
        .pipe(
          catchError((err) => {
            this.logger.error(err);
            return of(err.response.statusText);
          }),
        ),
    );

    return data.data[0].url;
  }
}

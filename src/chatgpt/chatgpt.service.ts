import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, of } from 'rxjs';

interface ChatGptAnswer {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }[];
}

interface ImageGenerateAnswer {
  created: number;
  data: { url: string }[];
}

@Injectable()
export class ChatgptService {
  private readonly logger = new Logger(ChatgptService.name);
  private readonly chatGptUrl;
  private readonly imageGenerationUrl;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.chatGptUrl = 'https://api.openai.com/v1/chat/completions';
    this.imageGenerationUrl = 'https://api.openai.com/v1/images/generations';

    const apiKey = this.configService.get('OPENAI_API');

    this.httpService.axiosRef.defaults.headers.common = {
      'Content-Type': 'application/json',
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
      this.httpService.post<ChatGptAnswer>(this.chatGptUrl, reqData).pipe(
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
        .post<ImageGenerateAnswer>(this.imageGenerationUrl, reqData)
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

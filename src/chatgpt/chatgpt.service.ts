import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, of } from 'rxjs';
import { ChatGptResponse, ImageGenerateResponse } from '@/types/chatgpt';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ChatgptService {
  private readonly logger = new Logger(ChatgptService.name);
  private readonly chatGptUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly imageGenerationUrl =
    'https://api.openai.com/v1/images/generations';
  private readonly audioTranscribesUrl =
    'https://api.openai.com/v1/audio/transcriptions';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const apiKey = this.configService.get('OPENAI_API');

    this.httpService.axiosRef.defaults.headers.common = {
      Authorization: `Bearer ${apiKey}`,
    };
  }

  // async transcribeAudio(link: URL): Promise<string | false> {
  //   try {
  //     const fileResponse = await firstValueFrom(
  //       this.httpService.get(link.href, { responseType: 'arraybuffer' }),
  //     );
  //
  //     const mp3Buffer = fileResponse.data;
  //
  //     const uploadPath = path.join(
  //       __dirname,
  //       '../',
  //       '../',
  //       'temp',
  //       'voice.mp3',
  //     );
  //
  //     const obj = {
  //       data: mp3Buffer,
  //     };
  //
  //     await fs.writeFileSync(uploadPath, mp3Buffer);
  //
  //     const reqData = {
  //       file: mp3Buffer,
  //       model: 'whisper-1',
  //     };
  //
  //     const formData = new FormData();
  //     formData.append('file', fs.createReadStream(uploadPath));
  //     formData.append('model', 'whisper-1');
  //
  //     const { data } = await firstValueFrom(
  //       this.httpService
  //         .post<TranscribeAudioResponse>(this.audioTranscribesUrl, formData, {
  //           headers: { 'Content-Type': 'multipart/form-data' },
  //         })
  //         .pipe(
  //           catchError((err) => {
  //             this.logger.error(err);
  //             return of(err.response.statusText);
  //           }),
  //         ),
  //     );
  //
  //     return data.text;
  //   } catch (err) {
  //     return false;
  //   }
  // }

  async transcribeAudio(link: URL): Promise<string | false> {
    try {
      const fileResponse = await firstValueFrom(
        this.httpService.get(link.href, { responseType: 'arraybuffer' }),
      );

      const mp3Buffer = fileResponse.data;

      const uploadPath = path.join(
        __dirname,
        '../',
        '../',
        'temp',
        `${fileResponse.statusText}.mp3`,
      );

      console.log(uploadPath);

      await fs.writeFileSync(uploadPath, mp3Buffer);

      const formData = {
        file: fs.createReadStream(uploadPath),
        model: 'whisper-1',
      };

      const headers = {
        'Content-Type': 'multipart/form-data',
      };

      const res = await firstValueFrom(
        this.httpService.post(
          'https://api.openai.com/v1/audio/transcriptions',
          JSON.stringify(formData),
          { headers },
        ),
      );

      console.log(res);

      return 'dasdas';
    } catch (err) {
      console.log(err);
      return false;
    }
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

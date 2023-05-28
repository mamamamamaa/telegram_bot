import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, of } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Context } from '@/telegram/telegram.service';
import { MediaGroup } from 'telegraf/typings/telegram-types';

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);
  private readonly rapidApiKey: string;
  private readonly options: {
    params: {
      url: string;
      headers: {
        'X-RapidAPI-Key': string;
        'X-RapidAPI-Host': string;
      };
    };
  };

  private readonly instagramApiUrl =
    'https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index';
  private readonly instagramApiHost =
    'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com';
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.rapidApiKey = configService.get('RAPID_API_V4');
  }

  async instagramDownload(url: string, ctx: Context) {
    if (typeof res === 'string') {
      ctx.replyWithVideo(res, {
        reply_to_message_id: ctx.message.message_id,
      });
    } else {
      const group: MediaGroup = res.map((img) => ({
        type: 'photo',
        media: img,
      }));
      ctx.replyWithMediaGroup(group, {
        reply_to_message_id: ctx.message.message_id,
      });
    }

    const { data } = await firstValueFrom(
      this.httpService.get(this.instagramApiUrl, options).pipe(
        catchError((err) => {
          this.logger.error(err);
          return of(err.response.statusText);
        }),
      ),
    );
    return data.media;
  }
}

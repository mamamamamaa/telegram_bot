import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, of } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Context } from '@/telegram/telegram.service';
import { MediaGroup } from 'telegraf/typings/telegram-types';
import { IInstagramReqOptions } from '@/types/instagram';

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);
  private readonly options: IInstagramReqOptions;
  private readonly instagramApiUrl =
    'https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index';
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.options = {
      params: {
        url: null,
      },
      headers: {
        'X-RapidAPI-Host':
          'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com',
        'X-RapidAPI-Key': configService.get('RAPID_API_V1'),
      },
    };
  }

  async instagramDownload(url: string, ctx: Context) {
    const extraReplyOptions = {
      reply_to_message_id: ctx.message.message_id,
    };

    this.options.params.url = url;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(this.instagramApiUrl, this.options).pipe(
          catchError((err) => {
            this.logger.error(err);
            return of(err.response.statusText);
          }),
        ),
      );

      if (typeof data.media === 'string') {
        await ctx.replyWithVideo(data.media, extraReplyOptions);
        return;
      }

      const group: MediaGroup = data.media.map((img) => ({
        type: 'photo',
        media: img,
      }));

      await ctx.replyWithMediaGroup(group, extraReplyOptions);
    } catch (error) {
      await ctx.reply(error.message, extraReplyOptions);
    }
  }
}

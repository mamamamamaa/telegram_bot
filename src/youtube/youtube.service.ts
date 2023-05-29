import { Injectable, Logger } from '@nestjs/common';
import { IYoutubeOptions } from '@/types/youtube';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Context } from '@/telegram/telegram.service';
import { catchError, firstValueFrom, of } from 'rxjs';
import { TiktokResponse } from '@/types/tiktok';

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);
  private readonly options: IYoutubeOptions;
  private readonly youtubeApiUrl = 'https://yt-api.p.rapidapi.com/dl';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.options = {
      params: {
        id: null,
      },
      headers: {
        'X-RapidAPI-Host': 'yt-api.p.rapidapi.com',
        'X-RapidAPI-Key': this.configService.get('RAPID_API_V4'),
      },
    };
  }

  async downloadYoutubeShorts(url: string, ctx: Context) {
    const extraReplyOptions = {
      reply_to_message_id: ctx.message.message_id,
    };
    const { pathname } = new URL(url);

    this.options.params.id = pathname.split('/').at(-1);

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(this.youtubeApiUrl, this.options).pipe(
          catchError((err) => {
            this.logger.error(err);
            return of(err.response.statusText);
          }),
        ),
      );

      await ctx.replyWithVideo(data.formats.at(-1).url, extraReplyOptions);
    } catch (error) {
      await ctx.reply(error.message, extraReplyOptions);
    }
  }
}

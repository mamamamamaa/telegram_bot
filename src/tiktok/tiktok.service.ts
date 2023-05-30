import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, of } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { TiktokResponse, TTiktokReqOptions } from '@/types/tiktok';
import { Context } from '@/telegram/telegram.service';
import { MediaGroup } from 'telegraf/typings/telegram-types';

@Injectable()
export class TiktokService {
  private readonly logger = new Logger(TiktokService.name);
  private readonly options: TTiktokReqOptions;
  private readonly tiktokApiUrl =
    'https://tiktok-video-no-watermark2.p.rapidapi.com/';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.options = {
      params: {
        url: null,
      },
      headers: {
        'X-RapidAPI-Key': configService.get('RAPID_API_V4'),
        'X-RapidAPI-Host': "tiktok-video-no-watermark2.p.rapidapi.com'",
      },
    };
  }

  async tiktokDownload(url: string, ctx: Context): Promise<TiktokResponse> {
    const extraReplyOptions = {
      reply_to_message_id: ctx.message.message_id,
    };

    this.options.params.url = url;

    try {
      const { data: reqData } = await firstValueFrom(
        this.httpService
          .get<TiktokResponse>(this.tiktokApiUrl, this.options)
          .pipe(
            catchError((err) => {
              console.log(err);
              this.logger.error(err);
              return of(err.response.statusText);
            }),
          ),
      );

      if (!reqData.data?.images) {
        await ctx.replyWithVideo(reqData.data.play, extraReplyOptions);
        return;
      }

      const group: MediaGroup = reqData.images.map((img) => ({
        type: 'photo',
        media: img,
      }));

      await ctx.replyWithMediaGroup(group, extraReplyOptions);
    } catch (error) {
      await ctx.reply(error.message, extraReplyOptions);
    }
  }
}

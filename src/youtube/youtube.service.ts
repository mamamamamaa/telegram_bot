import { Injectable, Logger } from '@nestjs/common';
import { IYoutubeOptions } from '@/types/youtube';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Context } from '@/telegram/telegram.service';
import { catchError, firstValueFrom, of } from 'rxjs';
import { ConversionService } from '@/conversion/conversion.service';

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);
  private readonly options: IYoutubeOptions;
  private readonly youtubeApiUrl = 'https://yt-api.p.rapidapi.com/dl';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly conversionService: ConversionService,
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

  async downloadShorts(url: string, ctx: Context) {
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

  async downloadMusic(url: string, ctx: Context) {
    const extraReplyOptions = {
      reply_to_message_id: ctx.message.message_id,
      thumb: { url: null },
    };

    const { searchParams } = new URL(url);

    this.options.params.id = searchParams.get('v');

    try {
      const { data } = await firstValueFrom(
        this.httpService.get(this.youtubeApiUrl, this.options).pipe(
          catchError((err) => {
            this.logger.error(err);
            return of(err.response.statusText);
          }),
        ),
      );

      const filename = data.title;
      const url = data.formats.at(-1).url;
      const coverImage = data.thumbnail.at(-1).url;

      extraReplyOptions.thumb.url = coverImage;

      const path = await this.conversionService.converseVideoToAudio(url);

      await ctx.replyWithAudio({ source: path, filename }, extraReplyOptions);
    } catch (error) {
      await ctx.reply(error.message, extraReplyOptions);
    }
  }
}

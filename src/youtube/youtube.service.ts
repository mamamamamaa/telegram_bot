import { Injectable } from '@nestjs/common';
import { IYoutubeOptions } from '@/types/youtube';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Context } from '@/telegram/telegram.service';

@Injectable()
export class YoutubeService {
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

  async downloadYoutubeShorts(url: string, ctx: Context) {}
}

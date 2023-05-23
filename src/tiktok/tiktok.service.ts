import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, of } from 'rxjs';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { TiktokResponse } from '@/types/tiktok';

@Injectable()
export class TiktokService {
  private readonly logger = new Logger(TiktokService.name);
  private readonly rapidApiKey: string;

  private readonly tiktokApiUrl =
    'https://tiktok-video-no-watermark2.p.rapidapi.com/';
  private readonly tiktokApiHost = 'tiktok-video-no-watermark2.p.rapidapi.com';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.rapidApiKey = configService.get('RAPID_API_V1');
  }

  async tiktokDownload(url: string): Promise<TiktokResponse> {
    const options = {
      params: {
        url,
      },
      headers: {
        'X-RapidAPI-Key': this.rapidApiKey,
        'X-RapidAPI-Host': this.tiktokApiHost,
      },
    };

    const { data } = await firstValueFrom(
      this.httpService.get<TiktokResponse>(this.tiktokApiUrl, options).pipe(
        catchError((err) => {
          this.logger.error(err);
          return of(err.response.statusText);
        }),
      ),
    );
    return data;
  }
}

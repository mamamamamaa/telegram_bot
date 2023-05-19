import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, of } from 'rxjs';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);
  private readonly rapidApiKey: string;

  private readonly instagramApiUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.rapidApiKey = configService.get('RAPID_API');
    this.instagramApiUrl =
      'https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index';
  }

  async instagramDownload(url: string) {
    const options = {
      params: {
        url,
      },
      headers: {
        'X-RapidAPI-Key': '6567c6a3e6msh7b7de88af21691ap194b34jsnc7bf7d40f714',
        'X-RapidAPI-Host':
          'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com',
      },
    };

    const { data } = await firstValueFrom(
      this.httpService.get(this.instagramApiUrl, options).pipe(
        catchError((err) => {
          this.logger.error(err);
          console.log(err);
          return of(err.response.statusText);
        }),
      ),
    );

    return data.media;
  }
}

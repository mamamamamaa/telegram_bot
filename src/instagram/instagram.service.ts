import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, of } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);
  private readonly rapidApiKey: string;

  private readonly instagramApiUrl =
    'https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index';
  private readonly instagramApiHost =
    'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com';
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.rapidApiKey = configService.get('RAPID_API_V1');
  }

  async instagramDownload(url: string) {
    const options = {
      params: {
        url,
      },
      headers: {
        'X-RapidAPI-Key': this.rapidApiKey,
        'X-RapidAPI-Host': this.instagramApiHost,
      },
    };

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

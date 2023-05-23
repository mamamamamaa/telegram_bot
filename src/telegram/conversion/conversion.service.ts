import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConversionService {
  constructor(private readonly httpService: HttpService) {
    ffmpeg.setFfmpegPath(ffmpegPath.path);
  }
  async convertOggToMp3(link: URL) {
    const inputFilePath = path.join(
      __dirname,
      '../',
      '../',
      '../',
      'temp',
      'voice.oga',
    );
    const uploadFilePath = path.join(
      __dirname,
      '../',
      '../',
      '../',
      'temp',
      'voice.wav',
    );

    try {
      const { data: fileBuffer } = await firstValueFrom(
        this.httpService.get(link.href, { responseType: 'arraybuffer' }),
      );

      await fs.writeFileSync(inputFilePath, fileBuffer);

      await ffmpeg(inputFilePath).toFormat('wav').save(uploadFilePath);

      return uploadFilePath;
    } catch {
      return false;
    }
  }
}

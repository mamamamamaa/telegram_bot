import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConversionService {
  constructor(private readonly httpService: HttpService) {}
  async convertOggToMp3(link: URL) {
    const inputFilePath = path.join(
      __dirname,
      '../',
      '../',
      '../',
      'temp',
      'voice.ogg',
    );
    const uploadFilePath = path.join(
      __dirname,
      '../',
      '../',
      '../',
      'temp',
      'voice.mp3',
    );

    try {
      const { data: fileBuffer } = await firstValueFrom(
        this.httpService.get(link.href, { responseType: 'arraybuffer' }),
      );

      fs.writeFileSync(inputFilePath, fileBuffer);
      fs.writeFileSync(uploadFilePath, 'tempFile');

      ffmpeg(inputFilePath)
        .audioCodec('libmp3lame')
        .on('end', () => console.log('Success!'))
        .on('error', (err) => console.log(err.message))
        .save(uploadFilePath);

      return uploadFilePath;
    } catch {
      return false;
    }
  }
}

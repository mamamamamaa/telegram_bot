import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import * as ffmpegPath from '@ffmpeg-installer/ffmpeg';

@Injectable()
export class ConversionService {
  constructor(private readonly httpService: HttpService) {
    ffmpeg.setFfmpegPath(ffmpegPath.path);
  }

  async promisifyConverse(
    inputPath: string,
    outputPath: string,
    format: string,
  ) {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .toFormat(format)
        .on('end', () => resolve(true))
        .on('error', (err: Error) => reject(new Error(err.message)))
        .save(outputPath);
    });
  }
  async converseVideoToAudio(videoUrl: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(videoUrl, { responseType: 'arraybuffer' }),
    );

    const inputPath = path.join(__dirname, '../', '../', 'temp', `video.mp4`);
    const outputPath = path.join(__dirname, '../', '../', 'temp', 'audio.mp3');

    await fs.writeFileSync(inputPath, data);

    await this.promisifyConverse(inputPath, outputPath, 'mp3');

    return outputPath;
  }
}

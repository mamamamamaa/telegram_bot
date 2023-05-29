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
  async converseVideoToAudio(videoUrl: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(videoUrl, { responseType: 'arraybuffer' }),
    );

    const inputPath = path.join(__dirname, '../', '../', 'temp', `video.mp4`);
    const outputPath = path.join(__dirname, '../', '../', 'temp', 'audio.mp3');

    await fs.writeFileSync(inputPath, data);

    await ffmpeg(inputPath)
      .toFormat('mp3')
      .on('end', () => console.log('Success!'))
      .on('error', (err) => console.log(err.message))
      .save(outputPath);

    return outputPath;
  }
}

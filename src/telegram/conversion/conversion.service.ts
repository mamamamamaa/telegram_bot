import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { Context } from '@/telegram/telegram.service';

const ffprobe = promisify(ffmpeg.ffprobe);

@Injectable()
export class ConversionService {
  async convertOggToMp3(fileId: string, ctx: Context): Promise<void> {
    const fileLink = await ctx.telegram.getFileLink(fileId);
    const oggFilePath = fileLink.href;
    const mp3FilePath = oggFilePath.replace('.ogg', '.mp3');

    try {
      const { streams } = await ffprobe(oggFilePath);
      const audioStream = streams.find(
        (stream) => stream.codec_type === 'audio',
      );

      if (!audioStream) {
        throw new Error('Input file does not contain an audio stream.');
      }

      const ffmpegCommand = ffmpeg();

      ffmpegCommand.input(oggFilePath);
      ffmpegCommand.output(mp3FilePath);
      ffmpegCommand.audioCodec('libmp3lame');
      ffmpegCommand.format('mp3');

      console.log('hrere');
      await promisify(ffmpegCommand.run).bind(ffmpegCommand)();
      await ctx.replyWithAudio({ source: mp3FilePath });
    } catch (error) {
      console.error('Error converting OGG to MP3:', error);
      // Handle the error appropriately
    }
  }
}

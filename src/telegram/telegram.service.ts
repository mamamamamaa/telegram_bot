import { Command, Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { OpenAiService } from '@/openAi/openAi.service';
import { InstagramService } from '@/instagram/instagram.service';
import { TiktokService } from '@/tiktok/tiktok.service';
import {
  instagramLinkRegex,
  tiktokLinkRegex,
  youtubeMusicLinkRegex,
  youtubeShortsLinkRegex,
} from '@/utils/regexs';
import { YoutubeService } from '@/youtube/youtube.service';

export type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> {
  constructor(
    private readonly configService: ConfigService,
    private readonly openAiService: OpenAiService,
    private readonly instagramService: InstagramService,
    private readonly tiktokService: TiktokService,
    private readonly youtubeService: YoutubeService,
  ) {
    super(configService.get('TELEGRAM_API'));
  }

  @Start()
  startMessage(@Ctx() ctx: Context) {
    ctx.telegram.setMyCommands([
      {
        command: 'start',
        description: 'Starting message',
      },
      {
        command: 'all',
        description: 'Ping all chat members',
      },
      {
        command: 'image',
        description: 'Generate images',
      },
      {
        command: 'chat',
        description: 'Ask a question from bot',
      },
    ]);
    ctx.replyWithHTML('<b>Glory to Ukraine!</b>');
  }

  @Command('chat')
  async onChat(@Message('text') message, @Ctx() ctx: Context) {
    const [cmd, ...text] = message.split(' ');

    const prompt = text.join(' ');

    if (!prompt) {
      ctx.reply('Bad request!', {
        reply_to_message_id: ctx.message.message_id,
      });
    } else {
      ctx.replyWithHTML(
        await this.openAiService.generateChatResponse(message),
        {
          reply_to_message_id: ctx.message.message_id,
        },
      );
    }
  }

  @Command('image')
  async onImage(@Message('text') message: string, @Ctx() ctx: Context) {
    const [cmd, ...text] = message.split(' ');

    const prompt = text.join(' ');

    if (!prompt) {
      ctx.reply('Bad request!', {
        reply_to_message_id: ctx.message.message_id,
      });
    } else {
      ctx.replyWithHTML(await this.openAiService.generateImage(message), {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  }

  @Command('all')
  async pingAll(@Ctx() ctx: Context) {
    const id = ctx.chat.id;
    ctx.telegram.getChat;

    try {
      const users = await ctx.telegram.getChatAdministrators(id);

      let message = 'Achtung!\n\n';

      users.forEach(
        ({ user }) => (message += user.is_bot ? '' : `@${user.username}\n`),
      );
      ctx.reply(message);
    } catch {
      ctx.reply('Smth went wrong. Try again!');
    }
  }

  @On('text')
  async socialMedia(@Message('text') message: string, @Ctx() ctx: Context) {
    if (instagramLinkRegex.test(message)) {
      await this.instagramService.instagramDownload(message, ctx);
    } else if (tiktokLinkRegex.test(message)) {
      await this.tiktokService.tiktokDownload(message, ctx);
    } else if (youtubeShortsLinkRegex.test(message)) {
      await this.youtubeService.downloadShorts(message, ctx);
    } else if (youtubeMusicLinkRegex.test(message)) {
      await this.youtubeService.downloadMusic(message, ctx);
    }
  }
}

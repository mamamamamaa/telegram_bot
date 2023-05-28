import { Command, Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { ChatgptService } from '@/chatgpt/chatgpt.service';
import { InstagramService } from '@/instagram/instagram.service';
import { TiktokService } from '@/tiktok/tiktok.service';
import { MediaGroup } from 'telegraf/typings/telegram-types';
import { ConversionService } from '@/telegram/conversion/conversion.service';
import { instagramLinkRegex, tiktokLinkRegex } from '@/utils/regexs';

export type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> {
  constructor(
    private readonly configService: ConfigService,
    private readonly chatGptService: ChatgptService,
    private readonly instagramService: InstagramService,
    private readonly tiktokService: TiktokService,
    private readonly conversionService: ConversionService,
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
        await this.chatGptService.generateChatResponse(message),
        {
          reply_to_message_id: ctx.message.message_id,
        },
      );
    }
  }

  // @Command('image')
  // async onImage(@Message('text') message: string, @Ctx() ctx: Context) {
  //   const [cmd, ...text] = message.split(' ');
  //
  //   const prompt = text.join(' ');
  //
  //   if (!prompt) {
  //     ctx.reply('Bad request!', {
  //       reply_to_message_id: ctx.message.message_id,
  //     });
  //   } else {
  //     ctx.replyWithHTML(await this.chatGptService.generateImage(message), {
  //       reply_to_message_id: ctx.message.message_id,
  //     });
  //   }
  // }

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

  // @On('voice')
  // async transcribeAudio(@Message('voice') voice, @Ctx() ctx: Context) {
  //   const fileId = voice.file_id;
  //
  //   const file = await ctx.telegram.getFileLink(fileId);
  //   const path = await this.conversionService.convertOggToMp3(file);
  //
  //   if (!path) {
  //     ctx.reply('Smth went wrong. Try again!', {
  //       reply_to_message_id: ctx.message.message_id,
  //     });
  //     return;
  //   }
  //
  //   const res = await this.chatGptService.transcribeAudio(path);
  //
  //   if (!res) {
  //     ctx.reply('Smth went wrong. Try again!', {
  //       reply_to_message_id: ctx.message.message_id,
  //     });
  //     return;
  //   }
  //
  //   ctx.reply(res, {
  //     reply_to_message_id: ctx.message.message_id,
  //   });
  // }

  @On('text')
  async socialMedia(@Message('text') message: string, @Ctx() ctx: Context) {
    if (instagramLinkRegex.test(message)) {
      await this.instagramService.instagramDownload(message, ctx);
    } else if (tiktokLinkRegex.test(message)) {
      await this.tiktokService.tiktokDownload(message, ctx);
    }
  }
}

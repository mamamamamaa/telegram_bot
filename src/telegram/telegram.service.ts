import { Command, Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { ChatgptService } from '@/chatgpt/chatgpt.service';
import { InstagramService } from '@/instagram/instagram.service';
import { actionButtons } from '@/telegram/telegram-buttons';

type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> {
  constructor(
    private readonly configService: ConfigService,
    private readonly chatGptService: ChatgptService,
    private readonly instagramService: InstagramService,
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

  @Command('image')
  async onImage(@Message('text') message: string, @Ctx() ctx: Context) {
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
    ctx.replyWithPhoto(await this.chatGptService.generateImage(message));
  }

  // @On('text')
  // async inst(@Message('text') message: string, @Ctx() ctx: Context) {
  //   const regex =
  //     /https?:\/\/(?:www\.)?instagram\.com\/(?:reel|stories|p)\/[A-Za-z0-9_\-]+/;
  //
  //   if (regex.test(message)) {
  //     ctx.replyWithVideo(
  //       await this.instagramService.instagramDownload(message),
  //       {
  //         reply_to_message_id: ctx.message.message_id,
  //       },
  //     );
  //   }
  // }
}

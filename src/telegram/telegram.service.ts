import { Command, Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { ChatgptService } from '@/chatgpt/chatgpt.service';
import { InstagramService } from '@/instagram/instagram.service';
import { TiktokService } from '@/tiktok/tiktok.service';
import { MediaGroup } from 'telegraf/typings/telegram-types';

type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> {
  constructor(
    private readonly configService: ConfigService,
    private readonly chatGptService: ChatgptService,
    private readonly instagramService: InstagramService,
    private readonly tiktokService: TiktokService,
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

  @Command('image')
  async onImage(@Message('text') message: string, @Ctx() ctx: Context) {
    const [cmd, ...text] = message.split(' ');

    const prompt = text.join(' ');

    if (!prompt) {
      ctx.reply('Bad request!', {
        reply_to_message_id: ctx.message.message_id,
      });
    } else {
      ctx.replyWithHTML(await this.chatGptService.generateImage(message), {
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
    const instaLinkRegex =
      /https?:\/\/(?:www\.)?instagram\.com\/(?:reel|stories|p)\/[A-Za-z0-9_\-]+/;

    const tiktokLinkRegex = /https?:\/\/vm\.tiktok\.com\/[a-zA-Z0-9]+\/?/;

    if (instaLinkRegex.test(message)) {
      ctx.replyWithVideo(
        await this.instagramService.instagramDownload(message),
        {
          reply_to_message_id: ctx.message.message_id,
        },
      );
    } else if (tiktokLinkRegex.test(message)) {
      const { data } = await this.tiktokService.tiktokDownload(message);

      if (data?.images) {
        const group: MediaGroup = data.images.map((img) => ({
          type: 'photo',
          media: img,
        }));

        ctx.replyWithMediaGroup(group, {
          reply_to_message_id: ctx.message.message_id,
        });
      } else {
        ctx.replyWithVideo(data.play, {
          reply_to_message_id: ctx.message.message_id,
        });
      }
    }
  }
}

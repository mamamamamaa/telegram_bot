import { Command, Ctx, Message, On, Start, Update } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { ChatgptService } from '@/chatgpt/chatgpt.service';
import { InstagramService } from '@/instagram/instagram.service';

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
  // @On('text')
  // onMessage(@Message('text') message: string, @Ctx() ctx: Context) {
  //   return this.gpt.generateChatResponse(message);
  // }

  // @On('text')
  // async image(@Message('text') message: string, @Ctx() ctx: Context) {
  //   ctx.replyWithPhoto(await this.gpt.generateImage(message));
  // }

  // @Command('image')
  // onImage(@Ctx() ctx: Context) {
  //   console.log(ctx);
  // }
  //
  // @Command('chat')
  // onChat(@Ctx() ctx: Context) {
  //   console.log(ctx);
  // }

  @On('text')
  async inst(@Message('text') message: string, @Ctx() ctx: Context) {
    const regex =
      /https?:\/\/(?:www\.)?instagram\.com\/(?:reel|stories|p)\/[A-Za-z0-9_\-]+/;

    if (regex.test(message)) {
      ctx.replyWithVideo(
        await this.instagramService.instagramDownload(message),
        {
          reply_to_message_id: ctx.message.message_id,
        },
      );
    }
  }
}

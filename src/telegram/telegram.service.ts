import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
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
    ctx.reply('Your buttons', actionButtons());
    ctx.replyWithHTML('<b>Glory to Ukraine!</b>');
  }
  // @On('text')
  // onMessage(@Message('text') message: string, @Ctx() ctx: Context) {
  //   return this.chatGptService.generateChatResponse(message);
  // }
  //
  // @On('text')
  // async image(@Message('text') message: string, @Ctx() ctx: Context) {
  //   ctx.replyWithPhoto(await this.chatGptService.generateImage(message));
  // }

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

import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { ChatgptService } from '@/chatgpt/chatgpt.service';

type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> {
  constructor(
    private readonly configService: ConfigService,
    private readonly gpt: ChatgptService,
  ) {
    super(configService.get('TELEGRAM_API'));
  }
  @Start()
  startMessage(@Ctx() ctx: Context) {
    ctx.telegram.setMyCommands([
      {
        command: 'hello',
        description: 'Test command',
      },
      {
        command: 'greetings',
        description: 'Greetings command',
      },
    ]);
    ctx.replyWithHTML('<b>Hello bebra kvas</b>');
  }
  // @On('text')
  // onMessage(@Message('text') message: string, @Ctx() ctx: Context) {
  //   return this.gpt.generateChatResponse(message);
  // }

  // @On('text')
  // async image(@Message('text') message: string, @Ctx() ctx: Context) {
  //   ctx.replyWithPhoto(await this.gpt.generateImage(message));
  // }

  // eslint-disable-next-line prettier/prettier
  @Command('max')
  onMax(@Ctx() ctx: Context) {
    console.log(ctx);
  }
}

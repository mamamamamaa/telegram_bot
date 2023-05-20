import { Markup } from 'telegraf';

export const actionButtons = () => {
  return Markup.keyboard(
    [
      Markup.button.callback('как дела рогулина', 'papa'),
      Markup.button.callback('я ванючка', 'mama'),
      Markup.button.callback('крокодил крокодит', 'deda'),
    ],
    {
      columns: 3,
    },
  );
};

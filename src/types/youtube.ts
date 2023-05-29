export interface IYoutubeOptions {
  params: {
    id: string | null;
  };
  headers: {
    'X-RapidAPI-Key': string;
    'X-RapidAPI-Host': string;
  };
}

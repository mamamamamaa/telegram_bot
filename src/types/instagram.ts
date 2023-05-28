export interface IInstagramReqOptions {
  params: {
    url: string | null;
  };
  headers: {
    'X-RapidAPI-Key': string;
    'X-RapidAPI-Host': string;
  };
}

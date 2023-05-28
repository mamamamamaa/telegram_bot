import { IInstagramReqOptions } from '@/types/instagram';

export interface TiktokResponse {
  code: number;
  msg: string;
  processed_time: 0.3675;
  data: {
    aweme_id: string;
    id: string;
    region: string;
    title: string;
    cover: string;
    origin_cover: string;
    duration: 26;
    play: string;
    wmplay: string;
    size: number;
    wm_size: number;
    music: string;
    music_info: {
      id: string;
      title: string;
      play: string;
      cover: string;
      author: string;
      original: boolean;
      duration: number;
      album: string;
    };
    play_count: number;
    digg_count: number;
    comment_count: number;
    share_count: number;
    download_count: number;
    create_time: number;
    author: {
      id: string;
      unique_id: string;
      nickname: string;
      avatar: string;
    };
    images?: string[];
  };
}
export type TTiktokReqOptions = IInstagramReqOptions;

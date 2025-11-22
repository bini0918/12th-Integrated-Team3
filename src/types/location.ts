export type Location = {
  id: number;
  name: string;
  lat?: number;
  lng?: number;
  address?: string;
  // pinned 속성 추가
  pinned?: boolean;
};

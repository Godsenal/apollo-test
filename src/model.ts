export type Device = {
  vender: string;
  model: string;
  type: string;
};

export type Repository = {
  id: string;
  name: string;
  description: string;
  isChinese: boolean;
  url: string;
};

export type PageInfo = {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
};

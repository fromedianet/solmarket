export type Collection = {
  name: string;
  description: string;
  image: string;
  type: string;
  link: string;
  date?: string;
};

export type Item = {
  name: string;
  id: string;
  price: number;
  address: string;
  image: string;
};

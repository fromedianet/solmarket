export type Collection = {
  _id: string;
  name: string;
  symbol: string;
  description: string | null;
  image: string;
  banner: string | null;
  discord: string;
  twitter: string;
  website: string;
  categories: [],
  is_derivative: boolean;
  derivative: {
    original_link: string | null,
    original_name: string | null,
  };
  candymachine_id: string;
  mint: string;
  owner: string;
};

import { PublicKey, AccountInfo } from "@solana/web3.js";

export type StringPublicKey = string;

export class LazyAccountInfoProxy<T> {
  executable: boolean = false;
  owner: StringPublicKey = "";
  lamports: number = 0;

  get data() {
    //
    return undefined as unknown as T;
  }
}

export interface LazyAccountInfo {
  executable: boolean;
  owner: StringPublicKey;
  lamports: number;
  data: [string, string];
}

const PubKeysInternedMap = new Map<string, PublicKey>();

export const toPublicKey = (key: string | PublicKey) => {
  if (typeof key !== "string") {
    return key;
  }

  let result = PubKeysInternedMap.get(key);
  if (!result) {
    result = new PublicKey(key);
    PubKeysInternedMap.set(key, result);
  }

  return result;
};

export const pubkeyToString = (key: PublicKey | null | string = "") => {
  return typeof key === "string" ? key : key?.toBase58() || "";
};

export interface PublicKeyStringAndAccount<T> {
  pubkey: string;
  account: AccountInfo<T>;
}

export const WRAPPED_SOL_MINT = new PublicKey(
  "So11111111111111111111111111111111111111112"
);

export const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export const BPF_UPGRADE_LOADER_ID = new PublicKey(
  "BPFLoaderUpgradeab1e11111111111111111111111"
);

export const MEMO_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

export const METADATA_PROGRAM_ID =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s" as StringPublicKey;

export const VAULT_ID =
  "vau1zxA2LbssAUEF7Gpw91zMM1LvXrvpzJtmZ58rPsn" as StringPublicKey;

export const AUCTION_ID =
  "auctxRXPeJoc4817jDhf4HbjnhEcr1cCXenosMhK5R8" as StringPublicKey;

export const METAPLEX_ID =
  "p1exdMJcjVao65QdewkaZRUnU6VPSXhus9n2GzWfh98" as StringPublicKey;

export const AUCTION_HOUSE_ID = new PublicKey(
  // 'GEL1XMuVTEtL88DzpYGjDrFQFCG2V8do4BJo2NMoi6pP', // devnet
  "3uMrQYaaUzTy2xAdXokkBdRz4QDTT2jExYatVrpfGbJB" // mainnet-beta
);

export const AUCTION_HOUSE_PROGRAM_ID = new PublicKey(
  "hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk"
);

export const PACK_CREATE_ID = new PublicKey(
  "packFeFNZzMfD9aVWL7QbGz1WcU7R9zpf6pvNsw2BLu"
);

export const ORACLE_ID = new PublicKey(
  "SysvarS1otHashes111111111111111111111111111"
);

export const CANDY_MACHINE_PROGRAM_ID = new PublicKey(
  "cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ"
);

export const SYSTEM = new PublicKey("11111111111111111111111111111111");

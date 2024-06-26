import { useCallback, useState } from "react";
import { MintInfo } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { TokenInfo } from "@solana/spl-token-registry";
import { useLocalStorage } from "../hooks/useLocalStorage";

export type KnownTokenMap = Map<string, TokenInfo>;

export const formatPriceNumber = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
});

export function useLocalStorageState<T>(
  key: string,
  defaultState?: T
): [T, (key: string) => void] {
  const localStorage = useLocalStorage();
  const [state, setState] = useState(() => {
    console.debug("Querying local storage", key);
    const storedState = localStorage.getItem(key);
    console.debug("Retrieved local storage", storedState);
    if (storedState) {
      return JSON.parse(storedState);
    }
    return defaultState;
  });

  const setLocalStorageState = useCallback(
    (newState) => {
      const changed = state !== newState;
      if (!changed) {
        return;
      }
      setState(newState);
      if (newState === null) {
        localStorage.removeItem(key);
      } else {
        try {
          localStorage.setItem(key, JSON.stringify(newState));
        } catch {
          // ignore
        }
      }
    },
    [state, key]
  );

  return [state, setLocalStorageState];
}

export const findProgramAddress = async (
  seeds: (Buffer | Uint8Array)[],
  programId: PublicKey
) => {
  const localStorage = useLocalStorage();
  const key =
    "pda-" +
    seeds.reduce((agg, item) => agg + item.toString("hex"), "") +
    programId.toString();
  const cached = localStorage.getItem(key);
  if (cached) {
    const value = JSON.parse(cached);

    return [value.key, parseInt(value.nonce)] as [string, number];
  }

  const result = await PublicKey.findProgramAddress(seeds, programId);

  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        key: result[0].toBase58(),
        nonce: result[1],
      })
    );
  } catch {
    // ignore
  }

  return [result[0].toBase58(), result[1]] as [string, number];
};

// shorten the checksummed version of the input address to have 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getTokenName(
  map: KnownTokenMap,
  mint?: string | PublicKey,
  shorten = true
): string {
  const mintAddress = typeof mint === "string" ? mint : mint?.toBase58();

  if (!mintAddress) {
    return "N/A";
  }

  const knownSymbol = map.get(mintAddress)?.symbol;
  if (knownSymbol) {
    return knownSymbol;
  }

  return shorten ? `${mintAddress.substring(0, 5)}...` : mintAddress;
}
export function getVerboseTokenName(
  map: KnownTokenMap,
  mint?: string | PublicKey,
  shorten = true
): string {
  const mintAddress = typeof mint === "string" ? mint : mint?.toBase58();

  if (!mintAddress) {
    return "N/A";
  }

  const knownName = map.get(mintAddress)?.name;
  if (knownName) {
    return knownName;
  }

  return shorten ? `${mintAddress.substring(0, 5)}...` : mintAddress;
}

export function getTokenByName(tokenMap: KnownTokenMap, name: string) {
  let token: TokenInfo | null = null;
  for (const val of tokenMap.values()) {
    if (val.symbol === name) {
      token = val;
      break;
    }
  }
  return token;
}

export function getTokenIcon(
  map: KnownTokenMap,
  mintAddress?: string | PublicKey
): string | undefined {
  const address =
    typeof mintAddress === "string" ? mintAddress : mintAddress?.toBase58();
  if (!address) {
    return;
  }

  return map.get(address)?.logoURI;
}

export function isKnownMint(map: KnownTokenMap, mintAddress: string) {
  return !!map.get(mintAddress);
}

export const STABLE_COINS = new Set(["USDC", "wUSDC", "USDT"]);

export function chunks<T>(array: T[], size: number): T[][] {
  // @ts-ignore
  return Array.apply<number, T[], T[][]>(
    0,
    new Array(Math.ceil(array.length / size))
  ).map((_, index) => array.slice(index * size, (index + 1) * size));
}

export const tryParseKey = (key: string): PublicKey | null => {
  try {
    return new PublicKey(key);
  } catch (error) {
    return null;
  }
};

const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"] as const;

const abbreviateNumber = (number: number, precision: number) => {
  if (number < 1000) {
    return number.toFixed(precision);
  }
  const tier = (Math.log10(number) / 3) | 0;
  let scaled = number;
  const suffix = SI_SYMBOL[tier];
  if (tier !== 0) {
    const scale = Math.pow(10, tier * 3);
    scaled = number / scale;
  }
  // Added this to remove unneeded decimals when abbreviating number
  precision = Number.isInteger(scaled) ? 0 : precision;

  //console.log("Number", scaled, precision)

  return scaled.toFixed(precision) + suffix;
};

export const formatAmount = (
  val: number,
  precision: number = 2,
  abbr: boolean = true
) => (abbr ? abbreviateNumber(val, precision) : val.toFixed(precision));

export const formatUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const numberFormater = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatNumber = {
  format: (val?: number) => {
    if (!val) {
      return "--";
    }

    return numberFormater.format(val);
  },
};

export const formatPct = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function royalty(value: number | undefined): string {
  return `${((value || 0) / 100).toFixed(2)}%`;
}

export const getLast = <T>(arr: T[]) => {
  if (arr.length <= 0) {
    return undefined;
  }

  return arr[arr.length - 1];
};

export const getDateStringFromUnixTimestamp = (unix: number) => {
  const date = new Date(unix * 1000);
  const str = date.toLocaleString();
  return str;
};

export const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

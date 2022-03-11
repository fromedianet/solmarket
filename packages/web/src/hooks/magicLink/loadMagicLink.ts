import { Magic } from 'magic-sdk';
import { SolanaExtension } from '@magic-ext/solana';

let sdk;

export default async function loadMagicLink(key, endpoint) {
  const options = {
    extensions: {
      solana: new SolanaExtension({
        rpcUrl: endpoint,
      }),
    },
  };

  if (sdk) {
    return sdk;
  }

  if (!key) {
    return;
  }

  if (key && endpoint && Magic) {
    sdk = new Magic(key, options);
    return sdk;
  }

  return new Promise(resolve => {
    if (sdk) {
      resolve(sdk);
      return;
    }

    sdk = new Magic(key, options);
    resolve(sdk);
  });
}

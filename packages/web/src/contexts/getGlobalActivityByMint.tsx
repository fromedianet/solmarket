import { ConfirmedSignatureInfo, Connection, PublicKey } from '@solana/web3.js';

export const getGlobalActivityByMint = async (
  connection: Connection,
  mintAddress: PublicKey,
): Promise<void> => {
  const result = await connection.getTokenLargestAccounts(
    mintAddress,
    'confirmed',
  );

  if (result.value && result.value.length > 0) {
    const txs: ConfirmedSignatureInfo[] = [];
    await Promise.all(
      result.value.map(async value => {
        const res = await connection.getSignaturesForAddress(value.address);
        res.forEach(item => {
          if (!txs.includes(item)) {
            txs.push(item);
          }
        });
      }),
    );

    txs.sort((a, b) => (b.blockTime || 0) - (a.blockTime || 0));
    // const uniqTxs = uniqBy(txs, JSON.stringify);
    // console.log(uniqTxs);
  }
};

// const uniqBy = (a, key) => {
//   const index = [];
//   return a.filter(function (item) {
//     const k = key(item);
//     return index.indexOf(k) >= 0 ? false : index.push(k);
//   });
// };

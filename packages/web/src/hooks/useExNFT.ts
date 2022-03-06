import { Creator } from '@oyster/common';
import { useEffect, useState } from 'react';
import { NFTData, Transaction } from '../models/exCollection';
import {
  DIGITAL_EYES_URIS,
  MAGIC_EDEN_URIS,
} from '../views/inventory/constants';

export const useExNFT = (
  mintAddress: string,
  market: string,
  price?: number,
) => {
  const [nft, setNFT] = useState<NFTData>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) return;
    getNFTByMintAddress(mintAddress, price);
    getTransactions(mintAddress, market);
  }, [mintAddress]);

  function getNFTByMintAddress(mint: string, price?: number) {
    setLoading(true);
    const uri = MAGIC_EDEN_URIS.getNFTByMintAddress + mint;
    fetch(uri)
      .then(res => res.json())
      .then(data => {
        const result = parseNFTData(data['results']);

        if (result) {
          if (price && result.price === 0) {
            result.price = price;
          }
          setNFT(result);
        }
        setLoading(false);
      });
  }

  // function getBiddingsByQuery(mint: string) {
  //   const query = {
  //     $match: { initializerDepositTokenMintAccount: { $in: [mint] } },
  //     $sort: { createdAt: -1 },
  //   };
  //   const uri =
  //     MAGIC_EDEN_URIS.getBiddingsByQuery +
  //     encodeURIComponent(JSON.stringify(query));
  //   fetch(uri)
  //     .then(res => res.json())
  //     .then(data => {});
  // }

  function getTransactions(mint: string, market: string) {
    if (market === 'magiceden' || market === 'alpha_art') {
      const query = {
        $match: { mint: mint },
        $sort: { blockTime: -1, createdAt: -1 },
        $skip: 0,
      };
      const uri =
        MAGIC_EDEN_URIS.getTransactions + encodeURI(JSON.stringify(query));
      fetch(uri)
        .then(res => res.json())
        .then(data => {
          const txs = parseTransactionsForMagicEden(data);
          setTransactions(txs);
        });
    } else if (market === 'solanart' || market === 'digital_eyes') {
      const uri = DIGITAL_EYES_URIS.getTransactions + mint;
      fetch(uri)
        .then(res => res.json())
        .then(data => {
          const txs = parseTransactionsForDigitalEyes(data);
          setTransactions(txs);
        });
    }
  }

  return { nft, loading, transactions };
};

function parseNFTData(data: any) {
  try {
    const nftData: NFTData = {
      title: data['title'],
      content: data['content'],
      img: data['img'],
      animationURL: data['animationURL'],
      externalURL: data['externalURL'],
      collectionName: data['collectionName'],
      collectionTitle: data['collectionTitle'],
      price: data['price'],
      mintAddress: data['mintAddress'],
      owner: data['owner'],
      tokenAddress: data['id'],
      updateAuthority: data['updateAuthority'],
      propertyCategory: data['propertyCategory'],
      sellerFeeBasisPoints: data['sellerFeeBasisPoints'],
      supply: data['supply'],
      primarySaleHappened: data['primarySaleHappened'],
      tokenDelegateValid: data['tokenDelegateValid'],
      attributes: data['attributes'],
      creators: data['creators'].map(
        item =>
          new Creator({
            address: item['address'],
            verified: item['verified'],
            share: item['share'],
          }),
      ),
    };
    return nftData;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

function parseTransactionsForMagicEden(data: any) {
  const result: Transaction[] = [];
  try {
    data['results'].forEach((item, index) => {
      let txType = '';
      let price;
      switch (item['txType']) {
        case 'initializeEscrow':
          txType = 'LISTING';
          price = item['parsedList']['amount'];
          break;
        case 'cancelEscrow':
          txType = 'CANCEL LISTING';
          break;
        case 'cancelBid':
          txType = 'CANCEL BID';
          break;
        case 'placeBid':
          txType = 'PLACE BID';
          price = item['parsedPlacebid']['amount'];
          break;
        case 'exchange':
          txType = 'SALE';
          price = item['parsedTransaction']['total_amount'];
          break;
      }
      const tx: Transaction = {
        key: index,
        blockTime: item['blockTime'],
        buyer: item['buyer_address'],
        seller: item['seller_address'],
        collection: item['collection_symbol'],
        mint: item['mint'],
        price: price,
        transaction: item['transaction_id'],
        txType: txType,
        name: item['mintObject']['title'],
        image: item['mintObject']['img'],
      };
      result.push(tx);
    });
    result.sort((a, b) => b.blockTime - a.blockTime);
  } catch (e) {
    console.error(e);
  }
  return result;
}

function parseTransactionsForDigitalEyes(data: any) {
  const result: Transaction[] = [];
  try {
    data['sales_history'].forEach((item, index) => {
      const tx: Transaction = {
        key: index,
        blockTime: item['epoch'],
        buyer: item['buyer'],
        seller: item['seller'],
        collection: item['collection'],
        mint: item['mint'],
        price: item['price'],
        transaction: item['transaction'],
        txType: item['type'],
        name: item['tags']['name'],
        image: item['tags']['image'],
      };
      result.push(tx);
    });
  } catch (e) {
    console.error(e);
  }
  return result;
}

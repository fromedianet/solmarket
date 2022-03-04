import { Attribute, Creator } from '@oyster/common';
import { useEffect, useState } from 'react';
import { NFTData } from '../models/exCollection';
import { MAGIC_EDEN_URIS } from '../views/inventory/constants';

export const useExNFT = (mintAddress: string, price?: number) => {
  const [nft, setNFT] = useState<NFTData>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) return;
    getNFTByMintAddress(mintAddress, price);
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
          console.log('nftdata', result);
          setNFT(result);
        }
        setLoading(false);
      });
  }

  function getBiddingsByQuery(mint: string) {
    const query = {
      $match: { initializerDepositTokenMintAccount: { $in: [mint] } },
      $sort: { createdAt: -1 },
    };
    const uri =
      MAGIC_EDEN_URIS.getBiddingsByQuery +
      encodeURIComponent(JSON.stringify(query));
    fetch(uri)
      .then(res => res.json())
      .then(data => {});
  }

  function getTransactions(mint: string) {
    const query = {
      $match: { mint: mint },
      $sort: { blockTime: -1, createdAt: -1 },
      $skip: 0,
    };
    const uri =
      MAGIC_EDEN_URIS.getTransactions + encodeURI(JSON.stringify(query));
    fetch(uri)
      .then(res => res.json())
      .then(data => {});
  }

  return { nft, loading };
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

import React, { useContext, useRef, createRef } from 'react';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import { formatPrice } from '../../../helpers/utils';
import "./Marketplace.css";
import NFTCard from '../../Layout/NftCard';


const Marketplace = () => {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  const marketplaceCtx = useContext(MarketplaceContext);

  const priceRefs = useRef([]);
  if (priceRefs.current.length !== collectionCtx.collection.length) {
    priceRefs.current = Array(collectionCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
  }

  const buyHandler = (index) => {
    marketplaceCtx.contract.methods.fillOffer(marketplaceCtx.offers[index].offerId).send({ from: web3Ctx.account, value: marketplaceCtx.offers[index].price })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        marketplaceCtx.setMktIsLoading(false);
      });
  };

  const collection = collectionCtx.collection.filter(e => marketplaceCtx.offers.findIndex(offer => (offer.id === e.id && offer.user !== web3Ctx.account)) !== -1);


  return (
    <div style={{ alignItems: "center", padding: "1rem 3rem 1rem 3rem" }} >
      <h2 style={{ color: "#131313" }}>
        NFT Marketplace
      </h2>
      <div className='container-fluid' >
        <div className="row gy-4" >
          {collection.map((NFT, key) => {
            const index = marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id);
            const owner = marketplaceCtx.offers[index].user;
            const price = formatPrice(marketplaceCtx.offers[index].price).toFixed(2);


            return (
              <NFTCard NFT={NFT} key={key} index={index} price={price} owner={owner} buyHandler={buyHandler}></NFTCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};


export default Marketplace;
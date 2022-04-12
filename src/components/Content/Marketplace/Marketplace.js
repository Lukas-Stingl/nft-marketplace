import React, { useContext, useRef, createRef } from 'react';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import { formatPrice } from '../../../helpers/utils';
import "./Marketplace.css";
import NFTCard from '../../Layout/NftCard';
import Spinner from "../../Layout/Spinner";


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

  //event Listener that handles the event "page loaded" and makes loading circle disappear
  document.addEventListener("pageLoaded", (event) => {
    document.querySelector('.loadingSpinner').style.display = 'none';
});

  return (
    <div style={{ alignItems: "left", padding: "1rem 3rem 1rem 3rem" }} >
      <div >
        <h2 style={{ color: "#131313", textAlign: "left", marginBottom: 0 }}>Marketplace</h2>
        <h4 style={{ color: "#BABABA", fontWeight: 600 }}>{`Items on sale: ${collection.length}`}</h4>
      </div>
      <div className='container-fluid' style={{ marginTop: "2rem" }}>
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
      <div className="loadingSpinner" >
        <Spinner></Spinner>
        </div>
    </div>
  );
};


export default Marketplace;
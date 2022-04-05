import './Profile_style.css'; //tell this .js to use the Stylessheet
import React, { useContext, useRef, createRef } from 'react';

import { useSearchParams } from 'react-router-dom';

import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import { formatPrice } from '../../../helpers/utils';
import eth from '../../../img/ethereum.svg';
import NFTCard from '../../Layout/NftCard';

const Collection = () => {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  const marketplaceCtx = useContext(MarketplaceContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const owner = searchParams.get("owner");
  console.log(collectionCtx.collection.length);

  const collection = collectionCtx.collection.filter(function (element) {
    console.log("element.owner: " + element.owner);
    console.log("owner: " + owner);
    return element.owner === owner;
  });



  const priceRefs = useRef([]);
  if (priceRefs.current.length !== collection.length) {
    priceRefs.current = Array(collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
  }



  const makeOfferHandler = (price, id) => {
    const enteredPrice = web3.utils.toWei(price, 'ether');

    collectionCtx.contract.methods.approve(marketplaceCtx.contract.options.address, id).send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
      })
      .on('receipt', (receipt) => {
        marketplaceCtx.contract.methods.makeOffer(id, enteredPrice).send({ from: web3Ctx.account })
          .on('error', (error) => {
            window.alert('Something went wrong when pushing to the blockchain');
            marketplaceCtx.setMktIsLoading(false);
          });
      });
  };



  const cancelHandler = (event) => {
    const cancelIndex = parseInt(event.target.value);
    marketplaceCtx.contract.methods.cancelOffer(marketplaceCtx.offers[cancelIndex].offerId).send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        marketplaceCtx.setMktIsLoading(false);
      });
  };

  const showHandles = owner === web3Ctx.account;
  console.log(showHandles);
  return (
    <div>
      <div style={{ alignItems: "center", padding: "1rem 3rem 1rem 3rem" }} >
        <h2 style={{ color: "#131313" }}>
          Collection
        </h2>
        <div className='container-fluid' >
          <div className="row gy-4" >

            {collection.map((NFT, key) => {
              return (
                // TODO: make offer go through
                <NFTCard NFT={NFT} key={key} index={NFT.id} makeOfferHandler={makeOfferHandler}></NFTCard>
              );

              // TODO: show NFTs on sale from this person 
            })}


          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
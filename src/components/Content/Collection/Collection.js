import './Profile_style.css'; //tell this .js to use the Stylessheet
import React, { useContext, useRef, createRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Spinner from "../../Layout/Spinner";
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

  if(document.querySelector('.loadingSpinner')){
    document.querySelector('.loadingSpinner').style.display = 'flex';
    }

  const collection = collectionCtx.collection.filter(function (element) {
    document.querySelector('.loadingSpinner').style.display = 'none';
    return element.owner === owner;
  });



  const priceRefs = useRef([]);
  if (priceRefs.current.length !== collection.length) {
    priceRefs.current = Array(collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
  }


  const makeOfferHandler = (price, id) => {
    document.querySelector('.loadingSpinner').style.display = 'flex';
    const enteredPrice = web3.utils.toWei(price, 'ether');

    collectionCtx.contract.methods.approve(marketplaceCtx.contract.options.address, id).send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
        document.querySelector('.loadingSpinner').style.display = 'flex';
      })
      .on('receipt', (receipt) => {
        marketplaceCtx.contract.methods.makeOffer(id, enteredPrice).send({ from: web3Ctx.account })
        .on('transactionHash', (hash) => {
          document.querySelector('.loadingSpinner').style.display = 'none';
          window.location.reload();
        })
          .on('error', (error) => {
            window.alert('Something went wrong when pushing to the blockchain');
            marketplaceCtx.setMktIsLoading(false);
            document.querySelector('.loadingSpinner').style.display = 'none';

          });
          
      });
  };

  const makeAuctionHandler = (startingPrice, id) => {
    //additional feature in the future
    //const enteredPrice = web3.utils.toWei(startingPrice, 'ether');
    document.querySelector('.loadingSpinner').style.display = 'flex';
    collectionCtx.contract.methods.approve(marketplaceCtx.contract.options.address, id).send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
        document.querySelector('.loadingSpinner').style.display = 'flex';
      })
      .on('receipt', (receipt) => {
        marketplaceCtx.contract.methods.makeAuction(id).send({ from: web3Ctx.account })
          .on('error', (error) => {
            window.alert('Something went wrong when pushing to the blockchain');
            marketplaceCtx.setMktIsLoading(false);
            document.querySelector('.loadingSpinner').style.display = 'none';

          });
      });
  };

  //event Listener that handles the event "page loaded" and makes loading circle disappear
  // document.addEventListener("pageLoaded", (event) => {
  //   document.querySelector('.loadingSpinner').style.display = 'none';
  // });

  const userIsOwner = owner === web3Ctx.account;
  console.log(userIsOwner);
  return (

    <div style={{ textAlign: "left", padding: "1rem 3rem 1rem 3rem" }} >
      <div >
        <h2 style={{ color: "#131313", textAlign: "left", marginBottom: 0 }}>{userIsOwner ? "My Collection" : `Collection of ${owner}`}</h2>
        <h4 style={{ color: "#BABABA", fontWeight: 600 }}>{`Items owned: ${collection.length}`}</h4>
      </div>
      <div className='container-fluid' style={{ marginTop: "2rem" }}>
        <div className="row gy-4" >
          {collection.map((NFT, key) => {
            return (
              // TODO: make offer go through
              <NFTCard NFT={NFT} key={key} index={NFT.id} makeOfferHandler={makeOfferHandler} makeAuctionHandler={makeAuctionHandler}userIsOwner={userIsOwner} ></NFTCard>
            );

            // TODO: show NFTs on sale from this person 
          })}
        </div>
      </div>
        <div className="loadingSpinner" >
        <Spinner></Spinner>
        </div>
    </div>

  );
};

export default Collection;
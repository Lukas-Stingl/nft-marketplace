import React, { useContext, useRef, createRef } from 'react';
import web3 from '../../../connection/web3';
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

  const bidHandler = (price, index, id) => {
    //do we first have to set up an button to make a bid - because right now we don´t have the amount of the bid
    const enteredPrice = web3.utils.toWei(price, 'ether');
    // collectionCtx.contract.methods.approve(marketplaceCtx.contract.options.address, id).send({ from: web3Ctx.account })
    // .on('transactionHash', (hash) => {
    //   marketplaceCtx.setMktIsLoading(true);
    // })
    // .on('receipt', (receipt) => {
    marketplaceCtx.contract.methods.fillBid(marketplaceCtx.auctions[index].auctionId/*, enteredPrice*/).send({ from: web3Ctx.account, value: enteredPrice })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        marketplaceCtx.setMktIsLoading(false);
      });
    // });
  
  };
  const cancelHandler = (index) => {
    document.querySelector('.loadingSpinner').style.display = 'flex';
    marketplaceCtx.contract.methods.cancelOffer(marketplaceCtx.offers[index].offerId).send({ from: web3Ctx.account })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
        document.querySelector('.loadingSpinner').style.display = 'none';
        window.location.reload();
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        marketplaceCtx.setMktIsLoading(false);
        document.querySelector('.loadingSpinner').style.display = 'none';
      });
  };

  const endAuction = async(index) => {
    document.querySelector('.loadingSpinner').style.display = 'flex';
    const response = await marketplaceCtx.contract.methods.end(marketplaceCtx.auctions[index].auctionId).send({from: web3Ctx.account  })
    console.log(JSON.stringify(response))
    document.querySelector('.loadingSpinner').style.display = 'none';
  }

  const collection = collectionCtx.collection.filter(
    e => marketplaceCtx.auctions.findIndex(
      auction => (auction.nftId === e.id && auction.isActive === true
            )) !== -1 || marketplaceCtx.offers.findIndex(
              offer => (offer.id === e.id )) !== -1);


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
      <div className="loadingSpinner" style={{ display: "flex", justifyContent: "center" }} >
        <Spinner></Spinner>
        </div>
      <div className='container-fluid' style={{ marginTop: "2rem" }}>
        <div className="row gy-4" >
          {collection.map((NFT, key) => {
            //assumption: we first look if Marketplace offering is an auction, if it is, proceed, if it is not skip to else
            var index = marketplaceCtx.auctions.findLastIndex(auction => auction.nftId === NFT.id && auction.isActive === true);
            var owner;
            var price;
            var endedAt;
            var highestBidder;
            var auctionExpired;
            var isAuction;
            var winner;
            var isWinner;
            var isUserTheOwner;
            if(marketplaceCtx.auctions[index]){
            index = marketplaceCtx.auctions.findLastIndex(auction => auction.nftId === NFT.id && auction.isActive === true) ;
            owner = marketplaceCtx.auctions[index].seller;
            price = marketplaceCtx.auctions[index].highestBid / 1000000000000000000;
            endedAt = marketplaceCtx.auctions[index].endedAt;
            highestBidder = marketplaceCtx.auctions[index].highestBidder;
            auctionExpired =  new Date(parseInt(endedAt+"000")) - new Date().getTime() < 0;
            isAuction =  marketplaceCtx.auctions[index] !== null
            isUserTheOwner = (owner === web3Ctx.account);
            if(price === 0) {
              winner = marketplaceCtx.auctions[index].seller
            }
            else {
              winner = highestBidder
            }
            isWinner = winner === web3Ctx.account && auctionExpired;
          }
          else{
            index = marketplaceCtx.offers.findLastIndex(offer => offer.id === NFT.id);
            price = marketplaceCtx.offers[index].price / 1000000000000000000;
             owner = owner = marketplaceCtx.offers[index].user;;
             endedAt = 0;
             highestBidder = 0;
             auctionExpired =  0;
             isAuction =  false
             isUserTheOwner = (owner == web3Ctx.account);
          }
            return (
              <NFTCard NFT={NFT} key={key} index={index} price={price} owner={owner} buyHandler={buyHandler} cancelHandler={cancelHandler} bidHandler={bidHandler} endedAt={endedAt} endAuction={endAuction} isWinner={isWinner} auctionExpired={auctionExpired} isAuction={isAuction} isUserTheOwner={isUserTheOwner}></NFTCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};


export default Marketplace;
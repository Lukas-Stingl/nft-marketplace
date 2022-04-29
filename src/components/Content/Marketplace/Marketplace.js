import React, { useContext, useRef, createRef } from 'react';
import web3 from '../../../connection/web3';
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

  const endAuction = async(index) => {
    const response = await marketplaceCtx.contract.methods.end(marketplaceCtx.auctions[index].auctionId).send({from: web3Ctx.account  })
    console.log(JSON.stringify(response))
  }

  const collection = collectionCtx.collection.filter(
    e => marketplaceCtx.auctions.findIndex(
      auction => (auction.nftId === e.id && auction.isActive === true
            )) !== -1);



  return (
    <div style={{ alignItems: "left", padding: "1rem 3rem 1rem 3rem" }} >
      <div >
        <h2 style={{ color: "#131313", textAlign: "left", marginBottom: 0 }}>Marketplace</h2>
        <h4 style={{ color: "#BABABA", fontWeight: 600 }}>{`Items on sale: ${collection.length}`}</h4>
      </div>
      <div className='container-fluid' style={{ marginTop: "2rem" }}>
        <div className="row gy-4" >
          {collection.map((NFT, key) => {
            //find most recent nft → this is why array is reversed 
            const index = marketplaceCtx.auctions.reverse().findIndex(auction => auction.nftId === NFT.id);
            const owner = marketplaceCtx.auctions[index].seller;
            const price = marketplaceCtx.auctions[index].highestBid;
            const endedAt = marketplaceCtx.auctions[index].endedAt;
            const highestBidder = marketplaceCtx.auctions[index].highestBidder;
            let auctionExpired =  new Date(parseInt(endedAt+"000")) - new Date().getTime() < 0;
            const isAuction =  marketplaceCtx.auctions[index] !== null
            if(price === 0) {
              var winner = marketplaceCtx.auctions[index].seller
            }
            else {
              var winner = highestBidder
            }
            const isWinner = winner === web3Ctx.account && auctionExpired;

            return (
              <NFTCard NFT={NFT} key={key} index={index} price={price} owner={owner} buyHandler={buyHandler} bidHandler={bidHandler} endedAt={endedAt} endAuction={endAuction} isWinner={isWinner} auctionExpired={auctionExpired} isAuction={isAuction}></NFTCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};


export default Marketplace;
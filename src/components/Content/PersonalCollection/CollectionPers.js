import './Collection_styles.css'; //tell this .js to use the Stylessheet
import eth from '../../../img/ethereum.svg';
import React, { useContext, useRef, createRef } from 'react';

import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import { formatPrice } from '../../../helpers/utils';



class CollectionPers extends React.Component {

      constructor(props) {
            super(props);

            this.buyHandler = this.buyHandler.bind(this);
            this.cancelHandler = this.cancelHandler.bind(this);
            this.makeOfferHandler = this.makeOfferHandler.bind(this);
      }


      makeOfferHandler(event, id, key) {
            event.preventDefault();
            const collectionCtx = useContext(CollectionContext);

            const priceRefs = useRef([]);
            if (priceRefs.current.length !== collectionCtx.collection.length) {
                  priceRefs.current = Array(collectionCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
            }
            const enteredPrice = web3.utils.toWei(priceRefs.current[key].current.value, 'ether');
            const marketplaceCtx = useContext(MarketplaceContext);
            const web3Ctx = useContext(Web3Context);

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

      buyHandler(event) {
            const buyIndex = parseInt(event.target.value);
            const marketplaceCtx = useContext(MarketplaceContext);
            const web3Ctx = useContext(Web3Context);

            marketplaceCtx.contract.methods.fillOffer(marketplaceCtx.offers[buyIndex].offerId).send({ from: web3Ctx.account, value: marketplaceCtx.offers[buyIndex].price })
                  .on('transactionHash', (hash) => {
                        marketplaceCtx.setMktIsLoading(true);
                  })
                  .on('error', (error) => {
                        window.alert('Something went wrong when pushing to the blockchain');
                        marketplaceCtx.setMktIsLoading(false);
                  });
      };

      cancelHandler(event) {
            const cancelIndex = parseInt(event.target.value);
            const marketplaceCtx = useContext(MarketplaceContext);
            const web3Ctx = useContext(Web3Context);

            marketplaceCtx.contract.methods.cancelOffer(marketplaceCtx.offers[cancelIndex].offerId).send({ from: web3Ctx.account })
                  .on('transactionHash', (hash) => {
                        marketplaceCtx.setMktIsLoading(true);
                  })
                  .on('error', (error) => {
                        window.alert('Something went wrong when pushing to the blockchain');
                        marketplaceCtx.setMktIsLoading(false);
                  });
      };


      render() {
            const collectionCtx = useContext(CollectionContext);
            const priceRefs = useRef([]);
            if (priceRefs.current.length !== collectionCtx.collection.length) {
                  priceRefs.current = Array(collectionCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
            }
            const marketplaceCtx = useContext(MarketplaceContext);
            const web3Ctx = useContext(Web3Context);
            return (
                  <div className="row text-center">
                        {collectionCtx.collection.map((NFT, key) => {
                              const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id) : -1;
                              const owner = index === -1 ? NFT.owner : marketplaceCtx.offers[index].user;
                              const price = index !== -1 ? formatPrice(marketplaceCtx.offers[index].price).toFixed(2) : null;

                              return (
                                    <div key={key} className="col-md-2 m-3 pb-3 card border-info">
                                          <div className={"card-body"}>
                                                <h5 className="card-title">{NFT.title}</h5>
                                          </div>
                                          <img src={`https://ipfs.infura.io/ipfs/${NFT.img}`} className="card-img-bottom" alt={`NFT ${key}`} />
                                          <p className="fw-light fs-6">{`${owner.substr(0, 7)}...${owner.substr(owner.length - 7)}`}</p>
                                          {index !== -1 ?
                                                owner !== web3Ctx.account ?
                                                      <div className="row">
                                                            <div className="d-grid gap-2 col-5 mx-auto">
                                                                  <button onClick={this.buyHandler} value={index} className="btn btn-success">BUY</button>
                                                            </div>
                                                            <div className="col-7 d-flex justify-content-end">
                                                                  <img src={eth} width="25" height="25" className="align-center float-start" alt="price icon"></img>
                                                                  <p className="text-start"><b>{`${price}`}</b></p>
                                                            </div>
                                                      </div> :
                                                      <div className="row">
                                                            <div className="d-grid gap-2 col-5 mx-auto">
                                                                  <button onClick={this.cancelHandler} value={index} className="btn btn-danger">CANCEL</button>
                                                            </div>
                                                            <div className="col-7 d-flex justify-content-end">
                                                                  <img src={eth} width="25" height="25" className="align-center float-start" alt="price icon"></img>
                                                                  <p className="text-start"><b>{`${price}`}</b></p>
                                                            </div>
                                                      </div> :
                                                owner === web3Ctx.account ?
                                                      <form className="row g-2" onSubmit={(e) => this.makeOfferHandler(e, NFT.id, key)}>
                                                            <div className="col-5 d-grid gap-2">
                                                                  <button type="submit" className="btn btn-secondary">OFFER</button>
                                                            </div>
                                                            <div className="col-7">
                                                                  <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        placeholder="ETH..."
                                                                        className="form-control"
                                                                        ref={priceRefs.current[key]}
                                                                  />
                                                            </div>
                                                      </form> :
                                                      <p><br /></p>}
                                    </div>
                              );
                        })}
                  </div>
            );
      }
      // return (
      //       <html>
      //             <head>
      //             </head>
      //             <style>
      //             </style>
      //             <body>
      //                   <section class="heading">
      //                         <h2 align="center">
      //                               NFT Collection
      //                         </h2>
      //                         <p align="center">
      //                               Explore the World of NFTs
      //                         </p>
      //                   </section>
      //                   <section class="boxes">
      //                         <div class="boxes-items one">
      //                               <div class="nft">
      //                                     <i class="fa fa-4x fa-laptop">&nbsp;</i>
      //                                     <img src={eth} width="100" height="100" class="center" alt="NFT"></img>
      //                               </div>
      //                               <p class="name">Cat</p>
      //                               <p class="price"> 1 ETH </p>
      //                         </div>
      //                         <div class="boxes-items two">
      //                               <i class="fa fa-4x fa-cog">&nbsp;</i>
      //                               <h2> NFT #2</h2>
      //                               <p class="name">Human</p>
      //                         </div>
      //                         <div class="boxes-items three">
      //                               <i class="fa fa-4x fa-cog">&nbsp;</i>
      //                               <h2>NFT #3</h2>
      //                               <p class="name">Dog</p>
      //                         </div>
      //                         <div class="boxes-items four">
      //                               <i class="fa fa-4x fa-cog">&nbsp;</i>
      //                               <h2>NFT #4</h2>
      //                               <p class="name">Rabbit</p>
      //                         </div>
      //                         <div class="boxes-items five">
      //                               <i class="fa fa-4x fa-cog">&nbsp;</i>
      //                               <h2>NFT #5</h2>
      //                               <p class="name">Horse</p>
      //                         </div>
      //                         <div class="boxes-items six">
      //                               <i class="fa fa-4x fa-cog">&nbsp;</i>
      //                               <h2>NFT #6</h2>
      //                               <p class="name">Horse</p>
      //                         </div>
      //                         <div class="boxes-items seven">
      //                               <i class="fa fa-4x fa-cog">&nbsp;</i>
      //                               <h2>NFT #7</h2>
      //                               <p class="name">Horse</p>
      //                         </div>
      //                         <div class="boxes-items eight">
      //                               <i class="fa fa-4x fa-cog">&nbsp;</i>
      //                               <h2>NFT #8</h2>
      //                               <p class="name">Horse</p>
      //                         </div>
      //                         <div class="boxes-items nine">
      //                               <i class="fa fa-4x fa-cog">&nbsp;</i>
      //                               <h2>NFT #9</h2>
      //                               <p class="name">Horse</p>
      //                         </div>
      //                   </section>
      //             </body>
      //       </html>
      // );

}

export default CollectionPers;

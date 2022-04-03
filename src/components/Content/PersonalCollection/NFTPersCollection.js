import './Profile_style.css'; //tell this .js to use the Stylessheet
import React, { useContext, useRef, createRef } from 'react';

import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import { formatPrice } from '../../../helpers/utils';
import eth from '../../../img/ethereum.svg';

const NFTPersCollectionPage = () => {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  const marketplaceCtx = useContext(MarketplaceContext);

  const priceRefs = useRef([]);
  if (priceRefs.current.length !== collectionCtx.collection.length) {
    priceRefs.current = Array(collectionCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
  }

  
  const makeOfferHandler = (event, id, key) => {
    event.preventDefault();

    const enteredPrice = web3.utils.toWei(priceRefs.current[key].current.value, 'ether');

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

  const buyHandler = (event) => {
    const buyIndex = parseInt(event.target.value);
    marketplaceCtx.contract.methods.fillOffer(marketplaceCtx.offers[buyIndex].offerId).send({ from: web3Ctx.account, value: marketplaceCtx.offers[buyIndex].price })
      .on('transactionHash', (hash) => {
        marketplaceCtx.setMktIsLoading(true);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        marketplaceCtx.setMktIsLoading(false);
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

  function countItems(collection) {
    var count = 0;
    for (const element of collection){
        console.log(count)
        if (element.owner === web3Ctx.account){
            count = count + 1
        }       
    }
    return count
  }

  return (
   <>
    
    <section class="heading">

    </section>

        <section class="profile">
 

        <section class="header">
            <div class="details">
            <img src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=b38c22a46932485790a3f52c61fcbe5a" alt="John Doe" class="profile-pic"/>
            <h1 class="heading">{web3Ctx.account}</h1>
            <div class="stats">
                <div class="col-4"> 
                              
                <h4>{countItems(collectionCtx.collection)}</h4>
                <p>Owned Currently</p>
                </div>
                <div class="col-4">
                <h4>10</h4>
                <p>Bought</p>
                </div>
                <div class="col-4">
                <h4>100</h4>
                <p>Total</p>
                </div>
            </div>
            </div>
            </section>
        </section>
    
    <div className="row text-center">
       
      {collectionCtx.collection.map((NFT, key) => {
        const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id) : -1;
        const owner = index === -1 ? NFT.owner : marketplaceCtx.offers[index].user;
        const price = index !== -1 ? formatPrice(marketplaceCtx.offers[index].price).toFixed(2) : null;
        if(owner === web3Ctx.account)
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
                    <button onClick={buyHandler} value={index} className="btn btn-success">BUY</button>
                  </div>
                  <div className="col-7 d-flex justify-content-end">
                    <img src={eth} width="25" height="25" className="align-center float-start" alt="price icon"></img>
                    <p className="text-start"><b>{`${price}`}</b></p>
                  </div>
                </div> :
                <div className="row">
                  <div className="d-grid gap-2 col-5 mx-auto">
                    <button onClick={cancelHandler} value={index} className="btn btn-danger">CANCEL</button>
                  </div>
                  <div className="col-7 d-flex justify-content-end">
                    <img src={eth} width="25" height="25" className="align-center float-start" alt="price icon"></img>
                    <p className="text-start"><b>{`${price}`}</b></p>
                  </div>
                </div> :
              owner === web3Ctx.account ?
                <form className="row g-2" onSubmit={(e) => makeOfferHandler(e, NFT.id, key)}>
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
    </>
  );
};

export default NFTPersCollectionPage;
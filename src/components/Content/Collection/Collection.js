import './Profile_style.css'; //tell this .js to use the Stylessheet
import React, { useContext, useRef, createRef } from 'react';

import { useSearchParams } from 'react-router-dom';

import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import { formatPrice } from '../../../helpers/utils';
import eth from '../../../img/ethereum.svg';

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



  return (
    <html>
      <section class="profile">
        <header class="header">
          <div class="details">
            <img src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=b38c22a46932485790a3f52c61fcbe5a" alt="John Doe" class="profile-pic" />
            <h1 class="heading">{web3Ctx.account}</h1>
            <div class="stats">
              <div class="col-4">

                <h4>{collection.length}</h4>
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
        </header>
      </section>
      <div className="row text-center">

        {collection.map((NFT, key) => {
          return (
            <div key={key} className="col-md-2 m-3 pb-3 card border-info">
              <div className={"card-body"}>
                <h5 className="card-title">{NFT.title}</h5>
              </div>
              <img src={`https://ipfs.infura.io/ipfs/${NFT.img}`} className="card-img-bottom" alt={`NFT ${key}`} />
              <p className="fw-light fs-6">{`${owner}`}</p>



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
              </form>
              <p><br /></p>
            </div>
          );
        })}
      </div>
    </html>
  );
};

export default Collection;
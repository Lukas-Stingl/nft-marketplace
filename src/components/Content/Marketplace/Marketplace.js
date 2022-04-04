import React, { useContext, useRef, createRef } from 'react';
import Card from 'react-bootstrap/Card';
import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import { formatPrice } from '../../../helpers/utils';
import eth from '../../../img/ethereum.svg';
import "./Marketplace.css";

const Marketplace = () => {
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

  return (
    //Creating the layout of the ./collection page
    <div style={{ alignItems: "center" }} >
      <h2 align="center">
        NFT Collection
      </h2>
      <h3 align="center">
        Explore the World of NFTs
      </h3>
      <div className='container-fluid' >
        <div className="row gy-4" >
          {collectionCtx.collection.map((NFT, key) => {
            const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id) : -1;
            const owner = index === -1 ? NFT.owner : marketplaceCtx.offers[index].user;
            const price = index !== -1 ? formatPrice(marketplaceCtx.offers[index].price).toFixed(2) : null;

            return (
              <div className="col-sm-4 col-md-3 col-lg-3 col-xl-2">

                <div onClick={() => { console.log("clicked!"); }} style={{}}>
                  <Card key={key} style={{ overflow: "hidden", cursor: 'pointer' }} >
                    <div style={{
                      height: "20rem", display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden"
                    }}>
                      <Card.Img variant="top" src={`https://ipfs.infura.io/ipfs/${NFT.img}`} style={{
                        objectFit: "cover",
                        minWidth: "100%",
                        minHeight: "100%"
                      }} />
                    </div>
                    <Card.Body>
                      <Card.Title>{NFT.title}</Card.Title>
                      <p style={{ whiteSpace: "nowrap", color: "#BABABA", fontWeight: 600, fontSize: "0.8em" }}>by <a href={`/collection?owner=${owner}`} className="link" style={{}}>{`${owner}`}</a></p>
                      <div style={{
                        display: "flex", flexWrap: "nowrap", justifyContent: "space-between"
                      }}>
                        <p>{`${price}`}</p>
                        <button class="bbtn bbtn-2 hover-slide-right">
                          <span>buy now</span>
                        </button>
                      </div>
                      {/* {index !== -1 ?
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
                          ref={priceRefs.current[key]} />
                      </div>
                    </form> :
                    <p><br /></p>} */}
                    </Card.Body>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
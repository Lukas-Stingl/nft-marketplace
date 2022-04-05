import React, { useContext, useRef, createRef, useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import MarketplaceContext from '../../../store/marketplace-context';
import { formatPrice, useToggle } from '../../../helpers/utils';
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

const NFTCard = ({ NFT, owner, price, index, buyHandler }) => {
  const [hovered, setHovered] = useToggle(false);

  return (
    <div className="col-sm-4 col-md-4 col-lg-3 col-xl-2">
      <div onClick={() => { console.log("clicked!"); }} style={{}}>
        <Card className="cl-card" style={{ overflow: "hidden", cursor: 'pointer' }} onMouseEnter={setHovered} onMouseLeave={setHovered} >
          <div style={{
            height: "20rem", display: "flex",
            justifyContent: "center",

            overflow: "hidden",
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
            <div style={{ display: "flex", justifyContent: "space-between", alignContent: "center" }}>
              <div style={{ display: "flex" }}><img alt="Ethereum Logo" src={eth} style={{ height: "1.5em" }}></img><p>{`${price}`}</p></div>
              {hovered && <button className="bbtn bbtn-2 hover-slide-right" onClick={() => buyHandler(index)}>
                <span>buy now</span>
              </button>}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}


export default Marketplace;
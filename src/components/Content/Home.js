import "./Home.css";
import React, { useContext, useRef, createRef } from 'react';
import Card from 'react-bootstrap/Card';
import web3 from '../../connection/web3';
import Web3Context from '../../store/web3-context';
import CollectionContext from '../../store/collection-context';
import MarketplaceContext from '../../store/marketplace-context';
import { formatPrice } from '../../helpers/utils';



function Home() {
    const web3Ctx = useContext(Web3Context);
    const collectionCtx = useContext(CollectionContext);
    const marketplaceCtx = useContext(MarketplaceContext);

    //Creating the Layout of the "Home" Page
    return (
        <div>
            <div class="Buttons" align="center">
                <h1>Welcome to the world of NFTs! </h1>
                <h2>Discover, collect, and sell extraordinary NFTs.</h2>
                <a href="../marketplace" >
                    <button class="Discover">Discover </button>
                </a>
                <div class="divider" />
                <a href="../create">
                    <button type="button" class="Create">Create NFTs</button>
                </a>
            </div>
            <div class="divider" />
            <div className='container-fluid' >
                <div className="row " style={{ justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden"}}  >
                    <h3>Latest Drops</h3>
                    <div class="divider" />
                    {collectionCtx.collection.map((NFT, key) => {
                        var maxNFTId = collectionCtx.collection.length;
                        const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id) : -1;
                        const owner = index === -1 ? NFT.owner : marketplaceCtx.offers[index].user;
                        const price = index !== -1 ? formatPrice(marketplaceCtx.offers[index].price).toFixed(2) : null;
                        
                        if (NFT.id == maxNFTId || NFT.id == maxNFTId -1 || NFT.id == maxNFTId -2 ) return (
                            <div className="col-sm-4 col-md-3 col-lg-3 col-xl-2">
                                <div onClick={() => { console.log("clicked!"); } } style={{}}>
                                    <Card key={key} style={{ overflow: "hidden", cursor: 'pointer' }}>
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

                                            </div>

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
}

export default Home;


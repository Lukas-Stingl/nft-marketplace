import React, { useState } from 'react';
import { useToggle } from '../../helpers/utils';
import Card from 'react-bootstrap/Card';
import eth from '../../img/ethereum.svg';
import './NFTCard.css';


const NFTCard = ({ NFT, price, index, buyHandler, cancelHandler, makeOfferHandler, userIsOwner }) => {
    const [hovered, setHovered] = useToggle(false);
    const [offerPrice, setOfferPrice] = useState(0.001);

    return (
        <div className="col-sm-4 col-md-4 col-lg-3 col-xl-2">
            <div onClick={() => { window.location.replace(`../details?value=${NFT.id}`) }} style={{}}>
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
                        {NFT.owner && <p style={{ whiteSpace: "nowrap", color: "#BABABA", fontWeight: 600, fontSize: "0.8em" }}>by <a href={`/collection?owner=${NFT.owner}`} className="link" style={{}}>{`${NFT.owner}`}</a></p>}
                        <div style={{ display: "flex", justifyContent: "space-between", alignContent: "center" }}>
                            {buyHandler && <div style={{ display: "flex" }}><img alt="Ethereum Logo" src={eth} style={{ height: "1.5em" }}></img><p>{` ${price}`}</p></div>}
                            {hovered && userIsOwner && makeOfferHandler && <input type="number" min="0" max="1000" step="0.001" value={offerPrice} onChange={e => {
                                e.preventDefault();
                                setOfferPrice(e.target.value);
                            }} onClick={e => { e.stopPropagation(); }}></input>}
                            {hovered && buyHandler && <button className="bbtn bbtn-2 hover-slide-right" onClick={() => buyHandler(index)}>
                                <span>buy now</span>
                            </button>}
                            {hovered && userIsOwner && cancelHandler && <button className="bbtn bbtn-2 hover-slide-right" onClick={() => cancelHandler(index)}>
                                <span>cancel</span>
                            </button>}
                            {hovered && userIsOwner && makeOfferHandler && <button className="bbtn bbtn-2 hover-slide-right" onClick={(e) => {
                                e.stopPropagation();

                                makeOfferHandler(offerPrice, index)
                            }}>
                                <span>offer</span>
                            </button>}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default NFTCard;
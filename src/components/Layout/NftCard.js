import React from 'react';
import { useToggle } from '../../helpers/utils';
import Card from 'react-bootstrap/Card';
import eth from '../../img/ethereum.svg';
import './NFTCard.css';


const NFTCard = ({ NFT, owner, price, index, buyHandler, cancelHandler, makeOfferHandler }) => {
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
                        {owner && <p style={{ whiteSpace: "nowrap", color: "#BABABA", fontWeight: 600, fontSize: "0.8em" }}>by <a href={`/collection?owner=${owner}`} className="link" style={{}}>{`${owner}`}</a></p>}
                        <div style={{ display: "flex", justifyContent: "space-between", alignContent: "center" }}>
                            {buyHandler && <div style={{ display: "flex" }}><img alt="Ethereum Logo" src={eth} style={{ height: "1.5em" }}></img><p>{`${price}`}</p></div>}
                            {hovered && makeOfferHandler && <input type="number" min="0" max="1000" ></input>}
                            {hovered && buyHandler && <button className="bbtn bbtn-2 hover-slide-right" onClick={() => buyHandler(index)}>
                                <span>buy now</span>
                            </button>}
                            {hovered && cancelHandler && <button className="bbtn bbtn-2 hover-slide-right" onClick={() => cancelHandler(index)}>
                                <span>cancel</span>
                            </button>}
                            {hovered && makeOfferHandler && <button className="bbtn bbtn-2 hover-slide-right" onClick={() => makeOfferHandler(index)}>
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
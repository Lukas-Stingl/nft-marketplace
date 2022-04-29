import React, { useState } from 'react';
import { useToggle } from '../../helpers/utils';
import Card from 'react-bootstrap/Card';
import eth from '../../img/ethereum.svg';
import './NFTCard.css';


const NFTCard = ({ NFT, price, owner, index, buyHandler, cancelHandler, makeOfferHandler, bidHandler, makeAuctionHandler, userIsOwner, endedAt, endAuction, isWinner, auctionExpired, isAuction, isUserTheOwner }) => {
    const [hovered, setHovered] = useToggle(false);
    const [offerPrice, setOfferPrice] = useState("0.001");
    const [bidPrice, setBidPrice] = useState("0.001");

    // Update the count down every 1 second
    var x = setInterval(function () {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = new Date(parseInt(endedAt + "000")) - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        if (document.getElementById(NFT.title)) {
            document.getElementById(NFT.title).innerHTML = days + "d " + hours + "h "
                + minutes + "m " + seconds + "s ";
        }
        // If the count down is over, write some text 
        if (distance < 0) {
            clearInterval(x);
            if (document.getElementById(NFT.title)) {
            document.getElementById(NFT.title).innerHTML = "EXPIRED";
            }
        }
        const selectElement = document.querySelector(NFT.title);
        window.onload=function(){
            selectElement.addEventListener('change', (event) => {
                const result = document.querySelector(NFT.title);
                result.textContent = `You like ${event.target.value}`;
            });
          }
        
    }, 1000);

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
                        {owner && <p style={{ whiteSpace: "nowrap", color: "#BABABA", fontWeight: 600, fontSize: "0.8em" }}>by <a href={`/collection?owner=${owner}`} className="link">{`${owner}`}</a></p>}
                        {isAuction && <div><p id={NFT.title} >Verbleibende Dauer</p></div>}
                        {!isAuction && <div style={{minHeight: "1.5em", marginBottom: "15px"}}><p> </p></div>}
                        <div style={{ display: "flex", justifyContent: "space-between", alignContent: "center" }}>
                            {!isAuction && buyHandler && <div style={{ display: "flex" }}><img alt="Ethereum Logo" src={eth} style={{ height: "1.4em", marginRight: "0.3em" }}></img><p>{` ${price}`}</p></div>}
                            {isAuction && <div style={{ display: "flex" }}><p>Highest Bid:</p> <img alt="Ethereum Logo" src={eth} style={{ height: "1.4em", marginRight: "0.3em", marginLeft: "0.5em"  }}></img> <p>{` ${price}`}</p></div>}
                            {isUserTheOwner && makeOfferHandler && <div style={{ display: "flex" }}><img alt="Ethereum Logo" src={eth} style={{ height: "2.5em", marginRight: "0.6em", paddingTop: "0.5rem", paddingBottom: "0.5rem"}}></img><input type="number" min="0" max="1000" step="0.001" value={offerPrice} onChange={e => {
                                setOfferPrice(e.target.value);
                            }} onClick={e => { e.stopPropagation(); }}></input></div>}
                            {isUserTheOwner && !isWinner && makeAuctionHandler && <div style={{ display: "flex" }}></div>}
                            {cancelHandler && <button className="bbtn hover-slide-right" onClick={() => cancelHandler(index)}>
                                <span>cancel</span>
                            </button>}
                            {!isUserTheOwner && !isAuction && buyHandler && <button className="bbtn hover-slide-right" onClick={(e) => {
                                e.stopPropagation();
                                buyHandler(index);
                            }}>
                                <span>buy now</span>
                            </button>}
                            
                            {isUserTheOwner && makeOfferHandler && <button className="bbtn hover-slide-right" onClick={(e) => {
                                e.stopPropagation();

                                makeOfferHandler(offerPrice, index)
                            }}>
                                <span>offer</span>
                            </button>}

                            {isAuction && !auctionExpired && !isUserTheOwner && bidHandler && <input type="number" min="0" max="1000" step="0.001" value={bidPrice} onChange={e => {
                                e.preventDefault();
                                setBidPrice(e.target.value);

                            }} onClick={e => { e.stopPropagation(); }}></input>}
                            {isAuction && !auctionExpired && !isWinner && <button className="bbtn hover-slide-right" onClick={(e) => {
                                e.stopPropagation();
                                bidHandler(bidPrice, index, NFT.id);
                            }}>
                                <span>bid</span>
                            </button>}

                            {isWinner && <button className="bbtn hover-slide-right" onClick={(e) => {
                                e.stopPropagation();
                                endAuction(index)
                            }}>
                                <span>Redeem NFT</span>
                            </button>}
                            {!isAuction && isUserTheOwner && cancelHandler && <button className="bbtn hover-slide-right" onClick={() => cancelHandler(index)}>
                                <span>cancel</span>
                            </button>}
                            {isUserTheOwner && !isWinner && makeAuctionHandler && <button className="bbtn hover-slide-right" onClick={(e) => {
                                e.stopPropagation();
                                makeAuctionHandler(offerPrice, index)
                            }}>
                                <span>auction</span>
                            </button>}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}

export default NFTCard;
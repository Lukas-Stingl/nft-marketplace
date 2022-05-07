import "./Home.css";
import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import CollectionContext from '../../store/collection-context';
import wallet from '../../img/wallet.svg';
import collection from '../../img/collection.svg';
import nft from '../../img/select-image.svg';
import sale from '../../img/sale.svg';
import logo from '../../img/logo.jpg';
import Canvas from "../Layout/Canvas";
import Spinner from "../Layout/Spinner";




function Home() {
    const collectionCtx = useContext(CollectionContext);
    
    //event Listener that handles the event "page loaded" and makes loading circle disappear
    document.addEventListener("pageLoaded", (event) => {
        document.querySelector('.loadingSpinner').style.display = 'none';
    });

    const latestDrops = collectionCtx.collection.slice(0, 3);
    //Creating the Layout of the "Home" Page
    return (
        <div className="home">
            <div className="top-content">
                <div className="text-section">
                    <Canvas />
                    <p className="subtitle">Discover the world of NFTs on the platform developed at the 3rd Cii Blockchain Hackathon!</p>
                    <div className="buttons">
                        <button className="bbtn1 bbtn-dark" onClick={() => { window.location.replace(`../marketplace`) }}><span>Explore</span></button>
                        <button className="bbtn1 bbtn-light" onClick={() => { window.location.replace(`../create`) }}><span>Create</span></button>
                    </div>
                </div>
                <img src={logo} alt="Cii Logo"></img>
            </div>



            <div className="info-cards" >
                <div className="website-feature">
                    <img src={wallet} height="50px" width="50px" alt="wallet" />
                    <h4>Set up Wallet</h4>
                    <p>Once you have set up your Metamask wallet, connect it to our marketplace by clicking
                        the Metamask icon in the top right corner of your browser.</p>
                </div>
                <div className="website-feature">
                    <img src={collection} height="50px" width="50px" alt="collection" />
                    <h4>Create Collection</h4>
                    <p>Click My Collection and set up your collection to show all your NFTs to your friends. </p>
                </div>
                <div className="website-feature">
                    <img src={nft} height="50px" width="50px" alt="nft" />
                    <h4>Add your NFTs</h4>
                    <p> Create a new Iteam by clicking on "Mint" and upload your work. You can also
                        add a title and a description to your NFT.</p>
                </div>
                <div className="website-feature">
                    <img src={sale} height="50px" width="50px" alt="sale" />
                    <h4>List them for Sale</h4>
                    <p>Choose between auctions and fixed-price listing.
                        You choose how you want to sell your NFTs, and we help you sell them!</p>
                </div>
            </div>

            <h3>Recently Added</h3>
            <div style={{ display: "flex", justifyContent: "center" }} >
                {latestDrops.map((NFT, key) => {
                    return (
                        <div onClick={() => { window.location.replace(`../details?value=${NFT.id}`) }} style={{ marginLeft: "20px", marginRight: "20px" }}>
                            <Card className="cli-card" style={{ overflow: "hidden", cursor: 'pointer' }}>
                                <div style={{
                                    height: "20rem", display: "flex",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                }}>
                                    <Card.Img src={`https://ipfs.infura.io/ipfs/${NFT.img}`} style={{
                                        objectFit: "cover",
                                        minWidth: "100%",
                                        minHeight: "100%"
                                    }} />
                                </div>
                            </Card>
                        </div>
                    );
                })}
            </div>
            <div className="loadingSpinner" style={{ display: "flex", justifyContent: "center" }}>
                <Spinner></Spinner>
            </div>
        </div>
    );
}

export default Home;



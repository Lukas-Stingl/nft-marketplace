import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import selectImage from '../../../img/select-image.svg';
import Spinner from "../../Layout/Spinner";
import React, { useState, useContext } from 'react';
import "./Create.css"


const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
const fs = require("fs");


async function makeBuffer(file, name, description) {
    return new Promise(async (resolve, reject) => {
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        let buffer;
        reader.onloadend = async () => {
            buffer = Buffer(reader.result).buffer;
            const metadataAdded = await uploadFile(buffer, name, description);
            resolve(metadataAdded);
        }
    });
}

async function uploadFile(buffer, name, description) {
    const fileAdded = await ipfs.add(Buffer.from(buffer));
    const metadata = {
        title: "Asset Metadata",
        type: "object",
        properties: {
            name: {
                type: "string",
                description: name
            },
            description: {
                type: "string",
                description: description
            },
            image: {
                type: "string",
                description: fileAdded.path
            },
        }
    };

    const metadataAdded = await ipfs.add(JSON.stringify(metadata));
    if (!metadataAdded) {
        return ('Something went wrong when updloading the file');
    }
    return (metadataAdded);
}


const Create = () => {
    const [nftName, setNftName] = useState('');
    const [nftDescription, setNftDescription] = useState('');
    const [nftImage, setNftImage] = useState(null);
    if(document.querySelector('.loadingSpinner')){
    document.querySelector('.loadingSpinner').style.display = 'none';
    }
    const web3Ctx = useContext(Web3Context);
    const collectionCtx = useContext(CollectionContext);

    const getFile = async (path) => {
        var aBuffer = [];
        const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        for await (const chunk of ipfs.cat(path)) {
            aBuffer.push(chunk);
            //fs.writeFile('downloaded.jpg', picture[1], err => {console.log(err) });
        }
        var picture = Buffer.concat(aBuffer)
        fs.writeFile('downloaded.jpg', picture, err => { console.log(err) });
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        const metadataAdded = await makeBuffer(nftImage, nftName, nftDescription);
        document.querySelector('.loadingSpinner').style.display = 'flex';
        collectionCtx.contract.methods.safeMint(metadataAdded.path).send({ from: web3Ctx.account })
            .on('transactionHash', (hash) => {
                document.querySelector('.loadingSpinner').style.display = 'none';
                //NFTCollectionContract.setNftIsLoading(true);
                let options = {
                    filter: {
                        address: collectionCtx.address
                    },
                    fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
                    toBlock: 'latest'
                };
                collectionCtx.contract.getPastEvents('Transfer', options)
                    .then(results => {
                        let nfts = results.length - 1
                        alert("Your NFT will be created shortly and published to the blockchain!");
                        console.log("success");
                        setTimeout(function () {
                            window.location.replace("../details?metadata=" + metadataAdded.path);
                        }, 1000);
                    })
                    .catch(err => alert(err));
                // Route to detail page of NFT
            })
            .on('error', (e) => {
                window.alert('Something went wrong when pushing to the blockchain');
                //NFTCollectionContract.setNftIsLoading(false);
                console.log("failure")
                document.querySelector('.loadingSpinner').style.display = 'none';

                // Show in UI that createion was unsuccessful
            })
    }

    const inputFileRef = React.useRef();
    const onBtnClick = () => {
        /*Collecting node-element and performing click*/
        inputFileRef.current.click();
    };

    //returns the input form with name, description and picture to App.js
    return (
        <form className="createform" onSubmit={onSubmit}>
        <div className="loadingSpinner" >
        <Spinner></Spinner>
        </div>
            <h1>Create new Item</h1>
            <h3>Name</h3>
            <div>
                <input
                    required
                    placeholder="Asset Name"
                    onChange={e => {
                        e.preventDefault();
                        setNftName(e.target.value);
                    }}
                />
            </div>
            <h3>NFT Description</h3>
            <h4>The description will be included on the item's detail page underneath its image. </h4>
            <div>
                <textarea
                    required
                    placeholder="Provide a detailed description of your Item"
                    onChange={e => {
                        e.preventDefault();
                        setNftDescription(e.target.value);
                    }}
                />
            </div>

            <h3>Image</h3>
            <h4>Here you can upload a picture of your NFT</h4>
            <div className="select-image" onClick={onBtnClick}>
                {nftImage && <img src={URL.createObjectURL(nftImage)} alt="Preview" style={{

                    objectFit: "contain",
                    width: "480px",
                    height: "480px",
                }}></img>}
                {!nftImage && <img src={selectImage} alt="Select" color="#969696" style={{ objectFit: "contain", width: "100px", height: "100px" }}></img>}
                <input
                    required
                    style={{ display: "none" }}
                    type="file"
                    accept="image/png, image/jpeg"
                    ref={inputFileRef}
                    onChange=
                    {
                        e => {
                            e.preventDefault();
                            setNftImage(e.target.files[0]);

                        }
                    }
                />
            </div>
            <div>
                <button className="bbtn hover-slide-right"><span>Create</span></button>
            </div>
        </form >
    );

}

export default Create;

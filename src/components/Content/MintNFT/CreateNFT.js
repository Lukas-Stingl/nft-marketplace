//toDo: Diese Seite nur anzeigen, wenn Nutzer sein Wallet verbunden hat!!! 


import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';

import web3 from '../../../connection/web3';
import { Alert } from 'react-alert'
import React, { useState, useContext } from 'react';
import "./mint.css"
import NFTCollection from '../../../abis/NFTCollection.json';

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
            }
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
    const [nftPrice, setNftPrice] = useState(0);
    const [currency, setCurrency] = useState('ETH');
    const [nftImage, setNftImage] = useState(null);


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

        collectionCtx.contract.methods.safeMint(metadataAdded.path).send({ from: web3Ctx.account })
            .on('transactionHash', (hash) => {
                //NFTCollectionContract.setNftIsLoading(true);
                alert("Your NFT has been created!")
                console.log("success")

                // Route to detail page of NFT
            })
            .on('error', (e) => {
                window.alert('Something went wrong when pushing to the blockchain');
                //NFTCollectionContract.setNftIsLoading(false);
                console.log("failure")

                // Show in UI that createion was unsuccessful
            })
    }


    return (
        <form class="createform" onSubmit={onSubmit}>
            <h1>Create new Item</h1>
            <h3>Name</h3>
            <div>
                <input
                    placeholder="Asset Name"
                    // value={this.state.value}
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
                    placeholder="Provide a detailed description of your Item"
                    onChange={e => {
                        e.preventDefault();
                        setNftDescription(e.target.value);
                    }}
                />
            </div>
            <h3>NFT Price</h3>
            <h4>Here you can input a price for your NFT</h4>
            <div>
                <input
                    placeholder="Asset Price in Eth"
                    type="number"
                    // value={this.state.value}
                    onChange={e => {
                        e.preventDefault();
                        setNftPrice(e.target.value);
                    }}
                />
            </div>
            <h3>Title</h3>
            <h4>Here you can upload a picture of your NFT</h4>
            <div>
                <input
                    type="file"
                    // name="Asset"
                    // className="my-4"
                    accept="image/png, image/jpeg"
                    onChange=
                    {
                        e => {
                            e.preventDefault();
                            setNftImage(e.target.files[0])



                        }
                    }

                />
            </div>
            {/* {
                    fileUrl && (

                    <Image
                        src={fileUrl}
                        alt="Picture of the author"
                        className="rounded mt-4"
                        width={350}
                        height={500}
                    // blurDataURL="data:..." automatically provided
                    // placeholder="blur" // Optional blur-up while loading
                    />
                    )
                } */}

            <div>
                <button>Create NFT</button>
            </div>
        </form >
    );

}

export default Create;
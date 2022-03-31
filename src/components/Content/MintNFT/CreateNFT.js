//toDo: Diese Seite nur anzeigen, wenn Nutzer sein Wallet verbunden hat!!! 

import web3 from '../../../connection/web3';
import { Alert } from 'react-alert'
import React from 'react';
import "./mint.css"
import NFTCollection from '../../../abis/NFTCollection.json';

const ipfsClient = require('ipfs-http-client');
const fs = require("fs");

class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = { nftName: '', nftDescription: '', nftPrice: 0, currency: 'ETH' };
        // this.uploadFile = this.uploadFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    async uploadFile() {
        return new Promise(async function(resolve, reject) {
        const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
    
        var capturedFileBuffer = this.state.buffer;
        const fileAdded = await ipfs.add(capturedFileBuffer);
    
        const metadata = {
            title: "Asset Metadata",
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: this.state.nftName
                },
                description: {
                    type: "string",
                    description: this.state.nftDescription
                },
                image: {
                    type: "string",
                    description: fileAdded.path
                }
            }
        };
    
        const metadataAdded = await ipfs.add(JSON.stringify(metadata));
        if (!metadataAdded) {
            reject('Something went wrong when updloading the file');
            
        }
        resolve(metadataAdded);
        
        })
    }

    async getFile(path) {
        var aBuffer = [];
        const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
        for await (const chunk of ipfs.cat(path)) {
            aBuffer.push(chunk);
            //fs.writeFile('downloaded.jpg', picture[1], err => {console.log(err) });
        }
        var picture = Buffer.concat(aBuffer)
        fs.writeFile('downloaded.jpg', picture, err => {console.log(err) });
    }

    async onSubmit(event) {
        event.preventDefault();
        alert(JSON.stringify(this.state))

        const metadataAdded = await this.uploadFile();

        //new from MintForm.js
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        // get contract from kovan
        const networkId = await web3.eth.net.getId();
        const NFTCollectionNetwork = NFTCollection.networks[networkId];
        const NFTCollectionContract = new web3.eth.Contract(NFTCollection.abi, NFTCollectionNetwork);
        NFTCollectionContract.options.address = "0x61Af658E4CE2fFf7ff925e62e58421AE4FD01a06"
        NFTCollectionContract.methods.safeMint(metadataAdded.path).send({ from: account })
        .on('transactionHash', (hash) => {
            NFTCollectionContract.setNftIsLoading(true);
        })
        .on('error', (e) =>{
          window.alert('Something went wrong when pushing to the blockchain');
          NFTCollectionContract.setNftIsLoading(false);  
        })  
    }

    render() {
        return (
            <form class="createform" onSubmit={this.onSubmit}>
                <h1>Create new Item</h1>
                <h3>Name</h3>
                <div>
                    <input
                        placeholder="Asset Name"
                        // value={this.state.value}
                        onChange={e => { this.setState({ nftName: e.target.value }) }}
                    />
                </div>
                <h3>NFT Description</h3>
                <h4>The description will be included on the item's detail page underneath its image. </h4>
                <div>
                    <textarea
                        placeholder="Provide a detailed description of your Item"
                        onChange={e => { this.setState({ nftDescription: e.target.value }) }}
                    />
                </div>
                <h3>NFT Price</h3>
                <h4>Here you can input a price for your NFT</h4>
                <div>
                    <input
                        placeholder="Asset Price in Eth"
                        type="number"
                        // value={this.state.value}
                        onChange={e => { this.setState({ nftPrice: e.target.value }) }}
                    />
                </div>
                <h3>Title</h3>
                <h4>Here you can upload a picture of your NFT</h4>
                <div>
                    <input
                        type="file"
                        name="Asset"
                        className="my-4"
                        onChange={e => {
                        }}
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
}

export default Create;
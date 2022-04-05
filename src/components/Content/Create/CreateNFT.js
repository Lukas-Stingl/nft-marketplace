//toDo: Diese Seite nur anzeigen, wenn Nutzer sein Wallet verbunden hat!!! 


import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';


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
            }
        }
    };

    const metadataAdded = await ipfs.add(JSON.stringify(metadata));
    if (!metadataAdded) {
        return ('Something went wrong when updloading the file');
    }
    return (metadataAdded);
}
//Preview of the uploaded image
function showPreview(event) {
    if (event.target.files.length > 0) {
        var src = URL.createObjectURL(event.target.files[0]);
        var preview = document.getElementById("file-ip-1-preview");
        preview.src = src;
        preview.style.display = "block";
    }
}

const Create = () => {
    const [nftName, setNftName] = useState('');
    const [nftDescription, setNftDescription] = useState('');
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
                        console.log(results[nfts].returnValues.tokenId)
                        alert("Your NFT will be created shortly and published to the blockchain!");
                        console.log("success");
                        window.location.replace("../details?value=" + results[nfts].returnValues.tokenId);

                    })
                    .catch(err => alert(err));
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
        <form className="createform" onSubmit={onSubmit}>
            <h1>Create new Item</h1>
            <h4>File types supported: JPG and PNG</h4>
            <h3>Name</h3>
            <div>
                <input
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
                    placeholder="Provide a detailed description of your Item"
                    onChange={e => {
                        e.preventDefault();
                        setNftDescription(e.target.value);
                    }}
                />
            </div>

            <h3>Image</h3>
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
                            setNftImage(e.target.files[0]);
                            showPreview(e)   //allows to show a preview of the uploaded img 
                        }
                    }
                />
            </div>
            <div className="preview">
                <h4>Preview:</h4>
                <img id="file-ip-1-preview" alt="Preview" ></img>
            </div>
            <div>
                <button>Create NFT</button>
            </div>
        </form >
    );

}

export default Create;

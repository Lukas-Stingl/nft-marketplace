import { useContext } from 'react';
import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import React from 'react';
import "./Detail.css"
import { useEffect, useState } from 'react';
import NFTCollection from '../../../abis/NFTCollection.json';


const Details = () => {
    const web3Ctx = useContext(Web3Context);
    const collectionCtx = useContext(CollectionContext);
    var [metadata, changedData] = useState({
        properties: {
            name: {
                description: ""
            },
            description: {
                description: ""
            },
            image: {
                description: ""
            },

        }
    });
    var [accountId, changedData1] = useState("");
    var [divStyle, changedData2] = useState({
        backgroundImage: "white"
    })

    //set initial state

    useEffect(async () => {
        const updatedData = await getNFTs();
        if (typeof updatedData === "undefined") {
            window.location.refresh();
        }
        const updatedAccountId = await web3Ctx.loadAccount(web3)
        changedData({
            ...metadata,
            metadata: updatedData,
        });
        changedData1({
            ...accountId,
            accountId: updatedAccountId
        });
        changedData2({
            ...divStyle,
            backgroundImage: 'url(https://ipfs.infura.io/ipfs/' + metadata.properties.image.description + ')',
        })
    }, [])

    const getNFTs = async () => {
        // Load account
        const account = await web3Ctx.loadAccount(web3);
        console.log("account " + account)

        // Load Network ID
        const networkId = await web3Ctx.loadNetworkId(web3);


        // Load Contracts   
        const nftDeployedNetwork = NFTCollection.networks[networkId];
        const nftContract = collectionCtx.loadContract(web3, NFTCollection, nftDeployedNetwork);


        //get tokenId from URL
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const tokenId = urlParams.get('value')
        const metadataHash = urlParams.get('metadata')
        console.log("token " + tokenId)
        console.log("metadata hash: " + metadataHash)
        if (tokenId !== null) {
            metadata = await collectionCtx.loadSingleToken(tokenId, nftContract)
        }
        if (metadataHash !== null) {
            console.log(metadataHash)
            const response = await fetch(`https://ipfs.infura.io/ipfs/${metadataHash}?clear`);
            metadata = await response.json();
        }
        console.log("name " + JSON.stringify(metadata.properties));
        return metadata
    }

    var url = "/collection?owner=" + accountId.accountId

    //visual template for the detailpage filled with metadata that gets returned to App.js
    return (
        <div className="slide-container">
            <div className="wrapper">
                <div className="clash-card barbarian">
                    <div className="clash-card__image clash-card__image--barbarian" src={`https://ipfs.infura.io/ipfs/${metadata.properties.image.description}`} style={divStyle}>
                    </div>
                    <a class name="link" href={url}>{accountId.accountId}</a>
                    <div className="clash-card__unit-name">{metadata.properties.name.description}</div>
                    <div className="clash-card__unit-description">
                        {metadata.properties.description.description}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;

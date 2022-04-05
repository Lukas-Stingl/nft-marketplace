//toDo: Diese Seite nur anzeigen, wenn Nutzer sein Wallet verbunden hat!!! 
import { useContext } from 'react';
import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import { Alert } from 'react-alert'
import React from 'react';
import "./Detail.css"
import { useEffect, useState } from 'react';
import NFTCollection from '../../../abis/NFTCollection.json';
import $ from 'jquery';



// class Create extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//         // this.uploadFile = this.uploadFile.bind(this);
//         this.onSubmit = this.onSubmit.bind(this);
//     }

//     async getTokenIds() {
//         const accounts = await web3.eth.getAccounts();
//         const account = accounts[0];
//         const networkId = await web3.eth.net.getId();

//         const NFTCollectionNetwork = NFTCollection.networks[networkId];


//         //copied todo: anpassen
//         const NFTCollectionContract = new web3.eth.Contract(NFTCollection.abi, NFTCollectionNetwork);
//         NFTCollectionContract.options.address = "0x61Af658E4CE2fFf7ff925e62e58421AE4FD01a06"



//     }


//     async onSubmit(event) {

//     }

//     render() {



//         return (
//             <div class="slide-container">
//                 <div class="wrapper">
//                     <div class="clash-card barbarian">
//                         <div class="clash-card__image clash-card__image--barbarian">
//                         </div>
//                         <div class="clash-card__level clash-card__level--barbarian">John Doe</div>
//                         <div class="clash-card__unit-name">Cat</div>
//                         <div class="clash-card__unit-description">
//                             It is a picture from a cat, which looks very nice.
//                         </div>
//                         <div class="nft-price">
//                             0.1 ETH
//                         </div>
//                         <button class="detailButton" type="button">Sell</button>



//                     </div>

//                 </div>
//             </div>







//         );
//     }
// }



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
            }
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

        //does not load contract from context yet, use hard coded context and change when context is working
        //const nftContract = collectionCtx.loadContract(web3, NFTCollection, nftDeployedNetwork);
        const nftContract = new web3.eth.Contract(NFTCollection.abi, nftDeployedNetwork);
        nftContract.options.address = "0x61Af658E4CE2fFf7ff925e62e58421AE4FD01a06"



        //get tokenId from URL
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const tokenId = urlParams.get('value')
        const metadataHash = urlParams.get('metadata')

        if(typeof tokenId !== "undefined") {
            metadata = await collectionCtx.loadSingleToken(tokenId, nftContract)
        }
        if(typeof metadataHash !== "undefined") {
            metadata = metadataHash
        }
        console.log("name " + JSON.stringify(metadata.properties));
        return metadata



        //copied todo: anpassen
        // const NFTCollectionContract = new web3.eth.Contract(NFTCollection.abi, NFTCollectionNetwork);
        // NFTCollectionContract.options.address = "0x61Af658E4CE2fFf7ff925e62e58421AE4FD01a06"

    }



    //{this.nftMetadata.name}
    //{this.nftMetadata.description}

    return (
        <div class="slide-container">
            <div class="wrapper">
                <div class="clash-card barbarian">
                    <div class="clash-card__image clash-card__image--barbarian" src={`https://ipfs.infura.io/ipfs/${metadata.properties.image.description}`} style={divStyle}>
                    </div>
                    <div class="clash-card__level clash-card__level--barbarian">{accountId.accountId}</div>
                    <div class="clash-card__unit-name">{metadata.properties.name.description}</div>
                    <div class="clash-card__unit-description">
                        {metadata.properties.description.description}
                    </div>
                    <div class="nft-price">
                        Price: not set
                    </div>
                    <button class="detailButton" type="button">Sell</button>



                </div>

            </div>
        </div>

    );

};

export default Details;
//toDo: Diese Seite nur anzeigen, wenn Nutzer sein Wallet verbunden hat!!! 
import { useContext } from 'react';
import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import CollectionContext from '../../../store/collection-context';
import { Alert } from 'react-alert'
import React from 'react';
import "./details.css"
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
    const NFTCollectionNetwork = useContext(CollectionContext);
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const getNFTs = async() => {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const networkId = await web3.eth.net.getId();
        const tokenId = urlParams.get('value')
        const metadata = await NFTCollectionNetwork.loadSingleToken(tokenId, NFTCollectionNetwork.contract); 
        console.log(metadata);
        

        

        //copied todo: anpassen
        // const NFTCollectionContract = new web3.eth.Contract(NFTCollection.abi, NFTCollectionNetwork);
        // NFTCollectionContract.options.address = "0x61Af658E4CE2fFf7ff925e62e58421AE4FD01a06"
    }  
    getNFTs();

    


    return (
        <div class="slide-container">
            <div class="wrapper">
                <div class="clash-card barbarian">
                    <div class="clash-card__image clash-card__image--barbarian">
                    </div>
                    <div class="clash-card__level clash-card__level--barbarian">John Doe</div>
                    <div class="clash-card__unit-name">Cat</div>
                    <div class="clash-card__unit-description">
                        It is a picture from a cat, which looks very nice.
                    </div>
                    <div class="nft-price">
                        0.1 ETH
                    </div>
                    <button class="detailButton" type="button">Sell</button>



                </div>

            </div>
        </div>

    );
  };
export default Details;
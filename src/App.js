import React, { useContext, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import web3 from './connection/web3';
import Navigation from './components/Layout/Navigation';
import Home from './components/Content/Home';
import Marketplace from './components/Content/Marketplace/Marketplace';
import Collection from './components/Content/Collection/Collection';
import Details from './components/Content/Marketplace/DetailPage';
import Create from './components/Content/Create/CreateNFT';
import NotFound from './components/Content/NotFound/NotFound';
import Web3Context from './store/web3-context';
import CollectionContext from './store/collection-context';
import MarketplaceContext from './store/marketplace-context';
import NFTCollection from './abis/NFTCollection.json';
import NFTMarketplace from './abis/NFTMarketplace.json';
import Web3Provider from './store/Web3Provider';
import MarketplaceProvider from './store/MarketplaceProvider';
import "./app.css";

const App = () => {
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  const marketplaceCtx = useContext(MarketplaceContext);

  useEffect(() => {
    // Check if the user has Metamask active
    if (!web3) {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return;
    }

    // Function to fetch all the blockchain data
    const loadBlockchainData = async () => {
      // Request accounts acccess if needed
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error(error);
      }

      // Load account
      const account = await web3Ctx.loadAccount(web3);
      console.log(`account address: ${account}`);

      // Load Network ID
      const networkId = await web3Ctx.loadNetworkId(web3);

      // Load Contracts   
      const nftDeployedNetwork = NFTCollection.networks[networkId];
      console.log(`deployed network = ${nftDeployedNetwork}`);
      const nftContract = collectionCtx.loadContract(web3, NFTCollection, nftDeployedNetwork);

      const mktDeployedNetwork = NFTMarketplace.networks[networkId];
      const mktContract = marketplaceCtx.loadContract(web3, NFTMarketplace, mktDeployedNetwork);



      if (nftContract) {
        console.log(`reached if nftContract block`);
        // Load total Supply
        const totalSupply = await collectionCtx.loadTotalSupply(nftContract);

        // Load Collection
        collectionCtx.loadCollection(nftContract, totalSupply);

        // Event subscription
        nftContract.events.Transfer()
          .on('data', (event) => {
            collectionCtx.updateCollection(nftContract, event.returnValues.tokenId, event.returnValues.to);
            collectionCtx.setNftIsLoading(false);
          })
          .on('error', (error) => {
            console.log(error);
          });

      } else {
        window.alert('NFTCollection contract not deployed to detected network.')
      }

      if (mktContract) {
        // Load offer count
        const offerCount = await marketplaceCtx.loadOfferCount(mktContract);

        // Load offers
        marketplaceCtx.loadOffers(mktContract, offerCount);

        // Load User Funds
        account && marketplaceCtx.loadUserFunds(mktContract, account);



        // Event OfferFilled subscription 
        mktContract.events.OfferFilled()
          .on('data', (event) => {
            marketplaceCtx.updateOffer(event.returnValues.offerId);
            collectionCtx.updateOwner(event.returnValues.id, event.returnValues.newOwner);
            marketplaceCtx.setMktIsLoading(false);
          })
          .on('error', (error) => {
            console.log(error);
          });

        // Event Offer subscription 
        mktContract.events.Offer()
          .on('data', (event) => {
            marketplaceCtx.addOffer(event.returnValues);
            marketplaceCtx.setMktIsLoading(false);
          })
          .on('error', (error) => {
            console.log(error);
          });

        // Event offerCancelled subscription 
        mktContract.events.OfferCancelled()
          .on('data', (event) => {
            marketplaceCtx.updateOffer(event.returnValues.offerId);
            collectionCtx.updateOwner(event.returnValues.id, event.returnValues.owner);
            marketplaceCtx.setMktIsLoading(false);
          })
          .on('error', (error) => {
            console.log(error);
          });

      } else {
        window.alert('NFTMarketplace contract not deployed to detected network.')
      }

      collectionCtx.setNftIsLoading(false);
      marketplaceCtx.setMktIsLoading(false);

      // Metamask Event Subscription - Account changed
      window.ethereum.on('accountsChanged', (accounts) => {
        web3Ctx.loadAccount(web3);
        accounts[0] && marketplaceCtx.loadUserFunds(mktContract, accounts[0]);
      });

      // Metamask Event Subscription - Network changed
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });
    };

    loadBlockchainData();
  }, []);

  const showNavbar = web3 && collectionCtx.contract && marketplaceCtx.contract;
  const showContent = web3 && collectionCtx.contract && marketplaceCtx.contract && web3Ctx.account;
  return (

    <Router>
      <Navigation />
      <div style={{ marginTop: "66px" }}>
        <Routes >
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path={`/collection`} element={<Collection />} />
          <Route path="/details" element={<Details />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>

    // {/* {showContent && <Main />} */}

  );


};


export default App;


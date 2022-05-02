import React from 'react';
import { useReducer } from 'react';

import CollectionContext from './collection-context';

const defaultCollectionState = {
  contract: null,
  totalSupply: null,
  collection: [],
  nftIsLoading: true
};

const collectionReducer = (state, action) => {
  console.log(`reached collectionreducer code`)

  if (action.type === 'CONTRACT') {
    return {
      contract: action.contract,
      totalSupply: state.totalSupply,
      collection: state.collection,
      nftIsLoading: state.nftIsLoading
    };
  }

  if (action.type === 'LOADSUPPLY') {
    return {
      contract: state.contract,
      totalSupply: action.totalSupply,
      collection: state.collection,
      nftIsLoading: state.nftIsLoading
    };
  }

  if (action.type === 'LOADCOLLECTION') {
    return {
      contract: state.contract,
      totalSupply: state.totalSupply,
      collection: action.collection,
      nftIsLoading: state.nftIsLoading
    };
  }

  if (action.type === 'UPDATECOLLECTION') {
    const index = state.collection.findIndex(NFT => NFT.id === parseInt(action.NFT.id));
    let collection = [];

    if (index === -1) {
      collection = [action.NFT, ...state.collection];
    } else {
      collection = [...state.collection];
    }

    return {
      contract: state.contract,
      totalSupply: state.totalSupply,
      collection: collection,
      nftIsLoading: state.nftIsLoading
    };
  }

  if (action.type === 'UPDATEOWNER') {
    const index = state.collection.findIndex(NFT => NFT.id === parseInt(action.id));
    let collection = [...state.collection];
    collection[index].owner = action.newOwner;

    return {
      contract: state.contract,
      totalSupply: state.totalSupply,
      collection: collection,
      nftIsLoading: state.nftIsLoading
    };
  }

  if (action.type === 'LOADING') {
    return {
      contract: state.contract,
      totalSupply: state.totalSupply,
      collection: state.collection,
      nftIsLoading: action.loading
    };
  }

  return defaultCollectionState;
};

const CollectionProvider = props => {
  const [CollectionState, dispatchCollectionAction] = useReducer(collectionReducer, defaultCollectionState);

  const loadContractHandler = (web3, NFTCollection, deployedNetwork) => {
    console.log(`Reached Load Contract Handler. deployednetwork: ${deployedNetwork}`)
    const contract = deployedNetwork ? new web3.eth.Contract(NFTCollection.abi, deployedNetwork.address) : '';
    dispatchCollectionAction({ type: 'CONTRACT', contract: contract });
    return contract;
  };

  const loadTotalSupplyHandler = async (contract) => {
    const totalSupply = await contract.methods.totalSupply().call();
    dispatchCollectionAction({ type: 'LOADSUPPLY', totalSupply: totalSupply });
    return totalSupply;
  };

  const loadSingleTokenHandler = (tokenId, contract) => {
    return new Promise(async function (resolve, reject) {
      await contract.methods.tokenURIs(tokenId - 1).call().then(async (result) => {
        console.log("Success! Got result: " + result);
        try {
          const response = await fetch(`https://ipfs.infura.io/ipfs/${result}?clear`);
          if (!response.ok) {
            throw new Error('Something went wrong');
          }

          const metadata = await response.json();
          resolve(metadata)

        } catch {
          console.error('Something went wrong');
        }
      }).catch((err) => {
        console.log("Failed with error: " + err);
        setTimeout(function () {
          window.location.reload();
        }, 1000)

      });

    })

  };

  const loadCollectionHandler = async (contract, totalSupply) => {
    let collection = [];
    console.log(`reached load collection handler`)

    for (let i = 0; i < totalSupply; i++) {
      const hash = await contract.methods.tokenURIs(i).call();
      try {
        const response = await fetch(`https://ipfs.infura.io/ipfs/${hash}?clear`);
        if (!response.ok) {
          throw new Error('Something went wrong');
        }

        const metadata = await response.json();
        const owner = await contract.methods.ownerOf(i + 1).call();

        collection = [{
          id: i + 1,
          title: metadata.properties.name.description,
          img: metadata.properties.image.description,
          owner: owner
        }, ...collection];
      } catch {
        console.error('Something went wrong');
      }
    }
    //event that triggers the loading circle to disappear
    dispatchCollectionAction({ type: 'LOADCOLLECTION', collection: collection });
    const pageLoaded = new Event('pageLoaded', {
      bubbles: true,
      cancelable: true,
      composed: false
    })
    document.dispatchEvent(pageLoaded);
  };

  const updateCollectionHandler = async (contract, id, owner) => {
    let NFT;
    const hash = await contract.methods.tokenURI(id).call();
    try {
      const response = await fetch(`https://ipfs.infura.io/ipfs/${hash}?clear`);
      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const metadata = await response.json();

      NFT = {
        id: parseInt(id),
        title: metadata.properties.name.description,
        img: metadata.properties.image.description,
        owner: owner
      };
    } catch {
      console.error('Something went wrong');
    }
    dispatchCollectionAction({ type: 'UPDATECOLLECTION', NFT: NFT });
  };

  const updateOwnerHandler = (id, newOwner) => {
    dispatchCollectionAction({ type: 'UPDATEOWNER', id: id, newOwner: newOwner });
  };

  const setNftIsLoadingHandler = (loading) => {
    dispatchCollectionAction({ type: 'LOADING', loading: loading });
  };

  const collectionContext = {
    contract: CollectionState.contract,
    totalSupply: CollectionState.totalSupply,
    collection: CollectionState.collection,
    nftIsLoading: CollectionState.nftIsLoading,
    loadContract: loadContractHandler,
    loadTotalSupply: loadTotalSupplyHandler,
    loadCollection: loadCollectionHandler,
    updateCollection: updateCollectionHandler,
    updateOwner: updateOwnerHandler,
    setNftIsLoading: setNftIsLoadingHandler,
    loadSingleToken: loadSingleTokenHandler
  };

  return (
    <CollectionContext.Provider value={collectionContext}>
      {props.children}
    </CollectionContext.Provider>
  );
};

export default CollectionProvider;
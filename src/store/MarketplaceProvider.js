import React, { useReducer } from 'react';
import { blockTagForPayload } from 'web3-provider-engine/util/rpc-cache-utils';

import MarketplaceContext from './marketplace-context';

const defaultMarketplaceState = {
  contract: null,
  offerCount: null,
  offers: [],
  userFunds: null,
  mktIsLoading: true,
  auctionCount: null,
  auctions: []
};

const marketplaceReducer = (state, action) => {
  if (action.type === 'CONTRACT') {
    return {
      contract: action.contract,
      offerCount: state.offerCount,
      offers: state.offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading,
      auctionCount: state.auctionCount,
      auctions: state.auctions
    };
  }

  if (action.type === 'LOADOFFERCOUNT') {
    return {
      contract: state.contract,
      offerCount: action.offerCount,
      offers: state.offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading,
      auctionCount: state.auctionCount,
      auctions: state.auctions
    };
  }

  if (action.type === 'LOADOFFERS') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: action.offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading,
      auctionCount: state.auctionCount,
      auctions: state.auctions
    };
  }

  if (action.type === 'UPDATEOFFER') {
    const offers = state.offers.filter(offer => offer.offerId !== parseInt(action.offerId));

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading,
      auctionCount: state.auctionCount,
      auctions: state.auctions
    };
  }

  if (action.type === 'ADDOFFER') {
    const index = state.offers.findIndex(offer => offer.offerId === parseInt(action.offer.offerId));
    let offers = [];

    if (index === -1) {
      offers = [...state.offers, {
        offerId: parseInt(action.offer.offerId),
        id: parseInt(action.offer.id),
        user: (action.offer.user),
        price: parseInt(action.offer.price),
        fulfilled: false,
        cancelled: false
      }];
    } else {
      offers = [...state.offers];
    }

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading,
      auctionCount: state.auctionCount,
      auctions: state.auctions
    };
  }

  if (action.type === 'LOADFUNDS') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: state.offers,
      userFunds: action.userFunds,
      mktIsLoading: state.mktIsLoading,
      auctionCount: state.auctionCount,
      auctions: state.auctions
    };
  }

  if (action.type === 'LOADING') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: state.offers,
      userFunds: state.userFunds,
      mktIsLoading: action.loading,
      auctionCount: state.auctionCount,
      auctions: state.auctions
    };
  }

  if (action.type === 'LOADauctionCount') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: state.offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading,
      auctionCount: action.auctionCount,
      auctions: state.auctions
    };
  }

  if (action.type === 'LOADAUCTIONS') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: state.offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading,
      auctionCount: state.auctionCount,
      auctions: action.auctions
    };
  }

  if (action.type === 'UPDATEAUCTION') {
    const auctions = state.auctions.filter(auction => auction.auctionId !== parseInt(action.auctionId));

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: state.offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading,
      auctionCount: state.auctionCount,
      auctions: auctions
    };
  }

  if (action.type === 'ADDAUCTION') {
    const index = state.auctions.findIndex(auction => auction.auctionId === parseInt(action.auction.auctionId));
    let auctions = [];

    if (index === -1) {
      auctions = [...state.auctions, {
        auctionId: parseInt(action.auction.auctionId),
        nftId: parseInt(action.auction.nftId),
        seller: (action.auction.seller),
        startingPrice: parseInt(action.auction.startingPrice),
        startedAt: parseInt(action.auction.startedAt),
        endedAt: parseInt(action.auction.endedAt),
        highestBidder: 0,
        highestBid: 0,
        fulfilled: false,
        cancelled: false
      }];
    } else {
      auctions = [...state.auctions];
    }

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: state.offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading,
      auctionCount: state.auctionCount,
      auctions: auctions
    };
  }

  /*if (action.type === 'LOADBIDS') {
    //to be filled
  }*/

  if (action.type === 'UPDATEBIDS') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: state.offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading,
      auctionCount: state.auctionCount,
      auctions: state.auctions
    };
  }

  if (action.type === 'ADDBID') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      offers: state.offers,
      userFunds: state.userFunds,
      mktIsLoading: state.mktIsLoading,
      auctionCount: state.auctionCount,
      auctions: state.auctions
    };
  }
  return defaultMarketplaceState;
};

const MarketplaceProvider = props => {
  const [MarketplaceState, dispatchMarketplaceAction] = useReducer(marketplaceReducer, defaultMarketplaceState);

  const loadContractHandler = (web3, NFTMarketplace, deployedNetwork) => {
    const contract = deployedNetwork ? new web3.eth.Contract(NFTMarketplace.abi, deployedNetwork.address) : '';
    dispatchMarketplaceAction({ type: 'CONTRACT', contract: contract });
    return contract;
  };

  //OfferHandler:

  const loadOfferCountHandler = async (contract) => {
    const offerCount = await contract.methods.offerCount().call();
    dispatchMarketplaceAction({ type: 'LOADOFFERCOUNT', offerCount: offerCount });
    return offerCount;
  };

  const loadOffersHandler = async (contract, offerCount) => {
    let offers = [];
    for (let i = 0; i < offerCount; i++) {
      const offer = await contract.methods.offers(i + 1).call();
      offers.push(offer);
    }
    offers = offers
      .map(offer => {
        offer.offerId = parseInt(offer.offerId);
        offer.id = parseInt(offer.id);
        offer.price = parseInt(offer.price);
        return offer;
      })
      .filter(offer => offer.fulfilled === false && offer.cancelled === false);
    dispatchMarketplaceAction({ type: 'LOADOFFERS', offers: offers });
  };

  const updateOfferHandler = (offerId) => {
    dispatchMarketplaceAction({ type: 'UPDATEOFFER', offerId: offerId });
  };

  const addOfferHandler = (offer) => {
    dispatchMarketplaceAction({ type: 'ADDOFFER', offer: offer });
  };

  const loadUserFundsHandler = async (contract, account) => {
    const userFunds = await contract.methods.userFunds(account).call();
    dispatchMarketplaceAction({ type: 'LOADFUNDS', userFunds: userFunds });
    return userFunds;
  };

  const setMktIsLoadingHandler = (loading) => {
    dispatchMarketplaceAction({ type: 'LOADING', loading: loading });
  };


  //AuctionHandler:

  const loadauctionCountHandler = async (contract) => {
    const auctionCount = await contract.methods.auctionCount().call();
    dispatchMarketplaceAction({ type: 'LOADauctionCount', auctionCount: auctionCount });
    return auctionCount;
  };

  const loadAuctionsHandler = async (contract, auctionCount) => {
    let auctions = [];
    for (let i = 0; i < auctionCount; i++) {
      const auction = await contract.methods.auctions(i + 1).call();
      auctions.push(auction);
    }
    auctions = auctions
      .map(auction => {
        auction.auctionId = parseInt(auction.auctionId);
        auction.nftId = parseInt(auction.nftId);
        auction.startingPrice = parseInt(auction.startingPrice);
        return auction;
      })
      //.filter(auction => auction.endedAt > Date.now());
    dispatchMarketplaceAction({ type: 'LOADAUCTIONS', auctions : auctions });
  };

  const updateAuctionHandler = (auctionId) => {
    dispatchMarketplaceAction({ type: 'UPDATEAUCTION', auctionId: auctionId });
  };

  const addAuctionHandler = (auction) => {
    dispatchMarketplaceAction({ type: 'ADDAUCTION', auction: auction });
  };

  /*const loadBidsHandler = async (contract, auctionId, bidder ) => { //tbc
    let bids = [];
    for (let i = 0; i < auctionCount; i++) {
      const auction = await contract.methods.auction(i + 1).call();
      auctions.push(auction);
    }
    auctions = auctions
      .map(auction => {
        auction.auctionId = parseInt(auction.auctionId);
        return auction;
      })
      .filter(auction => auction.endedAt > now);
    dispatchMarketplaceAction({ type: 'LOADBIDS', auctions : auctions });
  };*/

  const updateBidsHandler = (bidder) => {
    dispatchMarketplaceAction({ type: 'UPDATEBIDS', bidder: bidder});
  };

  const addBidHandler = (bid) => {
    dispatchMarketplaceAction({ type: 'ADDBID', bid: bid });
  };

  const marketplaceContext = {
    contract: MarketplaceState.contract,
    offerCount: MarketplaceState.offerCount,
    offers: MarketplaceState.offers,
    userFunds: MarketplaceState.userFunds,
    mktIsLoading: MarketplaceState.mktIsLoading,
    auctionCount: MarketplaceState.auctionCount,
    auctions: MarketplaceState.auctions,
    loadContract: loadContractHandler,
    loadOfferCount: loadOfferCountHandler,
    loadOffers: loadOffersHandler,
    updateOffer: updateOfferHandler,
    addOffer: addOfferHandler,
    loadUserFunds: loadUserFundsHandler,
    setMktIsLoading: setMktIsLoadingHandler,
    loadauctionCount: loadauctionCountHandler,
    loadAuctions: loadAuctionsHandler,
    updateAuction: updateAuctionHandler,
    addAuction: addAuctionHandler,
    //loadBids: loadBidsHandler,
    updateBids: updateBidsHandler,
    addBid: addBidHandler
  };

  return (
    <MarketplaceContext.Provider value={marketplaceContext}>
      {props.children}
    </MarketplaceContext.Provider>
  );
};

export default MarketplaceProvider;
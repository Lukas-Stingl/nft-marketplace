import React, { useReducer } from 'react';

import MarketplaceContext from './marketplace-context';

const defaultMarketplaceState = {
  contract: null,
  offerCount: null,
  bidCount: null,
  offers: [],
  bids: [],
  userFunds: null,
  beneficiary: null,
  highestBidder:null,
  highestBid: null,
  pendingReturns:null,
  mktIsLoading: true,
  actIsLoading: true
};

const marketplaceReducer = (state, action) => {
  if (action.type === 'CONTRACT') {
    return {
      contract: action.contract,
      offerCount: state.offerCount,
      bidCount: state.bidCount,
      offers: state.offers,
      bids: state.bids,
      userFunds: state.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }

  if (action.type === 'LOADOFFERCOUNT') {
    return {
      contract: state.contract,
      offerCount: action.offerCount,
      bidCount: state.bidCount,
      offers: state.offers,
      bids: state.bids,
      userFunds: state.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }

  if (action.type === 'LOADOFFERS') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      bidCount: state.bidCount,
      offers: action.offers,
      bids: state.bids,
      userFunds: state.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }



  if (action.type === 'UPDATEOFFER') {
    const offers = state.offers.filter(offer => offer.offerId !== parseInt(action.offerId));

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      bidCount: state.bidCount,
      offers: offers,
      bids: state.bids,
      userFunds: state.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
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
      bidCount: state.bidCount,
      offers: offers,
      bids: state.bids,
      userFunds: state.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }

  if (action.type === 'LOADFUNDS') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      bidCount: state.bidCount,
      offers: state.offers,
      bids: state.bids,
      userFunds: action.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }

  if (action.type === 'MKTLOADING') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      bidCount: state.bidCount,
      offers: state.offers,
      bids: state.bids,
      userFunds: action.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: action.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }

  if (action.type === 'LOADBIDCOUNT') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      bidCount: action.bidCount,
      offers: state.offers,
      bids: state.bids,
      userFunds: state.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }

  if (action.type === 'LOADBIDS') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      bidCount: state.bidCount,
      offers: state.offers,
      bids: action.bids,
      userFunds: state.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }

  if (action.type === 'UPDATEBID') {
    const bids = state.bids.filter(bid => bid.bidId !== parseInt(action.bidId));

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      bidCount: state.bidCount,
      offers: state.offers,
      bids: bids,
      userFunds: state.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }

  if (action.type === 'ADDBID') {
    const index = state.bids.findIndex(bid => bid.bidId === parseInt(action.bid.bidId));
    let bids = [];

    if (index === -1) {
      bids = [...state.bids, {
        bidId: parseInt(action.bid.bidId),
        id: parseInt(action.bid.id),
        user: (action.bid.user),
        price: parseInt(action.bid.bidPrice),
        executed: false,
        cancelled: false
      }];
    } else {
      bids = [...state.bidss];
    }

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      bidCount: state.bidCount,
      offers: state.offers,
      bids: bids,
      userFunds: state.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }

  if (action.type === 'SETBENEFICIARY') { //to be looked at
  

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      bidCount: state.bidCount,
      offers: state.offers,
      bids: state.bids,
      userFunds: state.userFunds,
      beneficiary: action.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }

  if (action.type === 'UPDATEHIGHESTBIDDER') { //to be looked at
  

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      bidCount: state.bidCount,
      offers: state.offers,
      bids: state.bids,
      userFunds: state.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:action.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }

  if (action.type === 'UPDATEHIGHESTBID') { //to be looked at
  

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      bidCount: state.bidCount,
      offers: state.offers,
      bids: state.bids,
      userFunds: state.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: action.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }

  if (action.type === 'UPDATEPENDINGRETURNS') { //to be looked at
  

    return {
      contract: state.contract,
      offerCount: state.offerCount,
      bidCount: state.bidCount,
      offers: state.offers,
      bids: state.bids,
      userFunds: state.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:action.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: state.actIsLoading
    };
  }

  if (action.type === 'ACTLOADING') {
    return {
      contract: state.contract,
      offerCount: state.offerCount,
      bidCount: state.bidCount,
      offers: state.offers,
      bids: state.bids,
      userFunds: action.userFunds,
      beneficiary: state.beneficiary,
      highestBidder:state.highestBidder,
      highestBid: state.highestBid,
      pendingReturns:state.pendingReturns,
      mktIsLoading: state.mktIsLoading,
      actIsLoading: action.actIsLoading
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

  const setMktIsLoadingHandler = (mktloading) => {
    dispatchMarketplaceAction({ type: 'MKTLOADING', mktloading: mktloading });
  };

  const loadBidCountHandler = async (contract) => {
    const bidCount = await contract.methods.bidCount().call();
    dispatchMarketplaceAction({ type: 'LOADBIDCOUNT', bidCount: bidCount });
    return bidCount;
  };

  const loadBidsHandler = async (contract, bidCount) => {
    let bids = [];
    for (let i = 0; i < bidCount; i++) {
      const bid = await contract.methods.bids(i + 1).call();
      bids.push(bid);
    }
    bids = bids
      .map(bid => {
        bid.bidId = parseInt(bid.bidId);
        bid.id = parseInt(bid.id);
        bid.bidPrice = parseInt(bid.biPrice);
        return bid;
      })
      .filter(bid => bid.executed === false && bid.cancelled === false);
    dispatchMarketplaceAction({ type: 'LOADBIDS', bids: bids });
  };

  const updateBidHandler = (bidId) => {
    dispatchMarketplaceAction({ type: 'UPDATEBID', bidId: bidId });
  };

  const addBitHandler = (bid) => {
    dispatchMarketplaceAction({ type: 'ADDBID', bid: bid });
  };

  const setBeneficiaryHandler = (setBeneficiary) => {
    dispatchMarketplaceAction({ type: 'SETBENEFICIARY', setBeneficiary: setBeneficiary });
  };

  const updateHighestBidderHandler = (highestBidder) => {
    dispatchMarketplaceAction({ type: 'UPDATEHIGHESTBIDDER', highestBidder: highestBidder });
  };

  const updateHighestBidHandler = (highestBid) => {
    dispatchMarketplaceAction({ type: 'UPDATEHIGHESTBID', highestBid: highestBid });
  };

  const updatePendingReturnsHandler = (pendingReturns) => {
    dispatchMarketplaceAction({ type: 'UPDATEPENDINGRETURNS', pendingReturns: pendingReturns });
  };

  const setActIsLoadingHandler = (actloading) => {
    dispatchMarketplaceAction({ type: 'ACTLOADING', actloading: actloading });
  };

  const marketplaceContext = {
    contract: MarketplaceState.contract,
    offerCount: MarketplaceState.offerCount,
    offers: MarketplaceState.offers,
    bids: MarketplaceState.bids,
    userFunds: MarketplaceState.userFunds,
    beneficiary: MarketplaceState.beneficiary,
    highestBidder: MarketplaceState.highestBidder,
    highestBid: MarketplaceState.highestBid,
    pendingReturns: MarketplaceState.pendingReturns,
    mktIsLoading: MarketplaceState.mktIsLoading,
    actIsLoading: MarketplaceState.actIsLoading,
    loadContract: loadContractHandler,
    loadOfferCount: loadOfferCountHandler,
    loadOffers: loadOffersHandler,
    updateOffer: updateOfferHandler,
    addOffer: addOfferHandler,
    loadUserFunds: loadUserFundsHandler,
    setMktIsLoading: setMktIsLoadingHandler,
     loadBidCount: loadBidCountHandler,
    loadBids: loadBidsHandler,
    updateBid: updateBidHandler,
    addBid: addBitHandler,
    setBeneficiary: setBeneficiaryHandler,
    updateHighestBidder: updateHighestBidderHandler,
    updateHighestBid: updateHighestBidHandler,
    updatePendingReturns: updatePendingReturnsHandler,
    setActIsLoading: setActIsLoadingHandler,
  };

  return (
    <MarketplaceContext.Provider value={marketplaceContext}>
      {props.children}
    </MarketplaceContext.Provider>
  );
};

export default MarketplaceProvider;
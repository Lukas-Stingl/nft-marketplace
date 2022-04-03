import React from 'react';

const MarketplaceContext = React.createContext({
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
  actIsLoading: true,
  loadContract: () => { },
  loadOfferCount: () => { },
  loadOffers: () => { },
  updateOffer: () => { },
  addOffer: () => { },
  loadUserFunds: () => { },
  setMktIsLoading: () => { },
  loadBidCount: () => { },
  loadBids: () => { },
  updateBid: () => { },
  addBid: () => { },
  setBeneficiary: () => { },
  updateHighestBidder: () => { },
  updateHighestBid: () => { },
  updatePendingReturns: () => { },
  setActIsLoading: () => { },
});

export default MarketplaceContext;
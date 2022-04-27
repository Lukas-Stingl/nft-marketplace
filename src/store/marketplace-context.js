import React from 'react';

const MarketplaceContext = React.createContext({
  //offers
  contract: null,
  offerCount: null,
  offers: [],
  userFunds: null,
  mktIsLoading: true,
  loadContract: () => { },
  loadOfferCount: () => { },
  loadOffers: () => { },
  updateOffer: () => { },
  addOffer: () => { },
  loadUserFunds: () => { },
  setMktIsLoading: () => { },

  //auction
  auctionCount: null,
  auctions: [],
  loadauctionCount: () => { },
  loadAuctions: () => { },
  updateAuction: () => { },
  addAuction:() => { },
  //loadBids: () => { },
  updateBids: () => { },
  addBid: () => { },
});

export default MarketplaceContext;
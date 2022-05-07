import React from 'react';

const MarketplaceContext = React.createContext({
  // Offers
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

  // Auction
  auctionCount: null,
  auctions: [],
  loadauctionCount: () => { },
  loadAuctions: () => { },
  updateAuction: () => { },
  addAuction:() => { },
});

export default MarketplaceContext;
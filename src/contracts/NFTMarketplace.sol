// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTCollection.sol";

/// @title A marketplace where users can buy/sell their NFT by auction or offer
/// @notice This contract provides you with every business logic behind the different market mechanisms
/// @dev There are currently hardcoded attributes, e.g. duration of an auction, which later can be implemented so that an user can set his desired duration for the auction
contract NFTMarketplace {
    uint256 public offerCount; /// Number of total created offers
    mapping(uint256 => _Offer) public offers; /// Maps an offer struct to an specific offer ID
    mapping(address => uint256) public userFunds; /// Maps an balance of funds an account has stored in the smart contract to a corresponding address
    NFTCollection nftCollection;

    /// @notice Offers allow other users (not the owner) to buy the NFT at a fixed price.
    struct _Offer {
        uint256 offerId;
        uint256 id;
        address user;
        uint256 price;
        bool fulfilled;
        bool cancelled;
    }

    event Offer(
        uint256 offerId,
        uint256 id,
        address user,
        uint256 price,
        bool fulfilled,
        bool cancelled
    );
    /// @notice Is emitted once an offer is made
    /// @param offerId The unique ID of the offer
    /// @param id The unique ID of the NFT
    /// @param newOwner The buyer of the NFT, which is set as the new owner
    event OfferFilled(uint256 offerId, uint256 id, address newOwner);

    /// @notice Is emitted once an offer is cancelled
    /// @param offerId The unique ID of the offer
    /// @param id The unique ID of the NFT
    /// @param owner The seller of the NFT, which decided to not sell his NFT anymore
    event OfferCancelled(uint256 offerId, uint256 id, address owner);

    /// @notice Is emitted once a user claims its available funds
    /// @param user The address of the user who claims the funds
    /// @param amount The amount of Ether, the user has earned through his sales
    event ClaimFunds(address user, uint256 amount);

    /// @notice Passes every NFT stored in the collection for making them accessible for every type of market interactions
    /// @param _nftCollection Consists of every NFT ever minted using our application
    constructor(address _nftCollection) {
        nftCollection = NFTCollection(_nftCollection);
    }

    /// @notice Sets the price at which the NFT can be bought from other users and puts the NFT for sale on the market
    /// @param _id The token id of the NFT
    /// @param _price The price at which the NFT can be bought
    function makeOffer(uint256 _id, uint256 _price) public {
        nftCollection.transferFrom(msg.sender, address(this), _id);
        offerCount++;
        offers[offerCount] = _Offer(
            offerCount,
            _id,
            msg.sender,
            _price,
            false,
            false
        );
        emit Offer(offerCount, _id, msg.sender, _price, false, false);
    }

    /// @notice The sender buys a NFT from the offers list
    /// @param _offerId The ID of the offer matched with the NFT which the user wants to buy
    function fillOffer(uint256 _offerId) public payable {
        _Offer storage _offer = offers[_offerId];
        require(_offer.offerId == _offerId, "The offer must exist"); /// Checks that the offer ID matches with a valid offer
        require(_offer.user != msg.sender, "The owner of the offer cannot fill it"); /// Checks that the owner is not the buyer
        require(!_offer.fulfilled, "An offer cannot be fulfilled twice"); /// Checks that the offer was not prior fulfilled
        require(!_offer.cancelled, "A cancelled offer cannot be fulfilled"); ///Checks that offer is still active
        require(msg.value == _offer.price, "The ETH amount should match with the NFT Price"); /// Checks that the amount send is matching with the intended price by the seller
        nftCollection.transferFrom(address(this), msg.sender, _offer.id); /// Transfers the NFT to the buyer
        _offer.fulfilled = true;
        userFunds[_offer.user] += msg.value; /// Sellers user funds gets credited with the amount earned
        emit OfferFilled(_offerId, _offer.id, msg.sender);
    }

    /// @notice Cancel an offer from the offers list. Only available to the owner of the offer
    /// @param _offerId The ID of the offer which the user wants to cancel
    function cancelOffer(uint256 _offerId) public {
        _Offer storage _offer = offers[_offerId];
        require(_offer.offerId == _offerId, "The offer must exist"); /// Checks that the offer ID matches with a valid offer
        require(_offer.user == msg.sender, "The offer can only be canceled by the owner"); /// Checks that only the owner can cancel an offer
        require(_offer.fulfilled == false, "A fulfilled offer cannot be cancelled"); /// Checks that only not fulfilled offers can be cancelled
        require(_offer.cancelled == false, "An offer cannot be cancelled twice"); /// Checks that the offer was not prior cancelled
        nftCollection.transferFrom(address(this), msg.sender, _offer.id); /// Transfers the NFT back to the seller
        _offer.cancelled = true;
        emit OfferCancelled(_offerId, _offer.id, msg.sender);
    }

    /// @notice The user can withdraw their funds made by selling a NFT
    function claimFunds() public {
        require(
            userFunds[msg.sender] > 0,
            "This user has no funds to be claimed"
        );
        payable(msg.sender).transfer(userFunds[msg.sender]);
        emit ClaimFunds(msg.sender, userFunds[msg.sender]);
        userFunds[msg.sender] = 0; /// Sets the balance back to 0
    }

    //<-------------------------Implementing Auction mechnanism---------------------------------------->

    uint256 public auctionCount; /// Number of total created auctions
    mapping(uint256 => _Auction) public auctions; /// Maps auction struct to a corresponding auction ID

    /// @notice Auction mechanism which allows user to participate in an auction
    struct _Auction {
        uint256 auctionId; /// ID of an auction
        uint256 nftId; ///ID of a NFT
        address seller; /// Address of a seller 
        uint256 startingPrice; /// Minimum amount the first bid has to surpass
        uint64 duration; /// Duration (in seconds) of an auction
        uint256 startedAt; /// Timestamp, when auction has started
        uint256 endedAt; /// Timestamp, when auction will end/has ended
        bool isActive; /// Current state of the auction
        address highestBidder; /// Address of the highest bidder of an auction
        uint256 highestBid; /// Amount of the highest bid
        mapping(address => uint256) bids; /// Mapping to get the individual bids placed by severel bidder in an auction
    }

    /// @notice Is emitted once an aution is made
    /// @param auctionId The unique ID of the auction
    /// @param tokenID The unique ID of the NFT
    /// @param startingPrice Currently not implemented. For future use: the Seller can set his own minimum starting price for the auction
    /// @param duration The duration of the auction
    event AuctionCreated(
        uint256 auctionId,
        uint256 tokenId,
        uint256 startingPrice,
        uint256 duration
    );

    /// @notice Is emitted once an aution has ended successfully
    /// @param auctionId The unique ID of the auction
    /// @param tokenID The unique ID of the NFT
    /// @param winnersHighestBid The highest Bid made by an bidder
    /// @param winner The bidder with the highest Bid, thus is the winner of the auction
    event AuctionSuccessful(
        uint256 auctionId,
        uint256 tokenId,
        uint256 winnersHighestBid,
        address winner
    );

    /// @notice Makes the current highestBid made by any bidder in a specific auction accessible
    /// @param auction Refers to the desired auction
    /// @param bidder Refers to the bidder who placed a bid on this auction
    /// @return uint256 The amount of the last bid this specific user has bidden 
    function getBids(_Auction storage auction, address bidder) internal returns (uint256) {
        return auction.bids[bidder];
    }

    /// @notice Sets bid of a bidder to his amount placed in his bid
    /// @param auction Refers to the desired auction
    /// @param bidder Refers to the bidder who placed a bid on this auction
    /// @param bid The amount of the bid this specific user has bidden 
    function setBids(_Auction storage auction, address bidder, uint256 bid) internal {
        auction.bids[bidder] = bid;
    }

    /// @notice Transfers the NFT from seller to smart contract and emits Auction Event, thus starting the timer based on the duration
    /// @param _nftId Refers to the NFT which is placed on the market by this auction
    /// @dev the _auction.startingPrice is currently is without any functionality, but can be used for further implementations
    function makeAuction(uint256 _nftId) public payable {
        nftCollection.transferFrom(msg.sender, address(this), _nftId);
        auctionCount++;
        _Auction storage _auction = auctions[auctionCount];
        _auction.auctionId = auctionCount;
        _auction.nftId = _nftId;    
        _auction.seller = msg.sender;
        _auction.startingPrice = 1;
        _auction.isActive = true;
        _auction.duration = 300;
        _auction.startedAt = block.timestamp;
        _auction.endedAt = block.timestamp + 300;

        emit AuctionCreated(
            auctionCount,
            _nftId,
            auctions[auctionCount].startingPrice,
            auctions[auctionCount].duration
        );
    }

    /// @notice Places a bid on a certain running NFT with a determined amount entered by the user, thus making him the highest bidder
    /// @param _auctionId Refers to a certain auction ID
    /// @return auction Returns the auction struct behind the given auction ID
    
    function fillBid(uint256 _auctionId) public payable {
        _Auction storage _auction = auctions[_auctionId];
        require(_auction.auctionId == _auctionId, "The auction does not exist!"); ///Checks that there is a valid auction
        require(block.timestamp < _auction.endedAt, "The Auction has already ended!"); //Checks that the auction is still running
        require(_auction.seller != msg.sender, "The seller can not place a bid on his own NFT!"); ///Checks that the seller cannot bid on his own NFT

        uint256 newBid = msg.value;
        require(newBid > _auction.highestBid, "value < highest"); //Checks that bid is higher than previous highest bid (see autoBookBack)
        uint256 cumulatedBids = getBids(_auction, msg.sender); 
        setBids(_auction, msg.sender, 0); //Set current Bids of the user on 0 to counter re-entry attacks
        autoBookBack(cumulatedBids, _auctionId); //Book back older bids in case
        setBids(_auction, msg.sender, newBid); //Set current Bids on new Bid
        _auction.highestBidder = msg.sender;
        _auction.highestBid = newBid;
    }

    /// @notice Is called after the auction has ended → if someone bid on the NFT, it is transferred to the highest bidder, else transferred back to the seller
    /// @param _auctionId Refers to a certain auction ID
    /// @dev because there is currently no option to call this funcition automatically when the auction countdown reaches 0, this function is connected to a "Redeem NFT"-Button in the front-end.
    /// @dev further automated functionality could be implemented as Ethereum introduces this possibiliy to call a function from external at a specific time
    /// @return auction Returns the auction struct behind the given auction ID
    function end(uint256 _auctionId) public payable returns (string memory){
        _Auction storage _auction = auctions[_auctionId];
        require(_auction.auctionId == _auctionId, "The auction must exist"); ///Checks that there is a valid auction
        require(block.timestamp >= _auction.endedAt, "not ended"); ///Checks that the timer has already ended
        require(_auction.isActive == true, "The isActive is already set to false!"); ///Checks whether the end-function has alreay been called
        _auction.isActive = false;
        ///If there was a bid, transfer the NFT from the contract to the address of the highest bidder
        if (_auction.highestBidder != address(0)) {
            nftCollection.transferFrom(
                address(this),
                _auction.highestBidder,
                _auction.nftId
            );            
            userFunds[_auction.seller] += _auction.highestBid; ///User funds balance of the seller get the amount of the highest bid. Seller can claim all of his earned funds by calling "claimFunds"-function
        } 
        /// If there was no bid, transfer the NFT from the contract back to the address of the seller
        else {
            nftCollection.transferFrom(
                address(this),
                _auction.seller,
                _auction.nftId
            );  
        }

        emit AuctionSuccessful(
            _auction.auctionId,
            _auction.nftId,
            _auction.highestBid,
            _auction.highestBidder
        );
        return("Auction ended successfully!");
    }

    /// @notice Books back all transfered ether of previous bids in case a new highest bid was submitted 
    /// @param amount The amount placed in the highest bid, before it got overbidden
    /// @param _auctionId Refers to a certain auction ID
    function autoBookBack(uint256 amount, uint256 _auctionId) public {
        setBids(auctions[_auctionId], msg.sender, 0); ///Again set Bids on 0 in case of re-entry attack
        payable(msg.sender).transfer(amount);
    }

    /// Fallback: reverts if Ether is sent to this smart-contract by mistake
    fallback() external {
        revert();
    }
}

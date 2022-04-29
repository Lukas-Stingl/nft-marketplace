// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTCollection.sol";

contract NFTMarketplace {
    uint256 public offerCount;
    mapping(uint256 => _Offer) public offers;
    mapping(address => uint256) public userFunds;
    NFTCollection nftCollection;

    // Offers allow other users (not the owner) to buy the NFT at a fixed price.
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

    event OfferFilled(uint256 offerId, uint256 id, address newOwner);
    event OfferCancelled(uint256 offerId, uint256 id, address owner);
    event ClaimFunds(address user, uint256 amount);

    constructor(address _nftCollection) {
        nftCollection = NFTCollection(_nftCollection);
    }

    /// @notice Sets the price at which the NFT can be bought from other users.
    /// @param _id The token id of the NFT.
    /// @param _price The price at which the NFT can be bought.
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

    /// @notice The sender buys a NFT from the offers list.
    /// @param _offerId The id of the offer which the user wants to buy.
    function fillOffer(uint256 _offerId) public payable {
        _Offer storage _offer = offers[_offerId];
        require(_offer.offerId == _offerId, "The offer must exist");
        require(
            _offer.user != msg.sender,
            "The owner of the offer cannot fill it"
        );
        require(!_offer.fulfilled, "An offer cannot be fulfilled twice");
        require(!_offer.cancelled, "A cancelled offer cannot be fulfilled");
        require(
            msg.value == _offer.price,
            "The ETH amount should match with the NFT Price"
        );
        nftCollection.transferFrom(address(this), msg.sender, _offer.id);
        _offer.fulfilled = true;
        userFunds[_offer.user] += msg.value;
        emit OfferFilled(_offerId, _offer.id, msg.sender);
    }

    /// @notice Cancel an offer from the offers list. Only available to the owner of the offer.
    /// @param _offerId The id of the offer which the user wants to cancel.
    function cancelOffer(uint256 _offerId) public {
        _Offer storage _offer = offers[_offerId];
        require(_offer.offerId == _offerId, "The offer must exist");
        require(
            _offer.user == msg.sender,
            "The offer can only be canceled by the owner"
        );
        require(
            _offer.fulfilled == false,
            "A fulfilled offer cannot be cancelled"
        );
        require(
            _offer.cancelled == false,
            "An offer cannot be cancelled twice"
        );
        nftCollection.transferFrom(address(this), msg.sender, _offer.id);
        _offer.cancelled = true;
        emit OfferCancelled(_offerId, _offer.id, msg.sender);
    }

    /// @notice The user can withdraw their funds made by selling NFT.
    /// @dev Not implemented in UI yet.
    function claimFunds() public {
        require(
            userFunds[msg.sender] > 0,
            "This user has no funds to be claimed"
        );
        payable(msg.sender).transfer(userFunds[msg.sender]);
        emit ClaimFunds(msg.sender, userFunds[msg.sender]);
        userFunds[msg.sender] = 0;
    }

    // Fallback: reverts if Ether is sent to this smart-contract by mistake
    fallback() external {
        revert();
    }

    //<-------------------------Just import Contracts as a whole---------------------------------------->

    uint256 public auctionCount;
    uint256 public endingPrice;
    mapping(uint256 => _Auction) public auctions;

    struct _Auction {
        // Id of auction
        uint256 auctionId;
        //Id of NFT
        uint256 nftId;
        // Current owner of NFT
        address seller;
        // Price at beginning of auction
        uint256 startingPrice;
        // Duration (in seconds) of auction
        uint64 duration;
        // Time when auction started
        // NOTE: 0 if this auction has been concluded
        uint256 startedAt;
        //end time of auction
        uint256 endedAt;
        //current state of auction
        bool isActive;
        //current highest bidder
        address highestBidder;
        //current highest bid
        uint256 highestBid;
        mapping(address => uint256) bids;
    }

    event AuctionCreated(
        uint256 auctionId,
        uint256 tokenId,
        uint256 startingPrice,
        uint256 duration
    );
    event AuctionSuccessful(
        uint256 auctionId,
        uint256 tokenId,
        uint256 totalPrice,
        address winner
    );
    event AuctionCancelled(uint256 tokenId); //not implemented yet?
    event End(address bidder, uint256 withdrawalAmount); //not implemented yet?
    event GotOverbidden(uint256 auctionId, address user);
/** getBids returns cumulated bids of the bidder */
    function getBids(_Auction storage auction, address bidder)
        internal
        returns (uint256)
    {
        return auction.bids[bidder];
    }
/** setBids updates bids for bidder  */
    function setBids(
        _Auction storage auction,
        address bidder,
        uint256 bid
    ) internal {
        auction.bids[bidder] = bid;
    }

    function checkIfHighestBidder(uint256 _auctionId) internal {
        _Auction storage _auction = auctions[_auctionId];
        uint256 currentCummulatedBids = getBids(_auction, msg.sender);
        if (currentCummulatedBids > 0 && _auction.highestBidder != msg.sender)
            emit GotOverbidden(_auctionId, msg.sender);
    }
/** make auction creates the auction struct and starts the timer */
    function makeAuction(uint256 _id) public payable {
        //require(msg.sender == seller, "not seller");
        nftCollection.transferFrom(msg.sender, address(this), _id);
        auctionCount++;
        _Auction storage _auction = auctions[auctionCount];
        _auction.auctionId = auctionCount;
        _auction.nftId = _id;
        _auction.seller = msg.sender;
        _auction.startingPrice = 1;
        //duration fixed 5 minutes = 300 seconds
        _auction.isActive = true;
        _auction.duration = 300;
        _auction.startedAt = block.timestamp;
        _auction.endedAt = block.timestamp + 300;
        //true,

        emit AuctionCreated(
            auctionCount,
            _id,
            auctions[auctionCount].startingPrice,
            auctions[auctionCount].duration
        );
    }

/** getAuction is used to get details about the auction and check if the current user has been overbidden (if true emit Event) */
    function getAuction(uint256 _auctionId)
        public
        returns (
            address,
            uint256,
            uint256,
            uint256,
            bool,
            address,
            uint256
        )
    {
        checkIfHighestBidder(_auctionId);
        _Auction storage _auction = auctions[_auctionId];
        //uint256 auctionId = _auction.auctionId; //not neccessary
        address auctionSeller = _auction.seller;
        uint256 auctionStartingPrice = _auction.startingPrice;
        //duration fixed 5 minutes = 300 seconds
        uint256 auctionDuration = _auction.duration;
        uint256 auctionEndetAt = _auction.endedAt;
        bool auctionIsActive = _auction.isActive;
        address highestBidder = _auction.highestBidder;
        uint256 highestBid = _auction.highestBid;

        return (
            auctionSeller,
            auctionStartingPrice,
            auctionDuration,
            auctionEndetAt,
            auctionIsActive,
            highestBidder,
            highestBid
        );
    }

/** fillBid is used to update the auction struct, if someone overbid the current bid */
    function fillBid(uint256 _auctionId) public payable {
        _Auction storage _auction = auctions[_auctionId];
        require(_auction.auctionId == _auctionId, "The auction must exist");
        require(block.timestamp < _auction.endedAt, "ended");
        //create a new Bid for this auction
        // _Bids storage bids = bids[_auctionId];

        // calculate the user's total bid based on the current amount they've sent to the contract plus whatever has
        // been sent with this transaction
        uint256 newBid = msg.value;
        require(newBid > _auction.highestBid, "value < highest");
        uint256 cumulatedBids = getBids(_auction, msg.sender);
        //set current Bids on 0 to counter re-entry attacks
        setBids(_auction, msg.sender, 0);
        //book back older bids in case
        autoBookBack(cumulatedBids, _auctionId);
        //set current Bids on new Bid
        setBids(_auction, msg.sender, newBid);
        _auction.highestBidder = msg.sender;
        _auction.highestBid = newBid;
    }

/** end is called after the auction has ended → if someone bid on the nft, it is transferred to the highest bidder, else transferred back to the seller */
    function end(uint256 _auctionId) external {
        _Auction storage _auction = auctions[_auctionId];
        require(_auction.auctionId == _auctionId, "The auction must exist");
        require(block.timestamp >= _auction.endedAt, "not ended");
        if (_auction.highestBidder != address(0)) {
            nftCollection.transferFrom(
                address(this),
                _auction.highestBidder,
                _auction.auctionId
            );
            //seller.transfer(highestBid);
        } else {
            nftCollection.transferFrom(
                address(this),
                _auction.seller,
                _auction.auctionId
            );
        }

        emit AuctionSuccessful(
            _auction.auctionId,
            _auction.nftId,
            _auction.highestBid,
            _auction.highestBidder
        );
    }

/** autoBookBack books back all transfered ether of previous bids in case a new bid is made */
    function autoBookBack(uint256 amount, uint256 _auctionId) public {
        //again set Bids on 0 in case of re-entry attack
        setBids(auctions[_auctionId], msg.sender, 0);
        payable(msg.sender).transfer(amount);

        emit End(msg.sender, amount);
    }
/** withdraw allows overbidden users to withdraw their cumulated bids  */
    function withdraw(uint256 _auctionId) public {
        _Auction storage _auction = auctions[_auctionId];
        require(msg.sender != _auction.highestBidder);
        uint256 amount = getBids(auctions[_auctionId], msg.sender);
        setBids(auctions[_auctionId], msg.sender, 0);
        payable(msg.sender).transfer(amount);

        emit End(msg.sender, amount);
    }

    // require(
    //     _offer.user != msg.sender,
    //     "The owner of the offer cannot fill it"
    // );
    // require(!_offer.fulfilled, "An offer cannot be fulfilled twice");
    // require(!_offer.cancelled, "A cancelled offer cannot be fulfilled");
    // require(
    //     msg.value == _offer.price,
    //     "The ETH amount should match with the NFT Price"
    // );
    // nftCollection.transferFrom(address(this), msg.sender, _offer.id);
    // _offer.fulfilled = true;
    // userFunds[_offer.user] += msg.value;
    // emit OfferFilled(_offerId, _offer.id, msg.sender);
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTCollection.sol";

contract NFTMarketplace {
    
    uint256 public bidCount;
    uint256 public offerCount;
    mapping(uint256 => _Bid) public bids;
    mapping(uint256 => _Offer) public offers;
    mapping(address => uint256) public userFunds;
    NFTCollection nftCollection;

//Parameters of the NFTAuction
    address public beneficiary;
    uint public auctionEndTime = now + 240; //actually hardcoded, could be determined by the seller in the future
  //Current state of the auctionEndTime
    address public highestBidder;
    uint public highestBid;
    mapping(address => uint) public pendingReturns;
    bool ended = false;

    event HighestBidIncrease(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount); //do I need this or can I relay on the given functions by the template
    event AuctionExecuted (uint bidId, uint256 id, address newOwner);


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
    // Bids allow other users (not the owner) to place a bid for an NFT.
    struct _Bid {
        uint256 bidId;
        uint256 id;
        address user;
        uint256 bidPrice;
        bool executed;
        bool cancelled;
    }

    event Bid(
        uint256 bidId,
        uint256 id,
        address user,
        uint256 bidPrice,
        bool executed,
        bool cancelled
    );

  constructor(address _nftCollection) {
    nftCollection = NFTCollection(_nftCollection);
  }
  
  function makeOffer(uint _id, uint _price) public {
    nftCollection.transferFrom(msg.sender, address(this), _id);
    offerCount ++;
    offers[offerCount] = _Offer(offerCount, _id, msg.sender, _price, false, false);
    emit Offer(offerCount, _id, msg.sender, _price, false, false);
  }

  function fillOffer(uint _offerId) public payable {
    _Offer storage _offer = offers[_offerId];
    require(_offer.offerId == _offerId, 'The offer must exist');
    require(_offer.user != msg.sender, 'The owner of the offer cannot fill it');
    require(!_offer.fulfilled, 'An offer cannot be fulfilled twice');
    require(!_offer.cancelled, 'A cancelled offer cannot be fulfilled');
    require(msg.value == _offer.price, 'The ETH amount should match with the NFT Price');
    nftCollection.transferFrom(address(this), msg.sender, _offer.id);
    _offer.fulfilled = true;
    userFunds[_offer.user] += msg.value;
    emit OfferFilled(_offerId, _offer.id, msg.sender);
  }

  function cancelOffer(uint _offerId) public {
    _Offer storage _offer = offers[_offerId];
    require(_offer.offerId == _offerId, 'The offer must exist');
    require(_offer.user == msg.sender, 'The offer can only be canceled by the owner');
    require(_offer.fulfilled == false, 'A fulfilled offer cannot be cancelled');
    require(_offer.cancelled == false, 'An offer cannot be cancelled twice');
    nftCollection.transferFrom(address(this), msg.sender, _offer.id);
    _offer.cancelled = true;
    emit OfferCancelled(_offerId, _offer.id, msg.sender);
  }

    function makeAuction(uint256 _id, uint256 _time) public {
        nftCollection.transferFrom(msg.sender, address(this), _id);
        auctionCount++;
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
    function makeBid(uint _id, uint256 _bidPrice) public {
        if (block.timestamp > auctionEndTime) {
            revert("The auction has already ended");
        }

        if (msg.value <= highestBid) {
            revert("There is already a higher or equal bid");
        }
        //User will be able to get back the value he has bid
        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }
       nftCollection.transferFrom(beneficiary, msg.sender, _id);
        bidCount++;
        bids[bidCount] = _Bid(
            bidCount,
            _id,
            beneficiary,
            _bidPrice,
            false,
            false
        );
        emit Bid(bidCount, _id, beneficiary, _bidPrice, false, false);
       
        //The new highest bidder is set with its bid
        highestBidder = msg.sender;
        highestBid = msg.value;
        emit HighestBidIncrease(msg.sender, msg.value);
    }

    function auctionEnd() public {
        if (block.timestamp < auctionEndTime){
            revert ("The auction has not ended yet");
        }
        if (ended) {
            revert("The funcion auctionEnded has already been called");
        }   

        ended = true;

        emit AuctionEnded(highestBidder, highestBid);
    }


    function executeAuction(uint _bidId) public payable {
        _Bid storage _bid = bids[_bidsId];
        require(ended, console.log("The auction has not ended yet!")
        );
        require(
            msg.value == highestBid,
            "The ETH amount should match with the highest bid for the NFT"
        );

        nftCollection.transferFrom(beneficiary, highestBidder, _bid.id);
        _bid.executed = true;
        userFunds[_bid.beneficiary] += msg.value;
        emit AuctionExecuted(_bidId, _bid.id, highestBidder);
    }
    }

//Cancel of a running auction is not implemented yet

    /// @notice The sender buys a NFT from the offers list.
    /// @param _offerId The id of the offer which the user wants to buy.
    /// @return void Only emits an Event
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

  // Fallback: reverts if Ether is sent to this smart-contract by mistake
  fallback () external {
    revert();
  }
}
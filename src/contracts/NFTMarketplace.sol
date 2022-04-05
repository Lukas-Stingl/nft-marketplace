// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./NFTCollection.sol";

contract NFTMarketplace {
    uint256 public offerCount;
    mapping(uint256 => _Offer) public offers;
    mapping(address => uint256) public userFunds;
    mapping(address => user) public userlist;
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

    function findUsername(address _address)
        public
        view
        returns (string memory)
    {
        return userlist[_address]._userName;
    }

    function createUser(address _address, string _userName ) public {
        // Check that the user did not already exist:
        require(!userlist[_address].set);
        //Store the user
        userlist[_address] = user({_userName: _userName, _address: _address, set: true});
    }

    struct user {
        string _userName;
        address _address;
        bool set; 
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
}

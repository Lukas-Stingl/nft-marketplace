// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// Inheritence of the ERC-721 Non-Fungible Token Standard from Ethereum
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/// @title A smart contract which is responsible for mapping and creating an NFT on the blockchain
/// @notice This contract provides you with functionalities regarding Non-Fungible Tokens (NFTs)
contract NFTCollection is ERC721, ERC721Enumerable {
  string[] public tokenURIs;
  mapping(string => bool) _tokenURIExists;
  mapping(uint => string) _tokenIdToTokenURI;

  constructor() 
    ERC721("mTC Collection", "mTC") 
  {
  }


  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
  
  /// @notice Responsible for getting the IPFS hash from the blockchain to a corresponding NFT
  /// @param tokenId ID of a token
  /// @return string IPFS hahs string from the blockchain
  function tokenURI(uint256 tokenId) public override view returns (string memory) {
    require(_exists(tokenId), 'ERC721Metadata: URI query for nonexistent token');
    return _tokenIdToTokenURI[tokenId];
  }

  /// @notice Saves and stores  the Token URI of the NFT in the blockchain
  /// @param _tokenURI URI of a token
  /// @dev token URI consists of the unique hash value, returned from IPFS, when uploading a file
  function safeMint(string memory _tokenURI) public {
    require(!_tokenURIExists[_tokenURI], 'The token URI should be unique');
    tokenURIs.push(_tokenURI);    
    uint _id = tokenURIs.length;
    _tokenIdToTokenURI[_id] = _tokenURI;
    _safeMint(msg.sender, _id);
    _tokenURIExists[_tokenURI] = true;
  }
}
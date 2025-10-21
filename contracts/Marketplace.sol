// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Marketplace
 * @dev Sàn giao dịch NFT cơ bản (mua bán bằng ETH)
 */
contract Marketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 price;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;

    event NFTListed(address indexed nft, uint256 indexed tokenId, address seller, uint256 price);
    event NFTSold(address indexed nft, uint256 indexed tokenId, address buyer, uint256 price);
    event NFTUnlisted(address indexed nft, uint256 indexed tokenId);

    function listNFT(address nftAddress, uint256 tokenId, uint256 price) external nonReentrant {
        require(price > 0, "Price must be > 0");
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(
            nft.isApprovedForAll(msg.sender, address(this)) || nft.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        listings[nftAddress][tokenId] = Listing(msg.sender, price);
        emit NFTListed(nftAddress, tokenId, msg.sender, price);
    }

    function buyNFT(address nftAddress, uint256 tokenId) external payable nonReentrant {
        Listing memory item = listings[nftAddress][tokenId];
        require(item.price > 0, "NFT not listed");
        require(msg.value >= item.price, "Insufficient payment");

        delete listings[nftAddress][tokenId];
        payable(item.seller).transfer(item.price);
        IERC721(nftAddress).safeTransferFrom(item.seller, msg.sender, tokenId);

        emit NFTSold(nftAddress, tokenId, msg.sender, item.price);
    }

    function unlistNFT(address nftAddress, uint256 tokenId) external nonReentrant {
        Listing memory item = listings[nftAddress][tokenId];
        require(item.seller == msg.sender, "Not seller");
        delete listings[nftAddress][tokenId];
        emit NFTUnlisted(nftAddress, tokenId);
    }
}

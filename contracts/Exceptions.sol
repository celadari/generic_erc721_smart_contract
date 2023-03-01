// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

library Exceptions {
    // accessing tokens
    error TokenIndexOutOfBounds();
    error OwnerIndexOutOfBounds();
    error OwnerQueryForNonexistentToken();
    error UnableGetTokenOwnerByIndex();

    // minting
    error NotEnoughFunds();
    error TokensSoldOut();
    error OnlyBuyerCanSendVoucher();
    error MintToZeroAddress();
    error MintZeroQuantity();

    // voucher validation
    error UnauthorizedMintSigner();
    error InvalidVoucher();

    // approve transfer
    error ApprovalCallerNotOwnerNorApproved();
    error ApprovalQueryForNonexistentToken();
    error ApproveToCaller();
    error ApprovalToCurrentOwner();

    // transfer
    error BalanceQueryForZeroAddress();
    error TransferCallerNotOwnerNorApproved();
    error TransferFromIncorrectOwner();
    error TransferToNonERC721ReceiverImplementer();
    error TransferToZeroAddress();

    // merkle proof validation
    error MerkleProofInvalid();
    error MerkleProofsArrayAndRevealDataNotSameLength();
    error SenderMerkleProofIsNotOwnerOfToken();
}
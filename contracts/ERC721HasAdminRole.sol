// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/AccessControl.sol';


abstract contract ERC721HasAdminRole is AccessControl {

    bytes32 public constant ADMIN_ROLE = keccak256('ADMIN_ROLE');

    constructor() {
        _setRoleAdmin(ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    }

    function supportsInterface(bytes4 interfaceId) public virtual view override(AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
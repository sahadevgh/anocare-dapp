// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AnocareToken is ERC20 {
    constructor() ERC20("Anocare Token", "ANO") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals()); // Mint 1M ANO to deployer
    }
}

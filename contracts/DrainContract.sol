// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./DuckToken.sol";

contract DrainContract is Ownable {
	
	// DUCK TOKEN
	DuckToken public duck;
	address public controllerAddress;
	
	constructor(address _duckTokenAddress, address _controllerAddress) public {
		duck = DuckToken(_duckTokenAddress);
		controllerAddress = _controllerAddress;
		duck.approve(_controllerAddress, uint(-1));
	}

	function withdraw(address tokenAddress) public onlyOwner {
		if(tokenAddress == address(0)) {
			msg.sender.transfer(address(this).balance);
			return;
		}

		IERC20(tokenAddress).transfer(msg.sender, IERC20(tokenAddress).balanceOf(address(this)));
	}
	
}
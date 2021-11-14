// SPDX-Licence-Identifier: UNLICENCED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract wavePortal {
    uint256 totalWaves; //state variable
    uint private seed; // for random number generation

    //constructor() {
    //    console.log("O hi Mark!");
    //}

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        uint256 timestamp;
        string message;
    }
    Wave[] waves;

    // store the user's address with the last time they waved
    mapping(address => uint256) public lastWavedAt;

    constructor() payable{
        console.log("I AM ALIVE!!");        
    }

    function wave(string memory _message) public {
        // make sure current timestamp is at leat 30 seconds away from previous one
        require (lastWavedAt[msg.sender] + 30 seconds < block.timestamp, "Please wait 30 seconds");
        // update the current user's timestamp
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        console.log("%s has waved!", msg.sender);

        // store wave data in the array
        waves.push(Wave(msg.sender, block.timestamp, _message));
        
        uint256 randomNumber = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %s", randomNumber);

        seed = randomNumber;

        // give a 50% chance that the user wins
         if (randomNumber < 50) {
            console.log("%s won!", msg.sender);

            uint256 prizeAmount = 0.0005 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _message);
    }
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have received %d total waves!", totalWaves);
        return totalWaves;
    }
}
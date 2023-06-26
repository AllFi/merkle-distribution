// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@1inch/solidity-utils/contracts/libraries/SafeERC20.sol";
// import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

import "./interfaces/ICumulativeMerkleDropZkBob.sol";
import "./zkbob/IZkBobDirectDeposits.sol";

contract CumulativeMerkleDropZkBob is Ownable, ICumulativeMerkleDropZkBob {
    using SafeERC20 for IERC20;
    // using MerkleProof for bytes32[];

    address public immutable override token;
    address public immutable dd;

    bytes32 public override merkleRoot;
    mapping(bytes => uint256) public cumulativeClaimed;

    constructor(address token_, address dd_) {
        token = token_;
        dd = dd_;
    }

    function setMerkleRoot(bytes32 merkleRoot_) external override onlyOwner {
        emit MerkelRootUpdated(merkleRoot, merkleRoot_);
        merkleRoot = merkleRoot_;
    }

    function claim(
        bytes memory zkAddress,
        uint256 cumulativeAmount,
        bytes32 expectedMerkleRoot,
        bytes32[] calldata merkleProof
    ) external override {
        require(merkleRoot == expectedMerkleRoot, "CMD: Merkle root was updated");

        // Verify the merkle proof
        bytes32 leaf = keccak256(abi.encodePacked(zkAddress, cumulativeAmount));
        require(_verifyAsm(merkleProof, expectedMerkleRoot, leaf), "CMD: Invalid proof");

        // Mark it claimed
        uint256 preclaimed = cumulativeClaimed[zkAddress];
        require(preclaimed < cumulativeAmount, "CMD: Nothing to claim");
        cumulativeClaimed[zkAddress] = cumulativeAmount;

        // Send the token
        unchecked {
            uint256 amount = cumulativeAmount - preclaimed;
            IERC20(token).approve(dd, amount);
            IZkBobDirectDeposits(dd).directDeposit(msg.sender, amount, zkAddress);
            emit Claimed(zkAddress, amount);
        }
    }

    // function verify(bytes32[] calldata merkleProof, bytes32 root, bytes32 leaf) public pure returns (bool) {
    //     return merkleProof.verify(root, leaf);
    // }

    function _verifyAsm(bytes32[] calldata proof, bytes32 root, bytes32 leaf) private pure returns (bool valid) {
        /// @solidity memory-safe-assembly
        assembly {  // solhint-disable-line no-inline-assembly
            let ptr := proof.offset

            for { let end := add(ptr, mul(0x20, proof.length)) } lt(ptr, end) { ptr := add(ptr, 0x20) } {
                let node := calldataload(ptr)

                switch lt(leaf, node)
                case 1 {
                    mstore(0x00, leaf)
                    mstore(0x20, node)
                }
                default {
                    mstore(0x00, node)
                    mstore(0x20, leaf)
                }

                leaf := keccak256(0x00, 0x40)
            }

            valid := eq(root, leaf)
        }
    }
}

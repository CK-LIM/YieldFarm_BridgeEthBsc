pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import './IToken.sol';

contract BridgeBase {
  address public admin;
  IToken public token;
  mapping(address => mapping(uint => bool)) public processedNonces;

  enum Step { Burn, Mint }
  event Transfer(
    address from,
    address to,
    uint amount,
    uint date,
    uint nonce,
    bytes signature,
    Step indexed step
  );

  constructor(address _token) {
    admin = msg.sender;
    token = IToken(_token);
  }

  function burn(address to, uint amount, uint nonce, bytes calldata signature) external {
    require(processedNonces[msg.sender][nonce] == false, 'transfer already processed');
    processedNonces[msg.sender][nonce] = true;
    token.burn(msg.sender, amount);
    emit Transfer(
      msg.sender,
      to,
      amount,
      block.timestamp,
      nonce,
      signature,
      Step.Burn
    );
  }

  function mint(
    address from, 
    address to, 
    uint amount, 
    uint nonce,
    bytes calldata signature
  ) external {
    // bytes32 message = prefixed(keccak256(abi.encodePacked(from, to, amount, nonce)));
    bytes32 message = keccak256(abi.encodePacked(from, to, amount, nonce));
    require(recoverSigner(message, signature) == from , 'wrong signature');
    require(processedNonces[from][nonce] == false, 'transfer already processed');
    processedNonces[from][nonce] = true;
    token.mint(to, amount);
    emit Transfer(
      from,
      to,
      amount,
      block.timestamp,
      nonce,
      signature,
      Step.Mint
    );
  }

  // function prefixed(bytes32 hash) internal pure returns (bytes32) {
  //   return keccak256(abi.encodePacked(
  //     '\x19Ethereum Signed Message:\n32', 
  //     hash
  //   ));
  // }

// Verfication with account private key without 0x in front(dfsd..) signing

  // function recoverSigner(bytes32 message, bytes memory sig)
  //   internal
  //   pure
  //   returns (address)
  // {
  //   uint8 v;
  //   bytes32 r;
  //   bytes32 s;
  
  //   (v, r, s) = splitSignature(sig);
  
  //   return ecrecover(message, v, r, s);
  // }

  // function splitSignature(bytes memory sig)
  //   internal
  //   pure
  //   returns (uint8, bytes32, bytes32)
  // {
  //   require(sig.length == 65);
  
  //   bytes32 r;
  //   bytes32 s;
  //   uint8 v;
  
  //   assembly {
  //       // first 32 bytes, after the length prefix
  //       r := mload(add(sig, 32))
  //       // second 32 bytes
  //       s := mload(add(sig, 64))
  //       // final byte (first byte of the next 32 bytes)
  //       v := byte(0, mload(add(sig, 96)))
  //   }
  
  //   return (v, r, s);
  // }

// Verfication with account address(0x..) signing

  function recoverSigner(bytes32 message, bytes memory sig)
    internal
    pure
    returns (address)
  {
    bytes32 r;
    bytes32 s;
    uint8 v;
  
    // Check the signature length
    if (sig.length != 65) {
      return (address(0));
    }

    assembly {
        // first 32 bytes, after the length prefix
        r := mload(add(sig, 0x20))
        // second 32 bytes
        s := mload(add(sig, 0x40))
        // final byte (first byte of the next 32 bytes)
        v := byte(0, mload(add(sig, 0x60)))
    }
    // Version of signature should be 27 or 28, but 0 and 1 are also possible versions
    if (v < 27) {
      v += 27;
    }  

        // If the version is correct return the signer address
    if (v != 27 && v != 28) {
      return (address(0));
    } else {
      // solium-disable-next-line arg-overflow
      return ecrecover(message, v, r, s);
    }
  }

}
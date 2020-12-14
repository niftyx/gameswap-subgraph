import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Token } from "../../generated/schema";
import { ERC721 } from "../../generated/Test721/ERC721";
import { ZERO } from "../utils/number";

export function getOrCreateToken(address: Address, timestamp: BigInt): Token {
  let token = Token.load(address.toHexString());
  if (token != null) {
    return token as Token;
  }

  return upsertToken(address, timestamp);
}

export function upsertToken(address: Address, timestamp: BigInt): Token {
  let token = new Token(address.toHexString());
  let contract = ERC721.bind(address);

  token.address = address;
  token.name = contract.name();
  token.symbol = contract.symbol();
  token.totalSupply = contract.totalSupply();
  token.totalMinted = ZERO;
  token.totalBurned = ZERO;
  token.createTimeStamp = timestamp;
  token.save();

  return token;
}

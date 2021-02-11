import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Token, TokenHistory } from "../../generated/schema";
import { ERC721 } from "../../generated/templates/Test721/ERC721";
import { ZERO } from "../utils/number";
import { ZERO_ADDRESS } from "../utils/token";

export function getToken(address: Address): Token {
  let token = Token.load(address.toHex());
  if (token != null) {
    return token as Token;
  }
  return null;
}

export function upsertToken(
  address: Address,
  timestamp: BigInt,
  name: string,
  symbol: string,
  imageURL: string,
  description: string,
  shortUrl: string
): Token {
  let token = new Token(address.toHex());
  let contract = ERC721.bind(address);

  token.address = address;
  token.name = name;
  token.symbol = symbol;
  token.imageUrl = imageURL;
  token.description = description;
  token.shortUrl = shortUrl;
  token.totalSupply = contract.totalSupply();
  token.totalMinted = ZERO;
  token.totalBurned = ZERO;
  token.createTimeStamp = timestamp;
  token.owner = ZERO_ADDRESS;
  token.updateTimeStamp = timestamp;
  token.save();

  let tokenHistory = new TokenHistory(timestamp.toString());
  tokenHistory.owner = ZERO_ADDRESS;
  tokenHistory.timestamp = timestamp;
  tokenHistory.token = token.id;
  tokenHistory.save();

  return token;
}

export function updateTokenMetaData(
  address: Address,
  imageURL: string,
  description: string,
  shortUrl: string,
  timestamp: BigInt
): Token {
  let token = Token.load(address.toHex());
  if (token != null) {
    token.imageUrl = imageURL;
    token.description = description;
    token.shortUrl = shortUrl;
    token.updateTimeStamp = timestamp;
    token.save();
    return token as Token;
  }
  return null;
}

export function updateTokenOwner(
  address: Address,
  owner: Address,
  timestamp: BigInt
): Token {
  let token = Token.load(address.toHex());
  if (token != null) {
    token.owner = owner.toHex();
    token.updateTimeStamp = timestamp;
    token.save();

    let tokenHistory = new TokenHistory(timestamp.toString());
    tokenHistory.owner = owner.toHex();
    tokenHistory.timestamp = timestamp;
    tokenHistory.token = token.id;
    tokenHistory.save();

    return token as Token;
  }
  return null;
}

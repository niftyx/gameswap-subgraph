import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Token } from "../../generated/schema";
import { ERC721 } from "../../generated/templates/Test721/ERC721";
import { ZERO } from "../utils/number";

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
  token.save();

  return token;
}

export function updateTokenMetaData(
  address: Address,
  imageURL: string,
  description: string,
  shortUrl: string
): Token {
  let token = Token.load(address.toHex());
  if (token != null) {
    token.imageUrl = imageURL;
    token.description = description;
    token.shortUrl = shortUrl;
    token.save();
    return token as Token;
  }
  return null;
}

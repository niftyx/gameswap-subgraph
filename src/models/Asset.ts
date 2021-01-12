import { BigInt } from "@graphprotocol/graph-ts";
import { Asset, Token, Account } from "../../generated/schema";

export function loadAsset(tokenId: BigInt): Asset {
  let assetId = tokenId.toHex();
  let existingAsset = Asset.load(assetId);

  if (existingAsset != null) {
    return existingAsset as Asset;
  }
  return null;
}

export function getOrCreateAsset(
  tokenId: BigInt,
  token: Token,
  owner: Account,
  timestamp: BigInt
): Asset {
  let assetId = tokenId.toHex();
  let existingAsset = Asset.load(assetId);

  if (existingAsset != null) {
    return existingAsset as Asset;
  }

  let newAsset = new Asset(assetId);
  newAsset.assetId = tokenId;
  newAsset.assetURL = "";
  newAsset.token = token.id;
  newAsset.currentOwner = owner.id;
  newAsset.createTimeStamp = timestamp;
  newAsset.updateTimeStamp = timestamp;

  newAsset.save();

  return newAsset;
}

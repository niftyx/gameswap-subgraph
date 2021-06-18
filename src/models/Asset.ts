import { ERC721 } from "./../../generated/templates/Gswap721/ERC721";
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Asset, Collection, User } from "../../generated/schema";

export function loadAsset(id: BigInt): Asset | null {
  let assetId = id.toHex();
  let existingAsset = Asset.load(assetId);

  if (existingAsset != null) {
    return existingAsset as Asset;
  }
  return null;
}

export function createAsset(
  id: BigInt,
  collection: Collection,
  user: User,
  timestamp: BigInt
): Asset {
  let assetId = id.toHex();
  let existingAsset = Asset.load(assetId);

  if (existingAsset != null) {
    return existingAsset as Asset;
  }

  let newAsset = new Asset(assetId);
  newAsset.assetId = id;

  let erc721 = ERC721.bind(
    Address.fromString(collection.address.toHexString())
  );

  newAsset.assetUrl = erc721.tokenURI(id);
  newAsset.owner = user.id;
  newAsset.ownerId = user.id;

  newAsset.collection = collection.id;

  newAsset.createTimeStamp = timestamp;
  newAsset.updateTimeStamp = timestamp;

  newAsset.save();

  return newAsset as Asset;
}

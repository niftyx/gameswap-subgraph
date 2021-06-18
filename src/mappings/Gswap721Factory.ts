import { CollectionCreated } from "../../generated/Gswap721Factory/Gswap721Factory";
import { createCollection } from "../models/Collection";
import { Gswap721 } from "../../generated/templates";
import { ZERO_ADDRESS } from "../utils/token";
import { getOrCreateUser } from "../models/User";
import { Bytes } from "@graphprotocol/graph-ts";
import { ONE } from "../utils/number";

export function handleNewCollection(event: CollectionCreated): void {
  let params = event.params;

  let user = getOrCreateUser(
    Bytes.fromHexString(ZERO_ADDRESS) as Bytes,
    event.block.timestamp
  );

  createCollection(
    event.params.tokenAddress,
    event.block.timestamp,
    params.name,
    params.symbol,
    params.url,
    params.gamdId,
    params.isPrivate,
    user
  );

  user.collectionCount = user.collectionCount.plus(ONE);
  user.save();

  Gswap721.create(event.params.tokenAddress);
}

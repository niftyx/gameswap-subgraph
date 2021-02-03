import { Token } from "../../generated/schema";
import { CollectionCreated } from "../../generated/TestFactory/TestFactory";
import { upsertToken } from "../models/Token";
import { Test721 } from "../../generated/templates";

export function handleNewToken(event: CollectionCreated): void {
  let params = event.params;

  upsertToken(
    event.params.tokenAddress,
    event.block.timestamp,
    params.name,
    params.symbol,
    params.imageURL,
    params.description,
    params.shortUrl
  );

  Test721.create(event.params.tokenAddress);
}

import { Cancel, Fill } from "../../generated/Exchange/Exchange";
import { Asset, ZeroXOrder } from "../../generated/schema";
import { mapZeroXOrderType, ZeroXOrderType } from "../utils/enum";

export function createFillOrder(asset: Asset, event: Fill): void {
  let params = event.params;
  let order = new ZeroXOrder(params.orderHash.toHex());
  order.asset = asset.id;
  order.type = mapZeroXOrderType(ZeroXOrderType.Filled);
  order.maker = params.makerAddress;
  order.feeRecipient = params.feeRecipientAddress;
  order.makerAssetData = params.makerAssetData;
  order.takerAssetData = params.takerAssetData;
  order.sender = params.senderAddress;
  order.orderHash = params.orderHash;
  order.createTimeStamp = event.block.timestamp;
  order.txHash = event.transaction.hash;

  order.taker = (event as Fill).params.takerAddress;
  order.sender = (event as Fill).params.takerAddress;
  order.makerAssetFilledAmount = (event as Fill).params.makerAssetFilledAmount;
  order.takerAssetFilledAmount = (event as Fill).params.takerAssetFilledAmount;
  order.makerFeePaid = (event as Fill).params.makerFeePaid;
  order.protocolFeePaid = (event as Fill).params.protocolFeePaid;

  order.save();
}

export function createCancelOrder(asset: Asset, event: Cancel): void {
  let params = event.params;
  let order = new ZeroXOrder(params.orderHash.toHex());
  order.asset = asset.id;
  order.type = mapZeroXOrderType(ZeroXOrderType.Cancelled);
  order.maker = params.makerAddress;
  order.feeRecipient = params.feeRecipientAddress;
  order.makerAssetData = params.makerAssetData;
  order.takerAssetData = params.takerAssetData;
  order.sender = params.senderAddress;
  order.orderHash = params.orderHash;
  order.createTimeStamp = event.block.timestamp;
  order.txHash = event.transaction.hash;

  order.save();
}

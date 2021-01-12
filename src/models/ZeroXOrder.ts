import { Cancel, Fill } from "../../generated/Exchange/Exchange";
import { Asset, ZeroXOrder } from "../../generated/schema";
import { ZeroXOrderType } from "../utils/enum";

export function createOrder(
  asset: Asset,
  type: ZeroXOrderType,
  event: Fill | Cancel
) {
  const { params } = event;
  let order = new ZeroXOrder(params.orderHash.toHex());
  order.asset = asset.id;
  order.type = type.toString();
  order.maker = params.makerAddress;
  order.feeRecipient = params.feeRecipientAddress;
  order.makerAssetData = params.makerAssetData;
  order.takerAssetData = params.takerAssetData;
  order.sender = params.senderAddress;
  order.orderHash = params.orderHash;
  order.createTimeStamp = event.block.timestamp;
  order.txHash = event.transaction.hash;
  if (type === ZeroXOrderType.Filled) {
    // Fill

    order.taker = (event as Fill).params.takerAddress;
    order.sender = (event as Fill).params.takerAddress;
    order.makerAssetFilledAmount = (event as Fill).params.makerAssetFilledAmount;
    order.takerAssetFilledAmount = (event as Fill).params.takerAssetFilledAmount;
    order.makerFeePaid = (event as Fill).params.makerFeePaid;
    order.protocolFeePaid = (event as Fill).params.protocolFeePaid;
  } else {
    // Cancel
  }
  order.save();
}

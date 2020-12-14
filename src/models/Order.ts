import { Asset } from "./../../generated/schema";
import { Address, BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { Bytes } from "@graphprotocol/graph-ts";
import { Account, Order, Token } from "../../generated/schema";
import { mapOrderStatus, OrderStatus } from "../enums";

export function loadOrder(orderId: string): Order {
  let existingAsset = Order.load(orderId);

  if (existingAsset != null) {
    return existingAsset as Order;
  }
  return null;
}

export function getOrCreateOrder(
  token: Token,
  owner: Account,
  asset: Asset,
  timestamp: BigInt
): Order {
  let orderId = token.address.toHexString() + asset.id;
  let existingAsset = Order.load(orderId);

  if (existingAsset != null) {
    return existingAsset as Order;
  }

  let newOrder = new Order(orderId);
  newOrder.owner = owner.id;
  newOrder.status = mapOrderStatus(OrderStatus.Sale);
  newOrder.token = token.id;
  newOrder.asset = asset.id;
  newOrder.createTimeStamp = timestamp;

  newOrder.save();

  return newOrder;
}

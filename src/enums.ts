export enum OrderStatus {
  Sale,
  Cancelled,
  Success,
}

export function mapOrderStatus(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.Sale:
      return "Sale";
    case OrderStatus.Cancelled:
      return "Cancelled";
    case OrderStatus.Success:
      return "Success";
    default:
      return "";
  }
}

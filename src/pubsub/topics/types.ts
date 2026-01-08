import { CustomersEventType, CustomersEventPayload } from "./customers/types";
import { OrdersEventType, OrdersEventPayload } from "./orders/types";
import { RefundsEventType, RefundsEventPayload } from "./refunds/types";
import { ProductsEventType, ProductsEventPayload } from "./products/types";
import { CartEventType, CartEventPayload } from "./cart/types";
import { PaymentsEventType, PaymentsEventPayload } from "./payments/types";
import { CustomTablesEventPayload, CustomTablesEventType } from "./custom-tables/types";

export interface TopicEventPayloadMap {
    customers: Record<CustomersEventType, CustomersEventPayload>;
    orders: Record<OrdersEventType, OrdersEventPayload>;
    refunds: Record<RefundsEventType, RefundsEventPayload>;
    products: Record<ProductsEventType, ProductsEventPayload>;
    cart: Record<CartEventType, CartEventPayload>;
    payments: Record<PaymentsEventType, PaymentsEventPayload>;
    customTables: Record<CustomTablesEventType, CustomTablesEventPayload>;
}


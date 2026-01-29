import { createFileRoute } from "@tanstack/react-router"
import { OrdersPage } from "@/components/orders/OrdersPage"
import type { OrdersData } from "@/types/entities"

export const Route = createFileRoute("/orders/")({
  component: OrdersRoute,
})

const demoData: OrdersData = {
  kpis: {
    totalOrders: 85,
    pendingOrders: 12,
    inProgressOrders: 28,
    shippedOrders: 35,
    deliveredOrders: 8,
    cancelledOrders: 2,
    totalValue: 125750,
    averageOrderValue: 1479.41,
  },
  orders: [
    {
      id: "ord-1",
      orderNumber: "ORD-2025-001",
      customerId: "cust-1",
      customerName: "ABC Company",
      customerEmail: "contact@abc.com",
      warehouseId: "wh-1",
      warehouseName: "Paris North Warehouse",
      orderDate: "2025-01-28T10:00:00Z",
      requiredDate: "2025-02-05T00:00:00Z",
      promisedDate: "2025-02-03T00:00:00Z",
      status: "picking",
      priority: "high",
      lines: [
        { id: "line-1", productId: "prod-1", productSku: "ELE-001", productName: "Laptop Pro 15", quantity: 10, pickedQuantity: 5, unitPrice: 1200, totalPrice: 12000 },
        { id: "line-2", productId: "prod-2", productSku: "ELE-002", productName: "Smartphone X", quantity: 20, pickedQuantity: 0, unitPrice: 650, totalPrice: 13000 },
      ],
      totalQuantity: 30,
      totalAmount: 25000,
      shippingAddress: "123 Commerce Street",
      shippingCity: "Paris",
      shippingCountry: "France",
      picker: "John Doe",
      createdAt: "2025-01-28T10:00:00Z",
      lastUpdated: "2025-01-28T14:30:00Z",
    },
    {
      id: "ord-2",
      orderNumber: "ORD-2025-002",
      customerId: "cust-2",
      customerName: "XYZ Corporation",
      customerEmail: "orders@xyz.com",
      warehouseId: "wh-2",
      warehouseName: "Lyon Warehouse",
      orderDate: "2025-01-27T14:00:00Z",
      requiredDate: "2025-02-02T00:00:00Z",
      status: "confirmed",
      priority: "medium",
      lines: [
        { id: "line-3", productId: "prod-5", productSku: "AUT-001", productName: "Oil Filter", quantity: 100, pickedQuantity: 0, unitPrice: 15, totalPrice: 1500 },
      ],
      totalQuantity: 100,
      totalAmount: 1500,
      shippingAddress: "456 Industrial Avenue",
      shippingCity: "Lyon",
      shippingCountry: "France",
      createdAt: "2025-01-27T14:00:00Z",
      lastUpdated: "2025-01-27T16:00:00Z",
    },
    {
      id: "ord-3",
      orderNumber: "ORD-2025-003",
      customerId: "cust-3",
      customerName: "Individual Customer",
      customerEmail: "particulier@email.com",
      warehouseId: "wh-1",
      warehouseName: "Paris North Warehouse",
      orderDate: "2025-01-26T09:00:00Z",
      requiredDate: "2025-01-30T00:00:00Z",
      shippedDate: "2025-01-28T11:00:00Z",
      status: "shipped",
      priority: "low",
      lines: [
        { id: "line-4", productId: "prod-4", productSku: "FOOD-001", productName: "1kg Coffee Beans", quantity: 5, pickedQuantity: 5, unitPrice: 20, totalPrice: 100 },
      ],
      totalQuantity: 5,
      totalAmount: 100,
      shippingAddress: "789 Residential Boulevard",
      shippingCity: "Marseille",
      shippingCountry: "France",
      trackingNumber: "TRACK123456789",
      carrier: "Chronopost",
      picker: "Jane Smith",
      packer: "Bob Wilson",
      createdAt: "2025-01-26T09:00:00Z",
      lastUpdated: "2025-01-28T11:00:00Z",
    },
  ],
}

function OrdersRoute() {
  return <OrdersPage data={demoData} />
}

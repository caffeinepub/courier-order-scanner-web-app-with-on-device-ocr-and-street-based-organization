import { Order, StreetGroup, CustomerGroup } from './types';

export function groupOrdersByStreet(orders: Order[]): StreetGroup[] {
  const grouped = new Map<string, Order[]>();

  orders.forEach((order) => {
    const street = order.street.trim() || 'Unknown Street';
    if (!grouped.has(street)) {
      grouped.set(street, []);
    }
    grouped.get(street)!.push(order);
  });

  const groups: StreetGroup[] = Array.from(grouped.entries()).map(([street, orders]) => ({
    street,
    orders,
    count: orders.length,
  }));

  groups.sort((a, b) => a.street.localeCompare(b.street));

  return groups;
}

export function groupOrdersByCustomer(orders: Order[]): CustomerGroup[] {
  const grouped = new Map<string, Order[]>();

  orders.forEach((order) => {
    const customer = order.customerName.trim() || 'Unknown Customer';
    if (!grouped.has(customer)) {
      grouped.set(customer, []);
    }
    grouped.get(customer)!.push(order);
  });

  const groups: CustomerGroup[] = Array.from(grouped.entries()).map(([customerName, orders]) => ({
    customerName,
    orders,
    count: orders.length,
  }));

  groups.sort((a, b) => a.customerName.localeCompare(b.customerName));

  return groups;
}

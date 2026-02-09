import { useState } from 'react';
import { useOrders } from './OrdersProvider';
import { groupOrdersByStreet, groupOrdersByCustomer } from './grouping';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Trash2, Package, AlertCircle } from 'lucide-react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { OrderItem } from './OrderItem';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface OrdersOverviewProps {
  onAddOrder: () => void;
}

export function OrdersOverview({ onAddOrder }: OrdersOverviewProps) {
  const { orders, clearAllOrders } = useOrders();
  const [expandedStreets, setExpandedStreets] = useState<Set<string>>(new Set());
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());
  const [showCompleted, setShowCompleted] = useState(true);

  const filteredOrders = showCompleted ? orders : orders.filter((o) => !o.completed);
  const streetGroups = groupOrdersByStreet(filteredOrders);
  const activeCount = orders.filter((o) => !o.completed).length;
  const completedCount = orders.filter((o) => o.completed).length;

  const toggleStreet = (street: string) => {
    setExpandedStreets((prev) => {
      const next = new Set(prev);
      if (next.has(street)) {
        next.delete(street);
      } else {
        next.add(street);
      }
      return next;
    });
  };

  const toggleCustomer = (street: string, customer: string) => {
    const key = `${street}::${customer}`;
    setExpandedCustomers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <Package className="h-20 w-20 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">No Orders Yet</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start scanning orders to organize your deliveries by street and customer.
        </p>
        <Button onClick={onAddOrder} size="lg" className="gap-2">
          <Package className="h-5 w-5" />
          Add First Order
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-base px-3 py-1">
              {activeCount} Active
            </Badge>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {completedCount} Done
            </Badge>
          </div>
        </div>
        <ConfirmDialog
          title="Clear All Orders"
          description="This will permanently delete all orders. This action cannot be undone."
          onConfirm={clearAllOrders}
          trigger={
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          }
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="show-completed"
          checked={showCompleted}
          onCheckedChange={(checked) => setShowCompleted(checked === true)}
        />
        <Label htmlFor="show-completed" className="text-sm font-medium cursor-pointer">
          Show completed orders
        </Label>
      </div>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">All orders completed!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {streetGroups.map((streetGroup) => {
            const isStreetExpanded = expandedStreets.has(streetGroup.street);
            const customerGroups = groupOrdersByCustomer(streetGroup.orders);

            return (
              <Card key={streetGroup.street}>
                <Collapsible open={isStreetExpanded} onOpenChange={() => toggleStreet(streetGroup.street)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isStreetExpanded ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                          <CardTitle className="text-lg">{streetGroup.street}</CardTitle>
                        </div>
                        <Badge variant="outline" className="text-base px-3 py-1">
                          {streetGroup.count}
                        </Badge>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-2">
                      {customerGroups.map((customerGroup) => {
                        const customerKey = `${streetGroup.street}::${customerGroup.customerName}`;
                        const isCustomerExpanded = expandedCustomers.has(customerKey);

                        if (customerGroup.count === 1) {
                          return (
                            <OrderItem key={customerGroup.orders[0].id} order={customerGroup.orders[0]} />
                          );
                        }

                        return (
                          <Card key={customerKey} className="border-2">
                            <Collapsible
                              open={isCustomerExpanded}
                              onOpenChange={() => toggleCustomer(streetGroup.street, customerGroup.customerName)}
                            >
                              <CollapsibleTrigger asChild>
                                <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors py-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {isCustomerExpanded ? (
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                      )}
                                      <span className="font-semibold text-base">
                                        {customerGroup.customerName}
                                      </span>
                                    </div>
                                    <Badge className="text-sm px-2 py-0.5">
                                      ×{customerGroup.count}
                                    </Badge>
                                  </div>
                                </CardHeader>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <CardContent className="pt-0 space-y-2">
                                  {customerGroup.orders.map((order) => (
                                    <OrderItem key={order.id} order={order} />
                                  ))}
                                </CardContent>
                              </CollapsibleContent>
                            </Collapsible>
                          </Card>
                        );
                      })}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

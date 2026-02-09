import { Order } from './types';
import { useOrders } from './OrdersProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Check, X } from 'lucide-react';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface OrderItemProps {
  order: Order;
}

export function OrderItem({ order }: OrderItemProps) {
  const { deleteOrder, toggleCompleted } = useOrders();

  return (
    <Card className={order.completed ? 'opacity-60' : ''}>
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base truncate">{order.customerName}</div>
            <div className="text-sm text-muted-foreground truncate">{order.street}</div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant={order.completed ? 'outline' : 'default'}
              size="sm"
              onClick={() => toggleCompleted(order.id)}
              className="gap-1"
            >
              {order.completed ? (
                <>
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Undo</span>
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span className="hidden sm:inline">Done</span>
                </>
              )}
            </Button>
            <ConfirmDialog
              title="Delete Order"
              description="Are you sure you want to delete this order? This action cannot be undone."
              onConfirm={() => deleteOrder(order.id)}
              trigger={
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { OrdersProvider } from './features/orders/OrdersProvider';
import { OrdersOverview } from './features/orders/OrdersOverview';
import { AddOrderFlow } from './features/add-order/AddOrderFlow';
import { Button } from './components/ui/button';
import { Plus, Package } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

function App() {
  const [view, setView] = useState<'list' | 'add'>('list');

  return (
    <OrdersProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
          <div className="container max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-7 w-7 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Courier Scanner</h1>
              </div>
              {view === 'list' && (
                <Button
                  onClick={() => setView('add')}
                  size="lg"
                  className="gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Add Order
                </Button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 container max-w-2xl mx-auto px-4 py-6">
          {view === 'list' ? (
            <OrdersOverview onAddOrder={() => setView('add')} />
          ) : (
            <AddOrderFlow onComplete={() => setView('list')} onCancel={() => setView('list')} />
          )}
        </main>

        <footer className="border-t border-border bg-card py-4 mt-auto">
          <div className="container max-w-2xl mx-auto px-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </div>
        </footer>
      </div>
      <Toaster />
    </OrdersProvider>
  );
}

export default App;

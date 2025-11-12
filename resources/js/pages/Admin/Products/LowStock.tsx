import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Package, AlertTriangle, Settings, Edit, ArrowLeft } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Product {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
  reserved_stock?: number;
  low_stock_threshold?: number;
  category: {
    name: string;
  };
  is_active: boolean;
}

interface PaginationData {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Props {
  products: PaginationData;
}

function LowStockProducts({ products }: Props) {
  const [stockAdjustModal, setStockAdjustModal] = useState<{ product: Product | null; isOpen: boolean }>({
    product: null,
    isOpen: false
  });
  const [adjustmentData, setAdjustmentData] = useState({
    adjustment_type: 'add',
    quantity: 0,
    reason: ''
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const getAvailableStock = (product: Product) => {
    const reserved = product.reserved_stock || 0;
    return Math.max(0, product.stock_quantity - reserved);
  };

  const getStockStatus = (product: Product) => {
    const threshold = product.low_stock_threshold || 5;
    if (product.stock_quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (product.stock_quantity <= threshold) {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">Critical Low</Badge>;
    }
    return <Badge variant="secondary">Low Stock</Badge>;
  };

  const openStockAdjustModal = (product: Product) => {
    setStockAdjustModal({ product, isOpen: true });
    setAdjustmentData({ adjustment_type: 'add', quantity: 0, reason: 'Restock - Low inventory' });
  };

  const closeStockAdjustModal = () => {
    setStockAdjustModal({ product: null, isOpen: false });
  };

  const handleStockAdjustment = () => {
    if (!stockAdjustModal.product) return;
    
    router.patch(`/admin/products/${stockAdjustModal.product.id}/adjust-stock`, adjustmentData, {
      onSuccess: () => {
        closeStockAdjustModal();
      },
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head title="Low Stock Products - Admin" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center">
                <AlertTriangle className="mr-3 h-8 w-8 text-orange-600" />
                Low Stock Products
              </h1>
              <p className="text-muted-foreground">Products that need restocking</p>
            </div>
          </div>
        </div>

        {/* Alert Card */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Stock Alert
            </CardTitle>
            <CardDescription className="text-orange-700">
              {products.total} products are running low on stock and need immediate attention.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Low Stock Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products Requiring Restock</CardTitle>
            <CardDescription>
              Products below their low stock threshold, sorted by urgency
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.data.map((product) => (
                    <TableRow key={product.id} className={product.stock_quantity === 0 ? 'bg-red-50' : ''}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(product.price)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className={`font-medium ${product.stock_quantity === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                            {product.stock_quantity}
                          </span>
                          {product.reserved_stock && product.reserved_stock > 0 && (
                            <span className="text-xs text-muted-foreground">
                              ({product.reserved_stock} reserved)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={getAvailableStock(product) === 0 ? 'text-red-600 font-medium' : 'text-orange-600'}>
                          {getAvailableStock(product)}
                        </span>
                      </TableCell>
                      <TableCell>{product.low_stock_threshold || 5}</TableCell>
                      <TableCell>{getStockStatus(product)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openStockAdjustModal(product)}
                          >
                            <Settings className="mr-1 h-4 w-4" />
                            Restock
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">All products are well stocked!</h3>
                <p className="text-muted-foreground">No products are currently below their low stock threshold.</p>
              </div>
            )}
            
            {/* Pagination Info */}
            {products.data.length > 0 && (
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  Showing {products.data.length} of {products.total} low stock products
                </div>
                <div>
                  Page {products.current_page} of {products.last_page}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Adjustment Modal */}
        {stockAdjustModal.isOpen && stockAdjustModal.product && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
              <h3 className="text-lg font-semibold mb-4">
                Restock: {stockAdjustModal.product.name}
              </h3>
              <div className="space-y-4">
                <div className="bg-orange-50 p-3 rounded border border-orange-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Current Stock:</span>
                    <span className="text-lg font-semibold text-orange-600">
                      {stockAdjustModal.product.stock_quantity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Threshold:</span>
                    <span className="text-sm">{stockAdjustModal.product.low_stock_threshold || 5}</span>
                  </div>
                  {stockAdjustModal.product.reserved_stock && stockAdjustModal.product.reserved_stock > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Reserved:</span>
                      <span className="text-sm">{stockAdjustModal.product.reserved_stock}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Adjustment Type</label>
                  <select
                    value={adjustmentData.adjustment_type}
                    onChange={(e) => setAdjustmentData({ ...adjustmentData, adjustment_type: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="add">Add Stock</option>
                    <option value="set">Set Stock</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {adjustmentData.adjustment_type === 'add' ? 'Quantity to Add' : 'New Stock Quantity'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={adjustmentData.quantity}
                    onChange={(e) => setAdjustmentData({ ...adjustmentData, quantity: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border rounded"
                    placeholder={adjustmentData.adjustment_type === 'add' ? 'Enter quantity to add' : 'Enter new total quantity'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Reason</label>
                  <input
                    type="text"
                    value={adjustmentData.reason}
                    onChange={(e) => setAdjustmentData({ ...adjustmentData, reason: e.target.value })}
                    placeholder="e.g., Restock from supplier, Inventory replenishment"
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={closeStockAdjustModal}>
                    Cancel
                  </Button>
                  <Button onClick={handleStockAdjustment}>
                    Update Stock
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

LowStockProducts.layout = (page: React.ReactElement) => <AppLayout>{page}</AppLayout>;

export default LowStockProducts;

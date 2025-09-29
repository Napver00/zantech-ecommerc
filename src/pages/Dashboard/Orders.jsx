import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { config } from "../../config";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../components/ui/table";

const Orders = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 5,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = useCallback(
    async (page) => {
      if (!user?.id || !token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${config.baseURL}/orders/users?limit=${pagination.per_page}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders. Please try again later.");
        }
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
          setPagination(data.pagination);
        } else {
          throw new Error(data.message || "Could not retrieve orders.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [user, token, pagination.per_page]
  );

  useEffect(() => {
    fetchOrders(currentPage);
  }, [fetchOrders, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      setCurrentPage(page);
    }
  };

  const getStatusInfo = (status) => {
    switch (String(status)) {
      case "0":
        return { text: "Processing", className: "bg-blue-100 text-blue-800" };
      case "1":
        return { text: "Completed", className: "bg-green-100 text-green-800" };
      case "2":
        return { text: "On Hold", className: "bg-yellow-100 text-yellow-800" };
      case "3":
        return { text: "Cancelled", className: "bg-red-100 text-red-800" };
      case "4":
        return { text: "Refunded", className: "bg-gray-100 text-gray-800" };
      default:
        return { text: "Unknown", className: "bg-gray-100 text-gray-800" };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const PaginationComponent = () => {
    const { current_page, last_page } = pagination;
    if (last_page <= 1) return null;

    const pageNumbers = [];
    const maxVisible = 5;

    if (last_page <= maxVisible) {
      for (let i = 1; i <= last_page; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (current_page <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", last_page);
      } else if (current_page >= last_page - 2) {
        pageNumbers.push(
          1,
          "...",
          last_page - 3,
          last_page - 2,
          last_page - 1,
          last_page
        );
      } else {
        pageNumbers.push(
          1,
          "...",
          current_page - 1,
          current_page,
          current_page + 1,
          "...",
          last_page
        );
      }
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          onClick={() => handlePageChange(current_page - 1)}
          disabled={current_page === 1}
          variant="outline"
          size="sm"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 py-1">
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <Button
              key={page}
              onClick={() => handlePageChange(page)}
              variant={current_page === page ? "default" : "outline"}
              size="sm"
              className="h-9 w-9 p-0"
            >
              {page}
            </Button>
          )
        )}
        <Button
          onClick={() => handlePageChange(current_page + 1)}
          disabled={current_page === last_page}
          variant="outline"
          size="sm"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
            <Package className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">My Orders</h2>
        </div>
        <p className="text-gray-600 ml-14">
          Track and manage all your orders in one place
        </p>
      </div>

      {loading && renderSkeleton()}

      {!loading && error && (
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-8 text-center shadow-sm">
          <div className="inline-flex p-3 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-xl font-semibold text-red-900 mb-2">
            Could not load your orders
          </p>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center">
          <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-6">
            <Package className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No Orders Yet
          </h3>
          <p className="text-gray-600 text-lg mb-8">
            Start shopping to see your orders here
          </p>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all"
          >
            <a href="/shop">Browse Products</a>
          </Button>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <TableHead className="font-semibold text-gray-700">
                    Order Details
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Amount
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const status = getStatusInfo(order.status);
                  return (
                    <TableRow
                      key={order.order_id}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <TableCell className="py-4">
                        <div className="font-bold text-gray-900 text-base">
                          {order.invoice_code}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {order.totalProduct} item(s)
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {formatDate(order.order_placed_date)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-4 py-2 inline-flex text-xs font-bold rounded-full ${status.className} shadow-sm`}
                        >
                          {status.text}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-gray-900 text-base">
                          ৳{Number(order.total_amount).toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="font-semibold border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm hover:shadow"
                        >
                          <Link to={`/dashboard/orders/${order.invoice_code}`}>View Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <PaginationComponent />
        </>
      )}
    </div>
  );
};

export default Orders;
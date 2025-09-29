import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import {
  FaBoxOpen,
  FaEye,
  FaMoneyBillWave,
  FaTimes,
} from "react-icons/fa";

const Orders = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const { orders, cancelOrder } = useContext(Context);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = {};
      orders.forEach((order) => {
        const createdAt = new Date(order.createdAt).getTime();
        const now = new Date().getTime();
        const secondsElapsed = Math.floor((now - createdAt) / 1000);
        const secondsRemaining = Math.max(120 - secondsElapsed, 0);
        newTimeLeft[order.id] = secondsRemaining;
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [orders]);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <FaBoxOpen className="text-5xl sm:text-6xl text-gray-300" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4">
            {t("ordersPage.no_orders_title")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            {t("ordersPage.no_orders_description")}
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
          >
            {t("ordersPage.no_orders_button")}
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("uz-UZ", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentLabel = (type, status) => {
    switch (type?.toLowerCase()) {
      case "click": return t("ordersPage.payment_click");
      case "payme": return t("ordersPage.payment_payme");
      case "delivery": return status === "cash" ? t("ordersPage.payment_delivery_cash") : t("ordersPage.payment_delivery_driver");
      case "cod": return t("ordersPage.payment_cod");
      default: return type;
    }
  };

  const getPaymentIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "click": return <span className="text-blue-500">🔵</span>;
      case "payme": return <span className="text-green-500">🟢</span>;
      case "delivery": return <FaMoneyBillWave className="text-green-600" />;
      default: return <span>💳</span>;
    }
  };

  const getStatusLabel = (order) => {
    if (
      ["payme", "click"].includes(order.paymentType?.toLowerCase()) &&
      order.paymentStatus !== "paid"
    ) {
      return (
        <span className="flex items-center text-xs px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded-full">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-1 sm:mr-2"></span>
          {t("ordersPage.payment_failed")}
        </span>
      );
    }
    switch (order.status) {
      case "cancelled":
        return (
          <span className="flex items-center text-xs px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-1 sm:mr-2"></span>
            {t("ordersPage.status_cancelled")}
          </span>
        );
      case "driver_assigned":
        return (
          <span className="flex items-center text-xs px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1 sm:mr-2"></span>
            {t("ordersPage.status_driver_assigned")}
          </span>
        );
      case "delivered":
        return (
          <span className="flex items-center text-xs px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1 sm:mr-2"></span>
            {t("ordersPage.status_delivered")}
          </span>
        );
      default:
        return (
          <span className="flex items-center text-xs px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-1 sm:mr-2"></span>
            {t("ordersPage.status_pending")}
          </span>
        );
    }
  };

  const filteredOrders = filterStatus === "all"
    ? orders
    : filterStatus === "cancelled"
    ? orders.filter(
        (order) =>
          order.status === "cancelled" ||
          (["payme", "click"].includes(order.paymentType?.toLowerCase()) &&
            order.paymentStatus !== "paid")
      )
    : orders.filter(
        (order) =>
          order.status === filterStatus &&
          !(["payme", "click"].includes(order.paymentType?.toLowerCase()) &&
            order.paymentStatus !== "paid")
      );

  const showDiscount = (order) => {
    if (order.discount && order.discount > 0) {
      return (
        <div className="mt-2 p-2 bg-green-50 rounded-md">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-green-700">
              {t("ordersPage.discount_label", { percentage: order.discountPercentage })}
            </span>
            <span className="font-semibold text-green-700">
              -{order.discount.toLocaleString()} {t("ordersPage.currency")}
            </span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm mt-1">
            <span>{t("ordersPage.original_price")}</span>
            <span className="line-through text-gray-500">
              {order.originalTotal.toLocaleString()} {t("ordersPage.currency")}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const canCancelOrder = (order) => {
    const createdAt = new Date(order.createdAt).getTime();
    const now = new Date().getTime();
    const secondsElapsed = Math.floor((now - createdAt) / 1000);
    return secondsElapsed <= 120;
  };

  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleCancelOrder = (orderId) => {
    try {
      cancelOrder(orderId);
      setCancellingOrder(null);
      toast.success(t("ordersPage.toast_success", { id: orderId }), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-green-50 text-green-700 font-medium text-sm rounded-lg",
      });
    } catch (error) {
      toast.error(t("ordersPage.toast_error"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        className: "bg-red-50 text-red-700 font-medium text-sm rounded-lg",
      });
    }
  };

  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleTrackOrder = (order) => {
    setTrackingOrder(order);
  };

  const CancelModal = ({ order, onClose, onConfirm }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">
              {t("ordersPage.cancel_modal_title")}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
            >
              ✕
            </button>
          </div>
          <div className="mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-700">
              {t("ordersPage.cancel_modal_message", { id: order.id })}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {t("ordersPage.cancel_modal_note")}
            </p>
          </div>
          <div className="flex justify-end gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
            >
              {t("ordersPage.cancel_modal_cancel")}
            </button>
            <button
              onClick={() => onConfirm(order.id)}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
            >
              {t("ordersPage.cancel_modal_confirm")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const TrackingModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold">
              {t("ordersPage.tracking_modal_title", { id: order.id })}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
            >
              ✕
            </button>
          </div>
          <div className="border-t border-b py-3 sm:py-4 my-3 sm:my-4">
            <div className="flex justify-between items-center mb-2 sm:mb-3 text-sm sm:text-base">
              <span className="font-medium">{t("ordersPage.tracking_modal_status")}</span>
              {getStatusLabel(order)}
            </div>
            {order.trackingNumber && (
              <div className="flex justify-between mb-2 sm:mb-3 text-sm sm:text-base">
                <span className="font-medium">{t("ordersPage.tracking_modal_tracking_number")}</span>
                <span className="font-semibold">{order.trackingNumber}</span>
              </div>
            )}
            {order.driver && (
              <div className="flex justify-between mb-2 sm:mb-3 text-sm sm:text-base">
                <span className="font-medium">{t("ordersPage.tracking_modal_driver")}</span>
                <span className="font-semibold">{order.driver.name}</span>
              </div>
            )}
            {order.driver && order.driver.phone && (
              <div className="flex justify-between mb-2 sm:mb-3 text-sm sm:text-base">
                <span className="font-medium">{t("ordersPage.tracking_modal_driver_phone")}</span>
                <span className="font-semibold">{order.driver.phone}</span>
              </div>
            )}
            {order.estimatedDelivery && (
              <div className="flex justify-between text-sm sm:text-base">
                <span className="font-medium">{t("ordersPage.tracking_modal_estimated_delivery")}</span>
                <span className="font-semibold">{order.estimatedDelivery}</span>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm sm:text-base"
            >
              {t("ordersPage.tracking_modal_close")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <section className="max-w-5xl mx-auto">
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            {t("ordersPage.orders_title")}
          </h2>
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 py-2 md:py-3">
            {["all", "pending", "driver_assigned", "delivered", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base font-medium rounded-md whitespace-nowrap transition-all duration-200 ${
                  filterStatus === status
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {t(`ordersPage.filter_${status}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:gap-6">
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden transition-all hover:shadow-xl"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                      {t("ordersPage.order_label", { id: order.id })}
                    </h3>
                    <span className="text-xs sm:text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-0">{getStatusLabel(order)}</div>
                </div>
                <div className="mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="mb-3 pb-3 border-b last:border-b-0"
                    >
                      <div className="flex justify-between text-sm sm:text-base">
                        <span className="font-medium text-gray-800">{item.title}</span>
                        <span className="font-semibold">
                          {item.price?.toLocaleString()} {t("ordersPage.currency")}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-1">
                        <span>{t("ordersPage.quantity_label")}: {item.quantity}</span>
                        <span>
                          {t("ordersPage.total_label")}: {(item.price * item.quantity).toLocaleString()} {t("ordersPage.currency")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {showDiscount(order)}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-3 border-t">
                  <div className="flex items-center text-sm text-gray-700 mb-2 sm:mb-0">
                    {getPaymentIcon(order.paymentType)}
                    <span className="ml-2">
                      {getPaymentLabel(order.paymentType, order.paymentStatus)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {t("ordersPage.total_label")}:{" "}
                      <span className="font-semibold text-black text-base sm:text-lg">
                        {order.total.toLocaleString()} {t("ordersPage.currency")}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={() => handleTrackOrder(order)}
                    className="flex items-center text-xs sm:text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition"
                  >
                    <FaEye className="mr-1 sm:mr-2" />
                    {t("ordersPage.track_order_button")}
                  </button>
                  {order.paymentStatus !== "paid" &&
                    order.status !== "cancelled" &&
                    order.status !== "delivered" &&
                    canCancelOrder(order) && (
                      <button
                        onClick={() => setCancellingOrder(order)}
                        className="flex items-center text-xs sm:text-sm bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition"
                      >
                        <FaTimes className="mr-1 sm:mr-2" />
                        {t("ordersPage.cancel_order_button", { timeLeft: formatTimeLeft(timeLeft[order.id] || 0) })}
                      </button>
                    )}
                  {order.paymentStatus !== "paid" &&
                    order.status !== "cancelled" &&
                    order.status !== "delivered" &&
                    !canCancelOrder(order) && (
                      <span className="text-xs sm:text-sm text-gray-500">
                        {t("ordersPage.cancel_order_expired")}
                      </span>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {cancellingOrder && (
          <CancelModal
            order={cancellingOrder}
            onClose={() => setCancellingOrder(null)}
            onConfirm={handleCancelOrder}
          />
        )}
        {trackingOrder && (
          <TrackingModal
            order={trackingOrder}
            onClose={() => setTrackingOrder(null)}
          />
        )}
      </section>
    </div>
  );
};

export default React.memo(Orders);
"use client";

import { Clock, CheckCircle, Truck, XCircle, HelpCircle } from "lucide-react";
import type { ReactNode } from "react";

interface StatusBadgeProps {
  status: string;
}

interface StatusConfig {
  label: string;
  className: string;
  icon: ReactNode;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<string, StatusConfig> = {
    pending: {
      label: "Chờ xử lý",
      className: "bg-yellow-100 text-yellow-700",
      icon: <Clock size={14} />,
    },
    confirmed: {
      label: "Đã xác nhận",
      className: "bg-blue-100 text-blue-700",
      icon: <CheckCircle size={14} />,
    },
    shipping: {
      label: "Đang giao",
      className: "bg-purple-100 text-purple-700",
      icon: <Truck size={14} />,
    },
    completed: {
      label: "Hoàn thành",
      className: "bg-green-100 text-green-700",
      icon: <CheckCircle size={14} />,
    },
    canceled: {
      label: "Đã hủy",
      className: "bg-red-100 text-red-700",
      icon: <XCircle size={14} />,
    },
  };

  const item = config[status] || {
    label: status,
    className: "bg-gray-100 text-gray-600",
    icon: <HelpCircle size={14} />,
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-3 py-1.5
        rounded-md
        text-xs font-semibold
        whitespace-nowrap
        ${item.className}
      `}
    >
      {item.icon}
      {item.label}
    </span>
  );
}

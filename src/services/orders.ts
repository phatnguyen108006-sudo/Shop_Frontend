import { apiFetch } from "@/lib/api";

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  note?: string;
  items: {
    productId: string | number;
    slug?: string;
    quantity: number;
    price?: number;
  }[];
  totalPrice: number;
};

export type CreatedOrder = {
  id: string | number;
  _id?: string | number;
};

type CreateOrderResponse =
  | { ok: true; order: CreatedOrder }
  | { ok: false; error?: { message?: string } };

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export async function createOrder(input: CreateOrderInput) {
  try {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const result = await apiFetch<CreateOrderResponse>("/orders", {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...input,
        items: input.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    });

    if (!result.ok) {
      throw new Error(result.error?.message || "Không thể tạo đơn hàng");
    }

    return result.order;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
}

export async function getMyOrders(phone = "") {
  try {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const result: any = await apiFetch(`/orders/lookup?phone=${phone}`, {
      method: "GET",
      headers,
    });

    return result.data || [];
  } catch (error) {
    console.error("Lỗi tra cứu:", error);
    return [];
  }
}

export async function trackOrderService(orderId: string, phone: string) {
  try {
    const result: any = await apiFetch("/orders/track", {
      method: "POST",
      body: JSON.stringify({ orderId, phone }),
    });

    return result.order || null;
  } catch (error) {
    console.error("Lỗi tra cứu:", error);
    return null;
  }
}

export async function adminSearchOrders(phone: string) {
  try {
    const token = getToken();

    const result: any = await apiFetch(`/orders?phone=${phone}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data || [];
  } catch (error) {
    console.error("Lỗi admin tra cứu:", error);
    return [];
  }
}

export async function getAllOrders() {
  try {
    const token = getToken();

    const result: any = await apiFetch("/orders", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return result.data || [];
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error);
    return [];
  }
}

export async function getOrderByIdAdmin(id: string) {
  try {
    const token = getToken();
    const result: any = await apiFetch(`/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data || null;
  } catch (_error) {
    return null;
  }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const token = getToken();
    await apiFetch(`/orders/${id}/status`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

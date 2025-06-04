import { orderApiRequest } from "../apiRequests/orders";
import { useMutation, useQuery } from "@tanstack/react-query";

interface OrderItem {
  productTemplateID: string;
  quantity: number;
}

interface CreateOrderRequest {
  customerID: string;
  orderItems: OrderItem[];
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
}

export const useOrder = () => {
  const { data, isError, error } = useMutation({
    mutationFn: async (orderData: CreateOrderRequest) => {
      const res = await orderApiRequest.createOrderByCustomer({
        ...orderData,
      });
      return res;
    },
  });

  return {
    createOrder: data,
    isError,
    error,
    isLoading: data?.isLoading,
    isSuccess: data?.isSuccess,
  };
};

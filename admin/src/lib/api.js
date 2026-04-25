import axiosInstance from "./axios"

export const productApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("admin/products")

    return data;
  },

  create: async (formData) => {
    const { data } = await axiosInstance.post("admin/products", formData)
    return data;
  },

  update: async ({ id, formData }) => {
    const { data } = await axiosInstance.put(`admin/products/${id}`, formData);
    return data;
  },

  delete: async (id) => {
    const { data } = await axiosInstance.delete(`admin/products/${id}`);
    return data;
  }
}

export const ordersApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("admin/orders")
    return data
  },

  updateStatus: async ({ orderId, status }) => {
    const { data } = await axiosInstance.patch(`admin/orders/${orderId}/status`, { status })
    return data;
  }
}

export const StatsApi = {
  getDashboard: async () => {
    const { data } = await axiosInstance.get('admin/stats');
    return data;
  }
}

export const customerApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("admin/customers")
    return data
  }
}

export const interestsApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get("admin/interests")
    return data
  }
}
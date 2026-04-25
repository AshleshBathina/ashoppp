import axiosInstance from "./axios";

export const productsApi = {
  getAllProducts: async () => {
    const { data } = await axiosInstance.get('/products');
    return data;
  },

  getProductById: async (productId) => {
    const { data } = await axiosInstance.get(`/products/${productId}`);
    return data;
  },
}

export const wishlistApi = {
  getWishlist: async () => {
    const { data } = await axiosInstance.get('/users/wishlist')
    return data.wishlist
  },

  removeFromWishlist: async (productId) => {
    const { data } = await axiosInstance.delete(`/users/wishlist/${productId}`);
    return data.wishlist
  },

  addToWishlist: async (productId) => {
    const { data } = await axiosInstance.post('/users/wishlist', { productId })
    return data.wishlist
  }
}

export const cartApi = {
  getCart: async () => {
    const { data } = await axiosInstance.get('/cart/')
    return data.cart
  },

  addToCart: async (productId) => {
    const { data } = await axiosInstance.post('/cart/', { productId })
    return data.cart
  },

  updateCartItem: async ({ productId, quantity }) => {
    const { data } = await axiosInstance.put(`/cart/${productId}`, { quantity })
    return data.cart
  },

  removeFromCart: async (productId) => {
    const { data } = await axiosInstance.delete(`/cart/${productId}`)
    return data.cart;
  },

  clearCart: async () => {
    const { data } = await axiosInstance.delete('/cart/delete')
    return data
  }
}

export const ordersApi = {
  getUserOrders: async () => {
    const { data } = await axiosInstance.get('/orders/')
    return data.orders
  },
}

export const interestApi = {
  expressInterest: async ({ productId, quantity }) => {
    const { data } = await axiosInstance.post('/interests/', { productId, quantity })
    return data
  },

  expressCartInterest: async () => {
    const { data } = await axiosInstance.post('/interests/bulk')
    return data
  }
}

export const userApi = {
  getAddresses: async () => {
    const { data } = await axiosInstance.get('/users/addresses')
    return data.addresses
  },

  addAddress: async (addressData) => {
    const { data } = await axiosInstance.post('/users/addresses', addressData)
    return data.addresses
  },

  updateAddress: async ({ addressId, ...addressData }) => {
    const { data } = await axiosInstance.put(`/users/addresses/${addressId}`, addressData)
    return data.addresses
  },

  deleteAddress: async (addressId) => {
    const { data } = await axiosInstance.delete(`/users/addresses/${addressId}`)
    return data.addresses
  },

  getWishlist: async () => {
    const { data } = await axiosInstance.get('/users/wishlist')
    return data.wishlist
  }
}
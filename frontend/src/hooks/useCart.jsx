import { cartApi } from "../lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const useCart = () => {
  const queryClient = useQueryClient()

  const { data: cart, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.getCart
  })

  const addToCartMutation = useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (error) => {
      console.error('addToCart ERROR:', error)
    }
  })

  const updateCartItemMutation = useMutation({
    mutationFn: ({ productId, quantity }) => {
      return cartApi.updateCartItem({ productId, quantity })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  })

  const removeFromCartMutation = useMutation({
    mutationFn: cartApi.removeFromCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    onError: (error) => {
      console.error('removeFromCart ERROR:', error)
    }
  })

  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  })

  const isInCart = (productId) => {
    const result = cart?.items?.some(item => item.product._id?.toString() === productId?.toString()) ?? false;
    return result;
  }

  const toggleCart = (productId) => {
    if (isInCart(productId)) {
      removeFromCartMutation.mutate(productId)
    } else {

      addToCartMutation.mutate(productId)
    }
  }

  return {
    cart,
    isSuccess,
    isError,
    isLoading,
    addToCart: addToCartMutation.mutate,
    updateCartItem: updateCartItemMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    toggleCart,
    isInCart,
    isAddingToCart: updateCartItemMutation.isPending || addToCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending || clearCartMutation.isPending
  }
}

export default useCart
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "../lib/api";

const useWishlist = () => {
  const queryClient = useQueryClient()

  const { data: wishlist, isLoading, isError } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.getWishlist
  })

  const addToWishlistMutation = useMutation({
    mutationFn: wishlistApi.addToWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] })
  })

  const removeFromWishlistMutation = useMutation({
    mutationFn: wishlistApi.removeFromWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] })
  })

  const isInWishlist = (productId) => {
    return wishlist?.some((product) => product._id === productId) ?? false;
  }

  const toggleWishlist = (productId) => {
    if (addToWishlistMutation.isPending || removeFromWishlistMutation.isPending) return;

    if (isInWishlist(productId)) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId)
    }
  }

  /** Returns true while this specific product is being added or removed */
  const isTogglePending = (productId) => {
    if (addToWishlistMutation.isPending && addToWishlistMutation.variables === productId) return true;
    if (removeFromWishlistMutation.isPending && removeFromWishlistMutation.variables === productId) return true;
    return false;
  }

  return {
    isLoading,
    isError,
    wishlist: wishlist || [],
    wishlistCount: wishlist?.length || 0,
    isInWishlist,
    toggleWishlist,
    isTogglePending,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending
  }
}

export default useWishlist
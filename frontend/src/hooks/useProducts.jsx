import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../lib/api";

const useProducts = () => {


  const data = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAllProducts
  });

  return data;
}

export default useProducts
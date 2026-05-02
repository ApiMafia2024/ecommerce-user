import { Product } from "@/types/product.types"
import React from "react"

export const useProductCard = ({product}: {product: Product}) => {
    const defaultVariant = React.useMemo(() => {
        return product.variations.find((variation) => variation.is_default) || product.variations[0]
    }, [product])
  return {
    defaultVariant,
  }
}
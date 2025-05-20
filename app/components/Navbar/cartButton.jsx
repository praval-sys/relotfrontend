import { ShoppingBag } from "lucide-react"
import { useSelector } from "react-redux"
import CartDialog from "../Cart/CartDailog"

const CartButton = () => {
  const cartTotalQuantity = useSelector((state) => state.cart.totalQuantity)

  return (
    <div className="relative">
      
      <CartDialog />
    </div>
  )
}

export default CartButton

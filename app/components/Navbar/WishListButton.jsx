import { Heart } from "lucide-react"
import WishlistDailog from "../WishlistDailog"
import { useState } from "react"

const WishlistButton = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    
    // Emit event to parent
    if (onToggle) onToggle(newState)
    
    // Also emit global event
    window.dispatchEvent(new CustomEvent('dialogStateChange', {
      detail: { type: 'wishlist', isOpen: newState }
    }))
  }
  return (
    <div className="relative">
      <WishlistDailog onclick={handleToggle}/>
    </div>
  )
}

export default WishlistButton

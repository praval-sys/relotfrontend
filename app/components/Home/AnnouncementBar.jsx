export default function AnnouncementBar({className}) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white">
      <div className={`py-2 w-full text-center text-sm ${className}`}>
        <p className="text-sm md:text-base px-4">
          Free Shipping on Orders Above ₹2000 · Exclusive Members-Only Sale
        </p>
      </div>
    </div>
  )
}

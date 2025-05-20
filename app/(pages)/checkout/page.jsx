"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import api from "../../lib/api"
import AddressDialog from "../../components/Address"
import {
  CheckCircle,
  CircleDashed,
  CreditCard,
  Home,
  Loader2,
  LogIn,
  MapPin,
  Package,
  PartyPopper,
  ShoppingCart,
  ArrowRight,
  Wallet,
  Shield,
  Clock,
  Truck,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const { user, loading } = useAuth()
  const cartItems = useSelector((state) => state.cart.items)
  const [step, setStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  useEffect(() => {
    if (!loading && !user) return
  }, [loading, user])

  const handleAddressSelect = (address) => {
    console.log("Selected Address:", address)
    setSelectedAddress(address)
  }

  const handlePayment = async () => {
    if (!selectedAddress || !paymentMethod) {
      toast.error("Please select address and payment method")
      return
    }

    setIsProcessing(true)

    const isRazorpayLoaded = await loadRazorpayScript()
    if (!isRazorpayLoaded) {
      toast.error("Razorpay SDK failed to load. Are you online?")
      setIsProcessing(false)
      return
    }

    try {
      const { data } = await api.post("/v1/initiatecheckout", {
        shippingAddress: selectedAddress,
        paymentMethod,
      })

      const { orderId, razorpayOrderId, amount, currency, key } = data.data

      const options = {
        key,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: "Your Store",
        description: "Order Payment",
        handler: async (response) => {
          const verifyRes = await api.post("/v1/verifypayment", {
            orderId,
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })

          if (verifyRes.data.success) {
            toast.success("Payment Successful!")
            setStep(5)
          } else {
            toast.error("Payment Verification Failed")
          }
          setIsProcessing(false)
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
          },
        },
      }

      const razor = new window.Razorpay(options)
      razor.open()
    } catch (err) {
      console.error(err)
      toast.error("Payment Failed!")
      setIsProcessing(false)
    }
  }

  const steps = [
    { name: "Authentication", icon: <LogIn className="h-5 w-5" /> },
    { name: "Address", icon: <MapPin className="h-5 w-5" /> },
    { name: "Order Summary", icon: <ShoppingCart className="h-5 w-5" /> },
    { name: "Payment", icon: <CreditCard className="h-5 w-5" /> },
    { name: "Success", icon: <PartyPopper className="h-5 w-5" /> },
  ]

  const getStepIcon = (index) => {
    if (step > index + 1) return <CheckCircle className="h-6 w-6 text-green-500" />
    if (step === index + 1) return steps[index].icon
    return <CircleDashed className="h-6 w-6 text-gray-300" />
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white">
                  <LogIn className="h-5 w-5" />
                </div>
                <span>Authentication</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {user ? (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{user.name}</p>
                        <p className="text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full h-12 text-base font-medium" onClick={() => setStep(2)}>
                    Continue to Address
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center p-10">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-lg">Redirecting to login...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white">
                  <MapPin className="h-5 w-5" />
                </div>
                <span>Select Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {selectedAddress ? (
                <div className="border-2 border-primary/20 rounded-xl p-5 mb-6 bg-primary/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg">
                    {selectedAddress.type}
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Home className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{selectedAddress.name}</p>
                      <p className="text-muted-foreground">{selectedAddress.street}</p>
                      <p className="text-muted-foreground">
                        {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                      </p>
                      <p className="text-muted-foreground">Phone: {selectedAddress.phone}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-10 border-2 border-dashed rounded-xl mb-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Home className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No address selected</p>
                    <p className="text-sm text-muted-foreground">Please add a delivery address</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <AddressDialog onAddressSelect={handleAddressSelect} selectedAddress={selectedAddress} />

                {selectedAddress && (
                  <Button className="w-full h-12 text-base font-medium" onClick={() => setStep(3)}>
                    Continue to Order Summary
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="rounded-xl border-2 border-primary/20 overflow-hidden">
                  <div className="bg-primary/10 px-5 py-3 font-medium text-primary flex justify-between">
                    <span>Item</span>
                    <span>Total</span>
                  </div>
                  <ul className="divide-y">
                    {cartItems.map((item, index) => (
                      <li
                        key={index}
                        className="px-5 py-4 flex justify-between items-center hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <span>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-sm text-muted-foreground block">× {item.quantity}</span>
                          </span>
                        </div>
                        <span className="font-medium text-lg">₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-primary/10 px-5 py-4 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 my-6">
                  <div className="flex flex-col items-center p-4 rounded-xl bg-primary/5 text-center">
                    <Truck className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm font-medium">Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-primary/5 text-center">
                    <Shield className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm font-medium">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center p-4 rounded-xl bg-primary/5 text-center">
                    <Clock className="h-6 w-6 text-primary mb-2" />
                    <span className="text-sm font-medium">Fast Delivery</span>
                  </div>
                </div>

                <Button className="w-full h-12 text-base font-medium" onClick={() => setStep(4)}>
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card className="border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white">
                  <CreditCard className="h-5 w-5" />
                </div>
                <span>Payment Method</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <RadioGroup className="space-y-4">
                  <RadioGroupItem
                    value="razorpay"
                    id="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onClick={() => setPaymentMethod("razorpay")}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Wallet className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">Razorpay</span>
                      </div>
                      <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="h-8 w-8" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pay securely with credit/debit cards, UPI, and more
                    </p>
                  </RadioGroupItem>
                </RadioGroup>

                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-primary mr-2" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your payment information is processed securely. We do not store credit card details.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    className="w-full h-12 text-base font-medium"
                    variant="default"
                    disabled={!paymentMethod || isProcessing}
                    onClick={handlePayment}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ₹{totalAmount}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 5:
        return (
          <Card className="border-none shadow-lg overflow-hidden">
            <div className="h-2 bg-green-500 w-full"></div>
            <CardHeader className="bg-gradient-to-r from-green-100 to-green-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 justify-center text-green-600">
                <PartyPopper className="h-6 w-6" />
                Payment Successful!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center p-6">
              <div className="py-8 space-y-6">
                <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600 mb-2">Thank You!</p>
                  <p className="text-lg">Your order has been placed successfully.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    A confirmation email has been sent to your email address.
                  </p>
                </div>

                <div className="bg-green-50 rounded-xl p-4 inline-block">
                  <p className="text-sm text-green-700">
                    Estimated delivery: <span className="font-semibold">3-5 business days</span>
                  </p>
                </div>

                <Button className="mt-4 h-12 px-8" onClick={() => (window.location.href = "/")}>
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 pb-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        {/* Vertical Step Indicator */}
        <div className="order-2 md:order-1">
          <Card className="border-none shadow-lg">
            <CardContent className="p-4">
              <div className="space-y-2">
                {steps.map((s, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                      step === index + 1
                        ? "bg-primary text-white"
                        : step > index + 1
                          ? "bg-green-100 text-green-700"
                          : "hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${
                        step === index + 1
                          ? "bg-white text-primary"
                          : step > index + 1
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {getStepIcon(index)}
                    </div>
                    <div className="font-medium">{s.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 bg-primary/5 rounded-xl p-5 border border-primary/20">
            <h3 className="font-medium mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Order Protection
            </h3>
            <p className="text-sm text-muted-foreground">
              Your order is protected by our secure payment system and comes with a 30-day money-back guarantee.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="order-1 md:order-2">{renderStep()}</div>
      </div>
    </div>
  )
}

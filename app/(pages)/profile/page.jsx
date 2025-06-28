'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { 
  getProfile, 
  updateProfile, 
  requestEmailVerification,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress 
} from '../../lib/profile'
import { 
  PencilIcon, 
  PlusIcon, 
  TrashIcon, 
  Home,
  Building2,
  Users,
  Heart,
  MapPin,
  Loader2,
  Star
} from 'lucide-react'

const ProfilePage = () => {
    const [profile, setProfile] = useState(null)
    const [addresses, setAddresses] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [isAddingAddress, setIsAddingAddress] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)
    const [loading, setLoading] = useState(true)
    const [addressLoading, setAddressLoading] = useState(false)

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: ''
    })

    // Updated address form with new schema fields
    const [addressForm, setAddressForm] = useState({
        name: '',
        addressType: 'HOME',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        phoneNumber: '',
        neighborhood: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'IN',
        deliveryInstructions: '',
        isDefault: false
    })

    // Address type options with icons
    const addressTypes = [
        { value: 'HOME', label: 'Home', icon: Home },
        { value: 'OFFICE', label: 'Office', icon: Building2 },
        { value: 'FRIEND', label: 'Friend', icon: Users },
        { value: 'FAMILY', label: 'Family', icon: Heart },
        { value: 'BUSINESS', label: 'Business', icon: Building2 },
        { value: 'OTHER', label: 'Other', icon: MapPin }
    ]

    useEffect(() => {
        loadProfile()
        loadAddresses()
    }, [])

    const loadProfile = async () => {
        try {
            const data = await getProfile()
            setProfile(data)
            setFormData({
                name: data.name || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || ''
            })
            setLoading(false)
        } catch (error) {
            toast.error(error.message)
            setLoading(false)
        }
    }

    const loadAddresses = async () => {
        try {
            setAddressLoading(true)
            const response = await getAddresses()
            console.log('Address response:', response)
            
            // Handle the new success response structure
            const addressList = response?.success ? response.data : (Array.isArray(response) ? response : [])
            setAddresses(addressList)
        } catch (error) {
            console.error('Error loading addresses:', error)
            toast.error(error.message || 'Failed to load addresses')
            setAddresses([])
        } finally {
            setAddressLoading(false)
        }
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        try {
            const data = await updateProfile(formData)
            setProfile(data)
            setIsEditing(false)
            toast.success('Profile updated successfully')
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleRequestVerification = async () => {
        try {
            await requestEmailVerification()
            toast.success('Verification email sent')
        } catch (error) {
            toast.error(error.message)
        }
    }

    const resetAddressForm = () => {
        setAddressForm({
            name: '',
            addressType: 'HOME',
            addressLine1: '',
            addressLine2: '',
            landmark: '',
            phoneNumber: '',
            neighborhood: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'IN',
            deliveryInstructions: '',
            isDefault: false
        })
    }

    const handleAddAddress = async (e) => {
        e.preventDefault()
        try {
            setAddressLoading(true)
            const response = await addAddress(addressForm)
            console.log('Add address response:', response)
            
            // Handle the new response structure
            const newAddress = response?.success ? response.data : response
            if (newAddress) {
                setAddresses([newAddress, ...addresses])
                setIsAddingAddress(false)
                resetAddressForm()
                toast.success('Address added successfully')
            }
        } catch (error) {
            console.error('Error adding address:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to add address')
        } finally {
            setAddressLoading(false)
        }
    }

    const handleUpdateAddress = async (e) => {
        e.preventDefault()
        try {
            setAddressLoading(true)
            const response = await updateAddress(editingAddress.id, addressForm)
            console.log('Update address response:', response)
            
            // Handle the new response structure
            const updatedAddress = response?.success ? response.data : response
            if (updatedAddress) {
                setAddresses(addresses.map(addr => 
                    addr.id === updatedAddress.id ? updatedAddress : addr
                ))
                setEditingAddress(null)
                resetAddressForm()
                toast.success('Address updated successfully')
            }
        } catch (error) {
            console.error('Error updating address:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to update address')
        } finally {
            setAddressLoading(false)
        }
    }

    const handleDeleteAddress = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return
        
        try {
            setAddressLoading(true)
            const response = await deleteAddress(id)
            
            if (response?.success) {
                setAddresses(addresses.filter(addr => addr.id !== id))
                toast.success('Address deleted successfully')
            }
        } catch (error) {
            console.error('Error deleting address:', error)
            toast.error(error.response?.data?.message || error.message || 'Failed to delete address')
        } finally {
            setAddressLoading(false)
        }
    }

    const getAddressTypeIcon = (type) => {
        const addressType = addressTypes.find(t => t.value === type)
        return addressType ? addressType.icon : MapPin
    }

    const formatAddress = (address) => {
        const parts = []
        if (address.addressLine1) parts.push(address.addressLine1)
        if (address.addressLine2) parts.push(address.addressLine2)
        if (address.landmark) parts.push(`Near ${address.landmark}`)
        if (address.neighborhood) parts.push(address.neighborhood)
        
        const mainAddress = parts.join(', ')
        const cityState = `${address.city}${address.state ? `, ${address.state}` : ''} ${address.postalCode || ''}`.trim()
        
        return { mainAddress, cityState }
    }

    const startEditingAddress = (address) => {
        setEditingAddress(address)
        setAddressForm({
            name: address.name || '',
            addressType: address.addressType || 'HOME',
            addressLine1: address.addressLine1 || '',
            addressLine2: address.addressLine2 || '',
            landmark: address.landmark || '',
            phoneNumber: address.phoneNumber || '',
            neighborhood: address.neighborhood || '',
            city: address.city || '',
            state: address.state || '',
            postalCode: address.postalCode || '',
            country: address.country || 'IN',
            deliveryInstructions: address.deliveryInstructions || '',
            isDefault: address.isDefault || false
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                    <span className="text-gray-600">Loading profile...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-10 min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">My Profile</h1>
                
                {/* Profile Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-center text-2xl font-bold">
                                {profile?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-semibold text-gray-900">{profile?.name}</h2>
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-600">{profile?.email}</p>
                                    {profile?.verified ? (
                                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                                            Verified
                                        </span>
                                    ) : (
                                        <button 
                                            onClick={handleRequestVerification}
                                            className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium hover:bg-red-200 transition-colors"
                                        >
                                            Verify Email
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <PencilIcon className="h-4 w-4" />
                            Edit Profile
                        </button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input 
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                    <input 
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button 
                                    type="submit"
                                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                >
                                    Save Changes
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
                                <p className="text-gray-900">{profile?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                                <p className="text-gray-900">{profile?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
                                <p className="text-gray-900">{profile?.phoneNumber || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Account Status</p>
                                <p className="text-gray-900">
                                    {profile?.verified ? (
                                        <span className="text-green-600 font-medium">✓ Verified</span>
                                    ) : (
                                        <span className="text-red-600 font-medium">⚠ Unverified</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Addresses Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">My Addresses</h3>
                        <button
                            onClick={() => setIsAddingAddress(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Add New Address
                        </button>
                    </div>

                    {/* Address Form */}
                    {(isAddingAddress || editingAddress) && (
                        <form 
                            onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
                            className="mb-6 p-6 border border-gray-200 rounded-xl bg-gray-50"
                        >
                            <h4 className="font-semibold text-gray-900 mb-4">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h4>
                            
                            <div className="space-y-5">
                                {/* Name and Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Name (Optional)</label>
                                        <input 
                                            type="text"
                                            placeholder="e.g., Home, Office"
                                            value={addressForm.name}
                                            onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                                        <select
                                            value={addressForm.addressType}
                                            onChange={(e) => setAddressForm({...addressForm, addressType: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                        >
                                            {addressTypes.map(type => (
                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Address Lines */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1 *</label>
                                        <input 
                                            type="text"
                                            placeholder="Street address"
                                            value={addressForm.addressLine1}
                                            onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2</label>
                                        <input 
                                            type="text"
                                            placeholder="Apartment, suite, unit, building, floor, etc."
                                            value={addressForm.addressLine2}
                                            onChange={(e) => setAddressForm({...addressForm, addressLine2: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Landmark and Neighborhood */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
                                        <input 
                                            type="text"
                                            placeholder="Near landmark"
                                            value={addressForm.landmark}
                                            onChange={(e) => setAddressForm({...addressForm, landmark: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Neighborhood/Area</label>
                                        <input 
                                            type="text"
                                            placeholder="Area or neighborhood"
                                            value={addressForm.neighborhood}
                                            onChange={(e) => setAddressForm({...addressForm, neighborhood: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* City, State, Postal Code */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                                        <input 
                                            type="text"
                                            placeholder="City"
                                            value={addressForm.city}
                                            onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                        <input 
                                            type="text"
                                            placeholder="State"
                                            value={addressForm.state}
                                            onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                                        <input 
                                            type="text"
                                            placeholder="Postal code"
                                            value={addressForm.postalCode}
                                            onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Phone and Country */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input 
                                            type="tel"
                                            placeholder="Phone number"
                                            value={addressForm.phoneNumber}
                                            onChange={(e) => setAddressForm({...addressForm, phoneNumber: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                        <select
                                            value={addressForm.country}
                                            onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                                        >
                                            <option value="IN">🇮🇳 India</option>
                                            <option value="US">🇺🇸 United States</option>
                                            <option value="GB">🇬🇧 United Kingdom</option>
                                            <option value="CA">🇨🇦 Canada</option>
                                            <option value="AU">🇦🇺 Australia</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Delivery Instructions */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Instructions</label>
                                    <textarea
                                        placeholder="Any special delivery instructions..."
                                        value={addressForm.deliveryInstructions}
                                        onChange={(e) => setAddressForm({...addressForm, deliveryInstructions: e.target.value})}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 resize-none transition-colors"
                                    />
                                </div>

                                {/* Default Address Checkbox */}
                                <label className="flex items-center gap-3 cursor-pointer p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={addressForm.isDefault}
                                        onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Set as default address</span>
                                </label>
                            </div>

                            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                                <button 
                                    type="submit"
                                    disabled={addressLoading}
                                    className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 transition-colors font-medium flex items-center gap-2"
                                >
                                    {addressLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            {editingAddress ? 'Updating...' : 'Adding...'}
                                        </>
                                    ) : (
                                        editingAddress ? 'Update Address' : 'Add Address'
                                    )}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setIsAddingAddress(false)
                                        setEditingAddress(null)
                                        resetAddressForm()
                                    }}
                                    className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Address List */}
                    <div className="space-y-4">
                        {addressLoading && !isAddingAddress && !editingAddress ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-red-500" />
                                <span className="ml-2 text-gray-600">Loading addresses...</span>
                            </div>
                        ) : addresses.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg font-medium">No addresses found</p>
                                <p className="text-gray-400 text-sm mt-1">Add your first address to get started</p>
                            </div>
                        ) : (
                            addresses.map((address) => {
                                const AddressIcon = getAddressTypeIcon(address.addressType)
                                const { mainAddress, cityState } = formatAddress(address)
                                
                                return (
                                    <div 
                                        key={address.id}
                                        className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-gray-100 rounded-lg">
                                                    <AddressIcon className="h-5 w-5 text-gray-600" />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-semibold text-gray-900">
                                                            {address.name || address.addressType}
                                                        </h4>
                                                        {address.isDefault && (
                                                            <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-medium flex items-center gap-1">
                                                                <Star className="h-3 w-3" />
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-700 mb-1 leading-relaxed">{mainAddress}</p>
                                                    <p className="text-gray-600 mb-1">{cityState}</p>
                                                    {address.phoneNumber && (
                                                        <p className="text-gray-500 text-sm">📞 {address.phoneNumber}</p>
                                                    )}
                                                    {address.deliveryInstructions && (
                                                        <p className="text-gray-500 text-sm mt-2 italic">
                                                            "{address.deliveryInstructions}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => startEditingAddress(address)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Edit address"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAddress(address.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Delete address"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
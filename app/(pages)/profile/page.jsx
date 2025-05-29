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
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react'

const ProfilePage = () => {
    const [profile, setProfile] = useState(null)
    const [addresses, setAddresses] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [isAddingAddress, setIsAddingAddress] = useState(false)
    const [editingAddress, setEditingAddress] = useState(null)
    const [loading, setLoading] = useState(true)

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: ''
    })

    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        phoneNumber: ''
    })

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
            const data = await getAddresses()
            setAddresses(data)
        } catch (error) {
            toast.error(error.message)
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

    const handleAddAddress = async (e) => {
        e.preventDefault()
        try {
            const data = await addAddress(addressForm)
            setAddresses([data, ...addresses])
            setIsAddingAddress(false)
            setAddressForm({
                street: '',
                city: '',
                state: '',
                zip: '',
                phoneNumber: ''
            })
            toast.success('Address added successfully')
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleUpdateAddress = async (e) => {
        e.preventDefault()
        try {
            const data = await updateAddress(editingAddress.id, addressForm)
            setAddresses(addresses.map(addr => 
                addr.id === data.id ? data : addr
            ))
            setEditingAddress(null)
            setAddressForm({
                street: '',
                city: '',
                state: '',
                zip: '',
                phoneNumber: ''
            })
            toast.success('Address updated successfully')
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDeleteAddress = async (id) => {
        try {
            await deleteAddress(id)
            setAddresses(addresses.filter(addr => addr.id !== id))
            toast.success('Address deleted successfully')
        } catch (error) {
            toast.error(error.message)
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    }

    return (
        <div className="mt-10 min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">My Profile</h1>
                
                {/* Profile Section */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                                {profile?.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div className="ml-4">
                                <h2 className="text-xl font-semibold">{profile?.name}</h2>
                                <div className="flex items-center">
                                    <p className="text-gray-600">{profile?.email}</p>
                                    {!profile?.verified && (
                                        <button 
                                            onClick={handleRequestVerification}
                                            className="ml-2 text-sm text-blue-600 hover:underline"
                                        >
                                            Verify Email
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit Profile
                        </button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-gray-600">Full Name</label>
                                <input 
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600">Email</label>
                                <input 
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600">Phone</label>
                                <input 
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    className="w-full border rounded-md p-2"
                                />
                            </div>
                            <div className="flex space-x-4">
                                <button 
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Name</p>
                                <p className="font-medium">{profile?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Email</p>
                                <p className="font-medium">{profile?.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Phone</p>
                                <p className="font-medium">{profile?.phoneNumber || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Account Status</p>
                                <p className="font-medium">
                                    {profile?.verified ? (
                                        <span className="text-green-600">Verified</span>
                                    ) : (
                                        <span className="text-yellow-600">Unverified</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Addresses Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">My Addresses</h3>
                        <button
                            onClick={() => setIsAddingAddress(true)}
                            className="flex items-center text-blue-600 hover:text-blue-700"
                        >
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Add New Address
                        </button>
                    </div>

                    {(isAddingAddress || editingAddress) && (
                        <form 
                            onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
                            className="mb-6 p-4 border rounded-lg"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600">Street Address</label>
                                    <input 
                                        type="text"
                                        value={addressForm.street}
                                        onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                                        className="w-full border rounded-md p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600">City</label>
                                    <input 
                                        type="text"
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                                        className="w-full border rounded-md p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600">State</label>
                                    <input 
                                        type="text"
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                                        className="w-full border rounded-md p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600">ZIP Code</label>
                                    <input 
                                        type="text"
                                        value={addressForm.zip}
                                        onChange={(e) => setAddressForm({...addressForm, zip: e.target.value})}
                                        className="w-full border rounded-md p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600">Phone Number</label>
                                    <input 
                                        type="tel"
                                        value={addressForm.phoneNumber}
                                        onChange={(e) => setAddressForm({...addressForm, phoneNumber: e.target.value})}
                                        className="w-full border rounded-md p-2"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex space-x-4">
                                <button 
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
                                    {editingAddress ? 'Update Address' : 'Add Address'}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setIsAddingAddress(false)
                                        setEditingAddress(null)
                                        setAddressForm({
                                            street: '',
                                            city: '',
                                            state: '',
                                            zip: '',
                                            phoneNumber: ''
                                        })
                                    }}
                                    className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <div 
                                key={address.id}
                                className="border rounded-lg p-4 flex justify-between items-start"
                            >
                                <div>
                                    <p className="font-medium">{address.street}</p>
                                    <p className="text-gray-600">
                                        {address.city}, {address.state} {address.zip}
                                    </p>
                                    {address.phoneNumber && (
                                        <p className="text-gray-600">{address.phoneNumber}</p>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingAddress(address)
                                            setAddressForm({
                                                street: address.street,
                                                city: address.city,
                                                state: address.state,
                                                zip: address.zip,
                                                phoneNumber: address.phoneNumber || ''
                                            })
                                        }}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAddress(address.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
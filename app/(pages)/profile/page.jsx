
'use client'
import React from 'react'



const ProfilePage = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">My Profile</h1>
                
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <div className="flex items-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gray-300 mr-4">
                            {/* Profile Image Placeholder */}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">John Doe</h2>
                            <p className="text-gray-600">john.doe@example.com</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Personal Information</h3>
                            <div>
                                <label className="block text-gray-600">Full Name</label>
                                <input 
                                    type="text" 
                                    className="w-full border rounded-md p-2"
                                    defaultValue="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600">Email</label>
                                <input 
                                    type="email" 
                                    className="w-full border rounded-md p-2"
                                    defaultValue="john.doe@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600">Phone</label>
                                <input 
                                    type="tel" 
                                    className="w-full border rounded-md p-2"
                                    defaultValue="+1 234 567 8900"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Shipping Address</h3>
                            <div>
                                <label className="block text-gray-600">Street Address</label>
                                <input 
                                    type="text" 
                                    className="w-full border rounded-md p-2"
                                    defaultValue="123 Main St"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600">City</label>
                                <input 
                                    type="text" 
                                    className="w-full border rounded-md p-2"
                                    defaultValue="New York"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600">Postal Code</label>
                                <input 
                                    type="text" 
                                    className="w-full border rounded-md p-2"
                                    defaultValue="10001"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Order History</h3>
                    <div className="space-y-4">
                        <div className="border-b pb-4">
                            <p className="font-medium">Order #12345</p>
                            <p className="text-gray-600">Date: 01/01/2024</p>
                            <p className="text-gray-600">Total: $299.99</p>
                            <p className="text-green-600">Status: Delivered</p>
                        </div>
                        {/* Add more order history items here */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
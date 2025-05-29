'use client';
import { useState, useEffect } from 'react';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../lib/profile';
import { X, Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddressDialog = ({ onAddressSelect, selectedAddress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(selectedAddress?.id || null);
  const [loading, setLoading] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    phoneNumber: '', // Backend expects phoneNumber
    city: '',
    state: '',
    zip: '', // Backend expects zip
  });

  // Update selected when selectedAddress prop changes
  useEffect(() => {
    setSelected(selectedAddress?.id || null);
  }, [selectedAddress]);

  // Fetch addresses when dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await getAddresses();
      console.log('Fetched addresses:', response); // Debug log
      // Ensure we always have an array and normalize the data structure
      const addressList = Array.isArray(response) ? response : (response?.data || []);
      
      // Debug: Check for duplicate IDs
      const ids = addressList.map(addr => addr.id);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicateIds.length > 0) {
        console.warn('Duplicate address IDs found:', duplicateIds);
      }
      
      setAddresses(addressList);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      toast.error('Failed to load addresses');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    const address = addresses.find(addr => addr.id === selected);
    console.log('Selected address:', address); // Debug log
    if (address) {
      // Transform the data to match your display component's expectations
      const transformedAddress = {
        ...address,
        phone: address.phoneNumber, // Map phoneNumber to phone
        zipCode: address.zip, // Map zip to zipCode
        name: address.name || 'Address', // Add default name if missing
        type: address.type || 'Home' // Add default type if missing
      };
      console.log('Transformed address:', transformedAddress); // Debug log
      onAddressSelect(transformedAddress);
      setIsOpen(false);
    } else {
      toast.error('Please select an address');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await addAddress(formData);
      console.log('Add address response:', response); // Debug log
      
      // Handle different response structures
      const newAddress = response?.data || response;
      if (newAddress) {
        setAddresses([...addresses, newAddress]);
        setIsAddingNew(false);
        toast.success('Address added successfully');
        // Reset form
        setFormData({
          street: '',
          phoneNumber: '',
          city: '',
          state: '',
          zip: '',
        });
      }
    } catch (error) {
      console.error('Failed to add address:', error);
      toast.error('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      setAddresses(addresses.filter(addr => addr.id !== id));
      if (selected === id) setSelected(null);
      toast.success('Address deleted successfully');
    } catch (error) {
      console.error('Failed to delete address:', error);
      toast.error('Failed to delete address');
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm"
      >
        {selectedAddress ? 'Change Address' : 'Select Address'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 backdrop-blur-sm bg-black/30"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[550px] mx-4">
            <div className="bg-white rounded-xl p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {isAddingNew ? 'Add New Address' : 'Select Delivery Address'}
                </h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : isAddingNew ? (
                <form onSubmit={handleAddAddress} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={formData.street}
                      onChange={(e) => setFormData({...formData, street: e.target.value})}
                      className="col-span-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
                      required
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
                      required
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={formData.zip}
                      onChange={(e) => setFormData({...formData, zip: e.target.value})}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300"
                    >
                      {loading ? 'Adding...' : 'Add Address'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {addresses.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <p className="text-gray-500">No addresses found</p>
                      </div>
                    ) : (
                      addresses.map((address, index) => (
                        <label
                          key={address.id || `address-${index}`}
                          className={`block p-5 rounded-xl cursor-pointer transition-all ${
                            selected === address.id 
                              ? 'bg-gray-50 border-2 border-black' 
                              : 'bg-white border border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <input
                              type="radio"
                              name="address"
                              value={address.id}
                              checked={selected === address.id}
                              onChange={() => setSelected(address.id)}
                              className="mt-1"
                            />
                            <div className="flex-grow">
                              <p className="text-base font-medium text-gray-900">{address.street}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {address.city}, {address.state} {address.zip}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Phone: {address.phoneNumber}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteAddress(address.id);
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </label>
                      ))
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between">
                    <button
                      onClick={() => setIsAddingNew(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Address
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSelect}
                        disabled={!selected}
                        className={`px-6 py-2.5 rounded-lg text-white ${
                          selected 
                            ? 'bg-black hover:bg-gray-900' 
                            : 'bg-gray-200 cursor-not-allowed'
                        }`}
                      >
                        Deliver Here
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddressDialog;
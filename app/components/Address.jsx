'use client';
import { useState, useEffect } from 'react';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../lib/profile';
import { X, Plus, Trash2, Edit2, Loader2, Home, Building2, Users, Heart, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const AddressDialog = ({ onAddressSelect, selectedAddress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(selectedAddress?.id || null);
  const [loading, setLoading] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    name: 'HOME',
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
  });

  // Address type options with icons
  const addressTypes = [
    { value: 'HOME', label: 'Home', icon: Home },
    { value: 'OFFICE', label: 'Office', icon: Building2 },
    { value: 'FRIEND', label: 'Friend', icon: Users },
    { value: 'FAMILY', label: 'Family', icon: Heart },
    { value: 'BUSINESS', label: 'Business', icon: Building2 },
    { value: 'OTHER', label: 'Other', icon: MapPin }
  ];

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
      console.log('Fetched addresses:', response);
      
      // Handle the new response structure
      const addressList = response?.success ? response.data : (Array.isArray(response) ? response : []);
      
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
    console.log('Selected address:', address);
    if (address) {
      // Transform the data to match your display component's expectations
      const transformedAddress = {
        ...address,
        // Map new fields to old field names for backward compatibility
        street: address.addressLine1,
        phone: address.phoneNumber,
        zipCode: address.postalCode,
        type: address.addressType || 'HOME'
      };
      console.log('Transformed address:', transformedAddress);
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
      console.log('Add address response:', response);
      
      // Handle the new response structure
      const newAddress = response?.success ? response.data : response;
      if (newAddress) {
        setAddresses([...addresses, newAddress]);
        setIsAddingNew(false);
        toast.success('Address added successfully');
        // Reset form
        setFormData({
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
        });
      }
    } catch (error) {
      console.error('Failed to add address:', error);
      toast.error(error.response?.data?.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const response = await deleteAddress(id);
      if (response?.success) {
        setAddresses(addresses.filter(addr => addr.id !== id));
        if (selected === id) setSelected(null);
        toast.success('Address deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
      toast.error('Failed to delete address');
    }
  };

  const getAddressTypeIcon = (type) => {
    const addressType = addressTypes.find(t => t.value === type);
    return addressType ? addressType.icon : MapPin;
  };

  const formatAddress = (address) => {
    const parts = [];
    if (address.addressLine1) parts.push(address.addressLine1);
    if (address.addressLine2) parts.push(address.addressLine2);
    if (address.landmark) parts.push(`Near ${address.landmark}`);
    if (address.neighborhood) parts.push(address.neighborhood);
    
    const mainAddress = parts.join(', ');
    const cityState = `${address.city}${address.state ? `, ${address.state}` : ''} ${address.postalCode || ''}`.trim();
    
    return { mainAddress, cityState };
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
      >
        {selectedAddress ? 'Change Address' : 'Select Address'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 backdrop-blur-sm bg-black/30"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Fixed: Proper width and centering with margins */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4 max-h-[85vh] overflow-scroll">
            <div className="bg-white rounded-xl shadow-2xl flex flex-col max-h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
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

              {/* Content - Enhanced scrolling and spacing */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                  </div>
                ) : isAddingNew ? (
                  <div className="p-6">
                    <form onSubmit={handleAddAddress} className="space-y-5">
                      {/* Address Name and Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Address Name (Optional)"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                        />
                        <select
                          value={formData.addressType}
                          onChange={(e) => setFormData({...formData, addressType: e.target.value})}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                        >
                          {addressTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Address Lines */}
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Address Line 1 *"
                          value={formData.addressLine1}
                          onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                          required
                        />
                        
                        <input
                          type="text"
                          placeholder="Address Line 2 (Apartment, Suite, etc.)"
                          value={formData.addressLine2}
                          onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                        />
                      </div>

                      {/* Landmark and Neighborhood */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Landmark"
                          value={formData.landmark}
                          onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                        />
                        <input
                          type="text"
                          placeholder="Neighborhood/Area"
                          value={formData.neighborhood}
                          onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                        />
                      </div>

                      {/* City, State, Postal Code */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="City *"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                          required
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                        />
                        <input
                          type="text"
                          placeholder="Postal Code"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                        />
                      </div>

                      {/* Phone Number and Country */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                        />
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({...formData, country: e.target.value})}
                          className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-colors"
                        >
                          <option value="IN">🇮🇳 India</option>
                          <option value="US">🇺🇸 United States</option>
                          <option value="GB">🇬🇧 United Kingdom</option>
                          <option value="CA">🇨🇦 Canada</option>
                          <option value="AU">🇦🇺 Australia</option>
                        </select>
                      </div>

                      {/* Delivery Instructions */}
                      <textarea
                        placeholder="Delivery Instructions (Optional)"
                        value={formData.deliveryInstructions}
                        onChange={(e) => setFormData({...formData, deliveryInstructions: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 resize-none transition-colors"
                      />

                      {/* Default Address Checkbox */}
                      <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.isDefault}
                          onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                          className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700 font-medium">Set as default address</span>
                      </label>

                      {/* Form Actions */}
                      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setIsAddingNew(false)}
                          className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            'Add Address'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="p-6">
                    {/* Address List */}
                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                      {addresses.length === 0 ? (
                        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="h-10 w-10 text-red-500" />
                          </div>
                          <p className="text-gray-600 text-lg font-medium mb-2">No addresses found</p>
                          <p className="text-gray-500 text-sm">Add your first address to get started</p>
                        </div>
                      ) : (
                        addresses.map((address, index) => {
                          const AddressIcon = getAddressTypeIcon(address.addressType);
                          const { mainAddress, cityState } = formatAddress(address);
                          
                          return (
                            <label
                              key={address.id || `address-${index}`}
                              className={`block p-5 rounded-xl cursor-pointer transition-all duration-200 ${
                                selected === address.id 
                                  ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-500 shadow-md' 
                                  : 'bg-white border border-gray-200 hover:border-red-300 hover:shadow-sm'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <input
                                  type="radio"
                                  name="address"
                                  value={address.id}
                                  checked={selected === address.id}
                                  onChange={() => setSelected(address.id)}
                                  className="mt-1 text-red-600 border-gray-300 focus:ring-red-500 w-4 h-4"
                                />
                                
                                <div className={`p-3 rounded-lg transition-colors ${
                                  selected === address.id ? 'bg-red-200' : 'bg-gray-100'
                                }`}>
                                  <AddressIcon className={`h-5 w-5 ${
                                    selected === address.id ? 'text-red-700' : 'text-gray-600'
                                  }`} />
                                </div>
                                
                                <div className="flex-grow">
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="font-semibold text-gray-900">
                                      {address.name || address.addressType}
                                    </p>
                                    {address.isDefault && (
                                      <span className="px-2 py-1 bg-red-600 text-white text-xs rounded-full font-medium">
                                        Default
                                      </span>
                                    )}
                                  </div>
                                  
                                  <p className="text-sm text-gray-700 mb-1 leading-relaxed">{mainAddress}</p>
                                  <p className="text-sm text-gray-600 mb-1">{cityState}</p>
                                  
                                  {address.phoneNumber && (
                                    <p className="text-sm text-gray-500">
                                      📞 {address.phoneNumber}
                                    </p>
                                  )}
                                  
                                  {address.deliveryInstructions && (
                                    <p className="text-xs text-gray-500 mt-2 italic">
                                      "{address.deliveryInstructions}"
                                    </p>
                                  )}
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
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              {!isAddingNew && (
                <div className="p-6 pt-4 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <button
                      onClick={() => setIsAddingNew(true)}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Address
                    </button>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSelect}
                        disabled={!selected}
                        className={`px-8 py-2.5 rounded-lg text-white font-medium transition-all duration-200 ${
                          selected 
                            ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg transform hover:scale-105' 
                            : 'bg-gray-200 cursor-not-allowed'
                        }`}
                      >
                        {selected ? 'Deliver Here 🚚' : 'Select Address'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddressDialog;
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiUpload } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

const AddTicket = () => {
  const { user, userRole, token } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedPerks, setSelectedPerks] = useState([]);

  const transportTypes = ['Bus', 'Train', 'Launch', 'Plane'];
  const availablePerks = [
    'AC',
    'WiFi',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Charging Port',
    'Entertainment',
  ];

  const handlePerkChange = perk => {
    setSelectedPerks(prev =>
      prev.includes(perk) ? prev.filter(p => p !== perk) : [...prev, perk]
    );
  };

  const uploadImage = async file => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        return response.data.data.url;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Check if user is vendor before showing the form
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-4">
            Please Login First
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need to be logged in to add tickets.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary px-6 py-2"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (userRole !== 'vendor') {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Vendor Access Required
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Only vendors can add tickets. Please apply to become a vendor first.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/dashboard/vendor-request')}
              className="btn-primary px-6 py-2"
            >
              Apply as Vendor
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary px-6 py-2"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async data => {
    try {
      // Upload image if selected
      let imageUrl = '';
      if (data.image && data.image[0]) {
        const uploadedUrl = await uploadImage(data.image[0]);
        if (!uploadedUrl) return; // Stop if image upload failed
        imageUrl = uploadedUrl;
      }

      // Prepare ticket data
      const ticketData = {
        title: data.title,
        from: data.from,
        to: data.to,
        transportType: data.transportType,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        departure: data.departureDateTime,
        perks: selectedPerks,
        image: imageUrl,
      };

      // Send request to server with token
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tickets`,
        ticketData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        toast.success('Ticket added successfully! Waiting for admin approval.');

        // Reset form
        reset();
        setImagePreview('');
        setSelectedPerks([]);

        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        toast.error(response.data.message || 'Failed to add ticket');
      }
    } catch (error) {
      console.error('Submit error:', error);

      if (error.response) {
        // Server responded with error
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          'Failed to add ticket';
        toast.error(errorMessage);

        // Handle specific error cases
        if (error.response.status === 401) {
          toast.error('Session expired. Please login again.');
        } else if (error.response.status === 403) {
          toast.error('You are not authorized to add tickets');
        }
      } else if (error.request) {
        // Request made but no response
        toast.error('Network error. Please check your connection.');
      } else {
        // Other errors
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Add New Ticket
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          As a vendor, you can add tickets for approval by admin.
        </p>
      </div>

      <div className="card bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Ticket Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ticket Title *
            </label>
            <input
              type="text"
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 5,
                  message: 'Title must be at least 5 characters',
                },
                maxLength: {
                  value: 100,
                  message: 'Title must be less than 100 characters',
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="e.g., Dhaka to Chittagong AC Bus"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* From and To Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From (Location) *
              </label>
              <input
                type="text"
                {...register('from', {
                  required: 'Starting location is required',
                  minLength: {
                    value: 3,
                    message: 'Location must be at least 3 characters',
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Dhaka"
              />
              {errors.from && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.from.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To (Location) *
              </label>
              <input
                type="text"
                {...register('to', {
                  required: 'Destination is required',
                  minLength: {
                    value: 3,
                    message: 'Location must be at least 3 characters',
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Chittagong"
              />
              {errors.to && (
                <p className="text-red-500 text-sm mt-1">{errors.to.message}</p>
              )}
            </div>
          </div>

          {/* Transport Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transport Type *
            </label>
            <select
              {...register('transportType', {
                required: 'Transport type is required',
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select transport type</option>
              {transportTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.transportType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.transportType.message}
              </p>
            )}
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (per unit) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', {
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be at least $1' },
                    max: {
                      value: 10000,
                      message: 'Price must be less than $10,000',
                    },
                  })}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  placeholder="25.00"
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ticket Quantity *
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                {...register('quantity', {
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Quantity must be at least 1' },
                  max: { value: 1000, message: 'Maximum 1000 tickets' },
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="50"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>

          {/* Departure Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Departure Date & Time *
            </label>
            <input
              type="datetime-local"
              {...register('departureDateTime', {
                required: 'Departure date and time is required',
                validate: value => {
                  const selectedDate = new Date(value);
                  const now = new Date();
                  return (
                    selectedDate > now || 'Departure must be in the future'
                  );
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.departureDateTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.departureDateTime.message}
              </p>
            )}
          </div>

          {/* Perks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Perks (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availablePerks.map(perk => (
                <label
                  key={perk}
                  className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedPerks.includes(perk)}
                    onChange={() => handlePerkChange(perk)}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {perk}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ticket Image *
            </label>
            <div className="flex flex-col space-y-4">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to upload image
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG up to 5MB
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  {...register('image', {
                    required: 'Image is required',
                    validate: files => {
                      if (!files || files.length === 0) return true;
                      const file = files[0];
                      if (file.size > 5 * 1024 * 1024) {
                        return 'Image must be less than 5MB';
                      }
                      if (!file.type.startsWith('image/')) {
                        return 'File must be an image';
                      }
                      return true;
                    },
                  })}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {uploading && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Uploading image...
                  </span>
                </div>
              )}

              {errors.image && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </p>
              )}

              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Image Preview:
                  </p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-xs h-auto object-cover rounded-lg shadow"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Vendor Info (readonly) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Vendor Name
              </label>
              <input
                type="text"
                value={user?.displayName || 'N/A'}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Vendor Email
              </label>
              <input
                type="email"
                value={user?.email || 'N/A'}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Vendor Role
              </label>
              <input
                type="text"
                value={userRole ? `Vendor (${userRole})` : 'Loading...'}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading || isSubmitting}
            className={`btn-primary w-full py-3 rounded-lg font-medium transition-colors ${
              uploading || isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-primary-dark'
            }`}
          >
            {uploading
              ? 'Uploading...'
              : isSubmitting
              ? 'Adding Ticket...'
              : 'Add Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTicket;

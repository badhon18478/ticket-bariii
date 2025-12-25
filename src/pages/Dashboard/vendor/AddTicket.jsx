// ========== 2. AddTicket.jsx ==========
import { useState } from 'react';
// import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
// import { AuthContext } from '../../../AuthContext';
import { useAuth } from '../../../contexts/AuthProvider';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AddTicket = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    from: '',
    to: '',
    transportType: 'Bus',
    price: '',
    ticketQuantity: '',
    departureDateTime: '',
    perks: [],
    image: '',
    vendorName: user?.displayName || '',
    vendorEmail: user?.email || '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const perkOptions = [
    'AC',
    'WiFi',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snacks',
    'Charging Port',
    'Entertainment',
  ];

  const handlePerkChange = perk => {
    setFormData(prev => ({
      ...prev,
      perks: prev.perks.includes(perk)
        ? prev.perks.filter(p => p !== perk)
        : [...prev.perks, perk],
    }));
  };

  const uploadToImgBB = async file => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axiosSecure.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );
      return response.data.data.url;
    } catch (error) {
      throw new Error('Image upload failed');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        imageUrl = await uploadToImgBB(imageFile);
      }

      await axiosSecure.post(`/api/tickets`, {
        ...formData,
        image: imageUrl,
        price: parseFloat(formData.price),
        ticketQuantity: parseInt(formData.ticketQuantity),
      });

      toast.success('Ticket added successfully! Waiting for admin approval.');

      // Reset form
      setFormData({
        title: '',
        from: '',
        to: '',
        transportType: 'Bus',
        price: '',
        ticketQuantity: '',
        departureDateTime: '',
        perks: [],
        image: '',
        vendorName: user?.displayName || '',
        vendorEmail: user?.email || '',
      });
      setImageFile(null);
    } catch (error) {
      toast.error('Failed to add ticket');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Ticket</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Ticket Title
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={e =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Transport Type
            </label>
            <select
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.transportType}
              onChange={e =>
                setFormData({ ...formData, transportType: e.target.value })
              }
            >
              <option value="Bus">Bus</option>
              <option value="Train">Train</option>
              <option value="Launch">Launch</option>
              <option value="Plane">Plane</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              From Location
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.from}
              onChange={e => setFormData({ ...formData, from: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              To Location
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.to}
              onChange={e => setFormData({ ...formData, to: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Price (per ticket)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.price}
              onChange={e =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Ticket Quantity
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.ticketQuantity}
              onChange={e =>
                setFormData({ ...formData, ticketQuantity: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Departure Date & Time
            </label>
            <input
              type="datetime-local"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.departureDateTime}
              onChange={e =>
                setFormData({ ...formData, departureDateTime: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Image Upload
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={e => setImageFile(e.target.files[0])}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Vendor Name (readonly)
            </label>
            <input
              type="text"
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
              value={formData.vendorName}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Vendor Email (readonly)
            </label>
            <input
              type="email"
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
              value={formData.vendorEmail}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Perks</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {perkOptions.map(perk => (
              <label
                key={perk}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.perks.includes(perk)}
                  onChange={() => handlePerkChange(perk)}
                  className="w-4 h-4"
                />
                <span>{perk}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:bg-gray-300"
        >
          {uploading ? 'Adding Ticket...' : 'Add Ticket'}
        </button>
      </form>
    </div>
  );
};

export default AddTicket;

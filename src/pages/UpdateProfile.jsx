import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

import Navbar from '../components/Navber/Navbar';
import Footer from '../components/Footer';

const UpdateProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    photoURL: user?.photoURL || '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpdate = e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    updateUserProfile(formData.name, formData.photoURL)
      .then(() => {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate('/MyProfile');
        }, 1000);
      })
      .catch(error => {
        setError(error.message);
      });
  };

  return (
    <div>
      <title>UpdateProfile</title>
      <Navbar></Navbar>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Update Profile
          </h2>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Photo URL
              </label>
              <input
                type="url"
                value={formData.photoURL}
                onChange={e =>
                  setFormData({ ...formData, photoURL: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-lg hover:scale-105 transition"
            >
              Update Information
            </button>
          </form>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default UpdateProfile;

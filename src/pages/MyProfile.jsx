import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Navbar from '../components/Navber/Navbar';
import Footer from '../components/Footer';

const MyProfile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {' '}
      <title>MyProfile</title>
      <Navbar></Navbar>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-12 px-4 flex flex-col justify-center items-center">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            My Profile
          </h2>

          <div className="text-center space-y-6 md:w-[500px]">
            <img
              src={user?.photoURL || 'https://via.placeholder.com/150'}
              alt={user?.displayName}
              className="w-32 h-32 rounded-full mx-auto border-4 border-purple-500"
            />

            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {user?.displayName}
              </h3>
              <p className="text-gray-600 mt-2">{user?.email}</p>
            </div>

            <Link
              to="/update-profile"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3 rounded-lg hover:scale-105 transition"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default MyProfile;

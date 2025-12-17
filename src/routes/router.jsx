import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register/Register';
// import Home from '../pages/home/Home/Home';
// import About from '../pages/About';
// import Skills from '../pages/Skills';
// import Projects from '../pages/Projects';
// import Contact from '../pages/Contact';
// import About from '../pages/About';

// import Home from '../components/home/Home/Home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: '/login',
        element: <Login></Login>,
      },
      {
        path: '/register',
        element: <Register></Register>,
      },
    ],
  },
]);

import { Link, useRouteError } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

const Error = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-2xl">
        <FiAlertCircle className="text-8xl text-red-500 mx-auto mb-8" />

        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
          Oops!
        </h1>

        <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
          Something went wrong
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
          {error?.statusText ||
            error?.message ||
            'The page you are looking for does not exist.'}
        </p>

        {error?.status === 404 && (
          <p className="text-gray-500 dark:text-gray-500 mb-8">
            Error 404 - Page Not Found
          </p>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center space-x-2"
          >
            <FiHome />
            <span>Back to Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            Go Back
          </button>
        </div>

        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            Need Help?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            If you continue to experience issues, please contact our support
            team at{' '}
            <a
              href="mailto:support@ticketbari.com"
              className="text-primary hover:underline"
            >
              support@ticketbari.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error;

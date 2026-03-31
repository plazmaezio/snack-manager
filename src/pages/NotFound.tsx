import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="p-10 max-w-6xl mx-auto text-center">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for doesn't exist.</p>
      <Link to="/" className="text-brand underline">
        Go back to Home
      </Link>
    </div>
  );
};

export default NotFound;

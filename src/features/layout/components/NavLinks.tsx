import { Link } from "react-router-dom";
import { navLinks } from "../config/navLinks";

const NavLinks = () => (
  <div className="flex gap-4">
    {navLinks.map((link) => (
      <Link
        key={link.label}
        to={link.to}
        className="text-main-text hover:text-brand transition-colors font-medium"
      >
        {link.label}
      </Link>
    ))}
  </div>
);

export default NavLinks;

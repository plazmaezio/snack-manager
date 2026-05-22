import { Link } from "react-router-dom";
import { navLinks } from "../config/navLinks";

interface MobileNavLinksProps {
  onClose: () => void;
}

const MobileNavLinks = ({ onClose }: MobileNavLinksProps) => (
  <>
    {navLinks.map((link) => (
      <Link
        key={link.label}
        to={link.to}
        className="block px-4 py-2 text-main-text hover:bg-brand-bg rounded-md transition-colors"
        onClick={onClose}
      >
        {link.label}
      </Link>
    ))}
  </>
);

export default MobileNavLinks;

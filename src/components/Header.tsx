import { useState } from "react";
import { Link } from "react-router-dom";
import { HamburgerMenu } from "iconsax-reactjs";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Product", path: "/product" },
  ];

  return (
    <nav className="bg-red-500 p-4 flex justify-between items-center relative">
      {/* Logo */}
      <p className="text-2xl font-bold text-white">Insure9ja</p>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6">
        {navLinks.map((link) => (
          <li key={link.label}>
            <Link
              to={link.path}
              className="text-white hover:underline font-medium"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Hamburger Icon (Mobile) */}
      <div className="md:hidden">
        <HamburgerMenu
          size={32}
          color="white"
          variant="Bold"
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer"
        />


      </div>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 right-4 bg-red-500 rounded-lg shadow-lg flex flex-col w-40 p-4 md:hidden space-y-2"
          >
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)} // close menu on click
                  className="text-white hover:underline block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;

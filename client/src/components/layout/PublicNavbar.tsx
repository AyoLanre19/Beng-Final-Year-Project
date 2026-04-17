import { Link } from "react-router-dom";
import logopic from "../../assets/images/logo.jpg";
import "../../styles/landing.css";

export default function PublicNavbar() {
  return (
    <nav className="navbar glass">
      <div className="navbar-left">
        <img src={logopic} alt="Logo" className="logo" />
      </div>

      <div className="navbar-center">
        <a href="/features">Features</a>
        <a href="/pricing">Pricing</a>
        <a href="/about">About Us</a>
        <a href="/faqs">FAQs</a>
      </div>

      <div className="navbar-right">
       <Link to="/get-started">Login</Link>
       <Link to="/get-started" className="btn-outline">Sign Up</Link>
      </div>
    </nav>
  );
}
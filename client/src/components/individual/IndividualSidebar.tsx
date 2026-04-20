import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import "../../styles/individual-dashboard.css";

interface IndividualSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function IndividualSidebar({
  isOpen = false,
  onClose,
}: IndividualSidebarProps) {

  const navigate = useNavigate();
  const location = useLocation();

  const go = (path:string)=>{
    navigate(path);
    onClose?.();
  };

  const active = (path:string)=>{
    return location.pathname === path ? "ind-nav-item active" : "ind-nav-item";
  };

  return (
    <>
      <button
        type="button"
        className={`ind-sidebar-backdrop ${isOpen ? "visible" : ""}`}
        aria-label="Close navigation menu"
        onClick={onClose}
      />

      <aside className={`ind-sidebar ${isOpen ? "is-open" : ""}`}>

        <div className="ind-sidebar-head">
          <div className="ind-logo">
            <img src="/assets/images/logo.png" alt="Logo" />
          </div>

          <button
            type="button"
            className="ind-sidebar-close"
            aria-label="Close navigation menu"
            onClick={onClose}
          >
            x
          </button>
        </div>

        <nav className="ind-nav">

          <button
            className={active("/individual/dashboard")}
            onClick={()=>go("/individual/dashboard")}
          >
            Dashboard
          </button>

          <button
            className={active("/individual/income-deductions")}
            onClick={()=>go("/individual/income-deductions")}
          >
            Income & Deductions
          </button>

          <button
            className={active("/individual/tax-summary")}
            onClick={()=>go("/individual/tax-summary")}
          >
            Tax Summary
          </button>

          <button
            className={active("/individual/review-file")}
            onClick={()=>go("/individual/review-file")}
          >
            Review & File
          </button>

        </nav>

        <div className="ind-sidebar-footer">

          <button
            className="logout"
            onClick={() => {
              logoutUser();
              navigate("/individual/login");
              onClose?.();
            }}
          >
            Log out
          </button>

        </div>

      </aside>
    </>
  );
}

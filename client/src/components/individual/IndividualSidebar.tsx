import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/individual-dashboard.css";

export default function IndividualSidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const go = (path:string)=>{
    navigate(path);
  };

  const active = (path:string)=>{
    return location.pathname === path ? "ind-nav-item active" : "ind-nav-item";
  };

  return (
    <aside className="ind-sidebar">

      <div className="ind-logo">
        <img src="/assets/images/logo.png" alt="Logo" />
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
          onClick={()=>navigate("/login")}
        >
          Log out
        </button>

      </div>

    </aside>
  );
}
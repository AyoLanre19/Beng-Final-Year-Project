import React, { useState } from "react";
import "../../styles/individual-dashboard.css";

interface TopbarProps {
  onOpenProfile?: () => void;
}

export default function Topbar({ onOpenProfile }: TopbarProps) {
  const [openNotifs, setOpenNotifs] = useState(false);

  return (
    <header className="ind-topbar">
      <div className="top-left">
        <div className="search">
          <input placeholder="Search" aria-label="search" />
        </div>
      </div>

      <div className="top-right">
        <button className="icon-btn"> {/* placeholder square icon */}
          <img src="/assets/images/icon-1.png" alt="icon-1" />
        </button>

        <button className="icon-btn"> {/* placeholder */}
          <img src="/assets/images/icon-2.png" alt="icon-2" />
        </button>

        <div className="notif-wrapper">
          <button
            className="icon-btn notif-btn"
            onClick={() => setOpenNotifs((s) => !s)}
            aria-expanded={openNotifs}
          >
            <img src="/assets/images/bell.png" alt="notifications" />
            <span className="notif-badge">3</span>
          </button>

          {openNotifs && (
            <div className="notif-pop">
              <div className="notif-item">
                <strong>Payment received</strong>
                <div className="muted">You received ₦20,000</div>
              </div>
              <div className="notif-item">
                <strong>Filing reminder</strong>
                <div className="muted">PAYE due in 7 days</div>
              </div>
              <div className="notif-item">
                <strong>Profile</strong>
                <div className="muted">Update your phone number</div>
              </div>
            </div>
          )}
        </div>

        <div className="profile-wrapper">
          <button className="profile-btn" onClick={() => onOpenProfile?.()}>
            <img src="/assets/images/avatar.jpg" alt="avatar" />
            <span className="profile-name">Ifeanyi</span>
          </button>
        </div>
      </div>
    </header>
  );
}
import { useState } from "react";
import "../../styles/sme-dashboard.css";

export default function SmeTopbar(){

  const [open,setOpen] = useState(false);

  return(
    <div className="sme-topbar">

      <input className="sme-search" placeholder="Search"/>

      <div className="sme-top-icons">

        <div className="icon"/>
        <div className="icon"/>
        <div className="icon"/>

        <div className="profile" onClick={()=>setOpen(!open)}>
          <img src="/assets/images/avatar.png"/>
          <span>Ifeanyi</span>

          {open && (
            <div className="profile-dropdown">
              <p>Edit Profile</p>
              <p>Change Email</p>
              <p>Change Password</p>
              <p>Logout</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
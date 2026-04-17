import { useNavigate } from "react-router-dom";
import { clearStoredToken } from "../../services/apiClient";
import { clearStoredUser } from "../../services/authService";
import "../../styles/portal-select.css";

import individualportal from "../../assets/images/individualportal.jpg";
import smeportal from "../../assets/images/smeportal.jpg";
import companyportal from "../../assets/images/companyportals.jpg";

export default function PortalSelectSection() {

  const navigate = useNavigate();

  const selectPortal = (type:"individual"|"sme"|"company") => {

    clearStoredToken();
    clearStoredUser();
    localStorage.removeItem("companyVerified");

    localStorage.setItem("portalType", type);

    navigate(`/${type}/login`);

  };

  return (

    <section className="portal-wrapper">

      <h1>How will you use the platform?</h1>

      <div className="portal-grid">

        <div
          className="portal-card glass"
          onClick={()=>selectPortal("individual")}
        >

          <img src={individualportal}/>

          <h3>Individual</h3>

          <p>Manage personal income and taxes</p>

        </div>

        <div
          className="portal-card glass"
          onClick={()=>selectPortal("sme")}
        >

          <img src={smeportal}/>

          <h3>SME</h3>

          <p>Manage small business taxes</p>

        </div>

        <div
          className="portal-card glass"
          onClick={()=>selectPortal("company")}
        >

          <img src={companyportal}/>

          <h3>Company</h3>

          <p>Enterprise tax compliance</p>

        </div>

      </div>

    </section>

  );
}
import { Link } from "react-router-dom";
import PublicNavbar from "../layout/PublicNavbar";
import "../../styles/features.css";
import expense from"../../assets/images/Expense_intelligence.jpg";  
import taxbreakdown from"../../assets/images/smart-tax-breakdown-removebg-preview.png";
import compliance from"../../assets/images/compliance-removebg-preview.png";
import aiadvisor from"../../assets/images/AI_tax_advisor.jpg";
import powerlogo from"../../assets/images/power_logo.jpg";
import calendar from"../../assets/images/Filling_calender-removebg-preview.png";
import financail from"../../assets/images/Financial_Forcasting.jpg";

export default function FeaturesSection() {
  return (
    
    <section className="features-wrapper">
      <PublicNavbar />
      {/* Header */}
      <div className="features-header glass">
        <img
          src={powerlogo}
          alt="Security"
          className="features-header-icon"
        />

        <h2>Powerful Features of Our AI-Driven Tax Platform</h2>
        <p>
          Streamline your tax and expense management with intelligent automation
          and insights.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="features-grid">
        <Link to="/features/expense" className="feature-card glass">
          <img src={expense} alt="Expense Intelligence" />
          <h3>Expense Intelligence</h3>
          <p>
            Automatically categorize and optimize your expenses to maximize
            deductions.
          </p>
          <span className="arrow">→</span>
        </Link>

        <Link to="/features/tax-breakdown" className="feature-card glass">
          <img src={taxbreakdown} alt="Smart Tax Breakdown" />
          <h3>Smart Tax Breakdown</h3>
          <p>
            Understand your taxes with detailed breakdowns specific to Nigeria’s
            tax system.
          </p>
          <span className="arrow">→</span>
        </Link>

        <Link to="/features/compliance" className="feature-card glass">
          <img src={compliance} alt="Compliance Status" />
          <h3>Compliance Status</h3>
          <p>
            Stay on top of deadlines and ensure you’re always compliance-ready.
          </p>
          <span className="arrow">→</span>
        </Link>

        <Link to="/features/ai-advisor" className="feature-card glass">
          <img src={aiadvisor} alt="AI Tax Advisor" />
          <h3>AI Tax Advisor</h3>
          <p>
            Get personalized tax advice and answers to your questions from our AI expert.
          </p>
          <span className="arrow">→</span>
        </Link>

        <Link to="/features/forecasting" className="feature-card glass">
          <img src={financail} alt="Financial Forecasting" />
          <h3>Financial Forecasting</h3>
          <p>
            Predict your cash flow, expenses, and future tax liabilities based on your data.
          </p>
          <span className="arrow">→</span>
        </Link>

        <Link to="/features/calendar" className="feature-card glass">
          <img src={calendar} alt="Filing Calendar" />
          <h3>Filing Calendar & Alerts</h3>
          <p>
            Receive reminders for important tax filing deadlines to avoid penalties.
          </p>
          <span className="arrow">→</span>
        </Link>
      </div>
    </section>
  );
}
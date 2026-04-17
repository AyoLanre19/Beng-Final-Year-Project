import { createBrowserRouter, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { getStoredToken } from "../services/apiClient";
import { getStoredUser } from "../services/authService";

/* ================= PUBLIC ================= */
import LandingPage from "../pages/public/LandingPage";
import AboutPage from "../pages/public/AboutPage";
import FaqsPage from "../pages/public/FaqsPage";
import CompanyPricingPage from "../pages/public/CompanyPricingPage";

/* components used as pages (still fine for now) */
import FeaturesPage from "../components/landing/FeaturesSection";
import PricingPage from "../components/landing/PricingSection";

/* ================= PORTAL ================= */
import PortalSelectPage from "../components/portal/PortalSelectSection";

/* ================= AUTH ================= */
import SignupPage from "../pages/auth/SignupPage";
import CompanySignupPage from "../pages/auth/CompanySignupPage";
import LoginPage from "../pages/auth/LoginPage";

/* ================= INDIVIDUAL ================= */
import IndividualDashboardPage from "../pages/individual/DashboardPage";
import IncomeDeductionsPage from "../pages/individual/IncomeDeductionsPage";
import TaxSummaryPage from "../pages/individual/TaxSummaryPage";
import ReviewFilePage from "../pages/individual/ReviewFilePage";

/* ================= SME ================= */
import SmeDashboardPage from "../pages/sme/DashboardPage";
import SmeRevenueExpensesPage from "../pages/sme/RevenueExpensesPage";
import SmeTaxSummaryPage from "../pages/sme/TaxSummaryPage";
import SmeFileTaxPage from "../pages/sme/FileTaxPage";

/* ================= COMPANY ================= */
import CompanyDashboardPage from "../pages/company/DashboardPage";
import CompanyUploadPage from "../pages/company/UploadPage";
import CompanyTaxSummaryPage from "../pages/company/TaxSummaryPage";
import CompanyFilingPage from "../pages/company/FilingPage";

/* ================= ADMIN ================= */
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/DashboardPage";
import AdminUsers from "../pages//admin/UsersPage";
import FilingsPage from "../pages/admin/FilingsPage";
import AiMonitoringPage from "../pages/admin/AiMonitoringPage";
//import AdminCompanies from "../pages/admin/CompaniesPage";

const PortalProtectedRoute = ({
  expectedUserType,
  element,
}: {
  expectedUserType: "individual" | "sme" | "company";
  element: ReactElement;
}) => {
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token || !user) {
    return <Navigate to={`/${expectedUserType}/login`} replace />;
  }

  if (user.userType !== expectedUserType) {
    if (user.userType === "individual") return <Navigate to="/individual/dashboard" replace />;
    if (user.userType === "sme") return <Navigate to="/sme/dashboard" replace />;
    if (user.userType === "company") return <Navigate to="/company/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return element;
};

export const router = createBrowserRouter([

  /* ===== PUBLIC ===== */
  { path: "/", element: <LandingPage /> },
  { path: "/features", element: <FeaturesPage /> },
  { path: "/pricing", element: <PricingPage /> },
  { path: "/pricing/company", element: <CompanyPricingPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/faqs", element: <FaqsPage /> },

  /* ===== PORTAL ===== */
  { path: "/get-started", element: <PortalSelectPage /> },

  /* ===== AUTH ===== */
  { path: "/signup", element: <SignupPage /> },
  { path: "/individual/signup", element: <SignupPage forcedPortal="individual" /> },
  { path: "/sme/signup", element: <SignupPage forcedPortal="sme" /> },
  { path: "/company/signup", element: <CompanySignupPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/individual/login", element: <LoginPage forcedPortal="individual" /> },
  { path: "/sme/login", element: <LoginPage forcedPortal="sme" /> },
  { path: "/company/login", element: <LoginPage forcedPortal="company" /> },

  /* ===== INDIVIDUAL ===== */
  {
    path: "/individual/dashboard",
    element: <PortalProtectedRoute expectedUserType="individual" element={<IndividualDashboardPage />} />,
  },
  {
    path: "/individual/income-deductions",
    element: <PortalProtectedRoute expectedUserType="individual" element={<IncomeDeductionsPage />} />,
  },
  {
    path: "/individual/tax-summary",
    element: <PortalProtectedRoute expectedUserType="individual" element={<TaxSummaryPage />} />,
  },
  {
    path: "/individual/review-file",
    element: <PortalProtectedRoute expectedUserType="individual" element={<ReviewFilePage />} />,
  },

  /* ===== SME ===== */
  {
    path: "/sme/dashboard",
    element: <PortalProtectedRoute expectedUserType="sme" element={<SmeDashboardPage />} />,
  },
  {
    path: "/sme/revenue-expenses",
    element: <PortalProtectedRoute expectedUserType="sme" element={<SmeRevenueExpensesPage />} />,
  },
  {
    path: "/sme/tax-summary",
    element: <PortalProtectedRoute expectedUserType="sme" element={<SmeTaxSummaryPage />} />,
  },
  {
    path: "/sme/file-tax",
    element: <PortalProtectedRoute expectedUserType="sme" element={<SmeFileTaxPage />} />,
  },

  /* ===== COMPANY ===== */
  {
    path: "/company/dashboard",
    element: <PortalProtectedRoute expectedUserType="company" element={<CompanyDashboardPage />} />,
  },
  {
    path: "/company/upload",
    element: <PortalProtectedRoute expectedUserType="company" element={<CompanyUploadPage />} />,
  },
  {
    path: "/company/tax-summary",
    element: <PortalProtectedRoute expectedUserType="company" element={<CompanyTaxSummaryPage />} />,
  },
  {
    path: "/company/filing",
    element: <PortalProtectedRoute expectedUserType="company" element={<CompanyFilingPage />} />,
  },

  /* ===== ADMIN ===== */
  { path: "/admin/login", element: <AdminLogin /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/admin/users", element: <AdminUsers /> },
  { path: "/admin/filings", element: <FilingsPage /> },
  { path: "/admin/ai-monitoring", element: <AiMonitoringPage /> },

  //{ path: "/admin/companies", element: <AdminCompanies /> },

  /* ===== 404 ===== */
  {
    path: "*",
    element: <h1 style={{ padding: "40px" }}>404 - Page Not Found</h1>
  }

]);
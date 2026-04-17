import PublicNavbar from "../../components/layout/PublicNavbar";
import IndividualSignupSection from "../../components/auth/IndividualSignupSection";
import type { UserType } from "../../services/authService";

interface SignupPageProps {
  forcedPortal?: Extract<UserType, "individual" | "sme">;
}

export default function SignupPage({ forcedPortal }: SignupPageProps) {

  return (
    <>
      <PublicNavbar />

      <IndividualSignupSection forcedPortal={forcedPortal} />

    </>
  );
}
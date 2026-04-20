type Props = {
  totalTax: number;
  label?: string;
  subtitle?: string;
};

export default function TaxHero({
  totalTax,
  label = "Projected Annual Tax",
  subtitle = "Annualized from your uploaded statement period",
}: Props) {
  return (
    <div className="tax-hero glass">
      <p className="hero-label">{label}</p>
      <h1 className="hero-value">₦{totalTax.toLocaleString()}</h1>
      <p className="hero-sub">{subtitle}</p>
    </div>
  );
}

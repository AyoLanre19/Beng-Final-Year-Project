type Props = {
  totalTax: number;
};

export default function TaxHero({ totalTax }: Props) {
  return (
    <div className="tax-hero glass">
      <p className="hero-label">Total Estimated Tax Liability</p>
      <h1 className="hero-value">₦{totalTax.toLocaleString()}</h1>
      <p className="hero-sub">Based on confirmed financial data</p>
    </div>
  );
}
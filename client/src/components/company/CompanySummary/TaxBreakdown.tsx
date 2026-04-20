type Breakdown = {
  corporate: number;
  vat: number;
  withholding: number;
};

export default function TaxBreakdown({ corporate, vat, withholding }: Breakdown) {
  return (
    <div className="tax-breakdown glass">
      <h3>Forecast Breakdown</h3>

      <div className="table">
        <div className="row header">
          <span>Tax Type</span>
          <span>Amount</span>
        </div>

        <div className="row">
          <span>Projected Company Income Tax</span>
          <span>₦{corporate.toLocaleString()}</span>
        </div>

        <div className="row">
          <span>Projected VAT</span>
          <span>₦{vat.toLocaleString()}</span>
        </div>

        <div className="row">
          <span>Projected Withholding Tax</span>
          <span>₦{withholding.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

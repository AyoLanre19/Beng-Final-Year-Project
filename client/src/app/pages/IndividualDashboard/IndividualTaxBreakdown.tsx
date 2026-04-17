import { useEffect, useState } from "react";
import { getIndividualTaxBreakdown } from "../../../services/individualTaxService";
import { IndividualTaxBreakdown as BreakdownType } from "../../../types/individualTax";

const IndividualTaxBreakdown = () => {
  const [data, setData] = useState<BreakdownType | null>(null);

  useEffect(() => {
    getIndividualTaxBreakdown().then(setData);
  }, []);

  if (!data) return null;

  const totalPaid = data.paid;
  const totalDue = data.totalEstimated - totalPaid;
  const paidPercent = (totalPaid / data.totalEstimated) * 100;

  const risk = getRiskLevel(totalDue, data.totalEstimated);

  return (
    <div className="p-8 flex-1 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-6">Tax Breakdown</h1>

      {/* TOTAL CARD */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-500">Total Estimated Tax Due</p>
            <h2 className="text-3xl font-bold">
              ₦{data.totalEstimated.toLocaleString()}
            </h2>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold
              ${risk === "High" && "bg-red-100 text-red-600"}
              ${risk === "Medium" && "bg-yellow-100 text-yellow-700"}
              ${risk === "Low" && "bg-green-100 text-green-600"}
            `}
          >
            {risk} Risk
          </span>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-200 h-4 rounded-full mt-6">
          <div
            className="bg-gradient-to-r from-green-500 to-yellow-400 h-4 rounded-full transition-all duration-700"
            style={{ width: `${paidPercent}%` }}
          />
        </div>

        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>₦{totalPaid.toLocaleString()} Paid</span>
          <span>₦{totalDue.toLocaleString()} Due</span>
        </div>
      </div>

      {/* TAX CARDS GRID */}
      <div className="grid grid-cols-2 gap-6">
        {data.items.map(item => {
          const itemDue = item.amount - item.paid;

          return (
            <div key={item.id} className="bg-white rounded-2xl shadow p-6">
              <h3 className="text-lg font-semibold">{item.title}</h3>

              <p className="text-2xl font-bold mt-2">
                ₦{item.amount.toLocaleString()}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {item.description}
              </p>

              <div className="mt-4 flex justify-between items-center">
                <span
                  className={`px-3 py-1 text-xs rounded-full
                    ${itemDue > 0
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                    }
                  `}
                >
                  {itemDue > 0 ? "Due" : "Paid"}
                </span>

                <span className="text-sm text-gray-500">
                  Pay by {item.deadline}
                </span>
              </div>

              {itemDue > 0 && (
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                  Resolve {item.title}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* AI INSIGHTS */}
      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h3 className="font-semibold mb-3">AI Insights</h3>
        <p className="text-gray-600 text-sm">
          Your tax risk is currently <b>{risk}</b>. Consider clearing
          outstanding balances before the deadline.
        </p>

        <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-xl">
          How to Reduce Tax
        </button>
      </div>

      {/* PENALTIES */}
      <div className="bg-white rounded-2xl shadow p-6 mt-6">
        <h3 className="font-semibold mb-3">Penalties & Interest</h3>

        {totalDue > 0 ? (
          <p className="text-red-600 text-sm">
            Unresolved tax obligations may lead to penalties.
          </p>
        ) : (
          <p className="text-green-600 text-sm">
            No outstanding penalties.
          </p>
        )}
      </div>
    </div>
  );
};

const getRiskLevel = (due: number, total: number) => {
  const percent = (due / total) * 100;

  if (percent > 60) return "High";
  if (percent > 30) return "Medium";
  return "Low";
};

export default IndividualTaxBreakdown;
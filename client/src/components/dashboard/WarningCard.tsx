interface Props {
  due: number;
}

const WarningCard = ({ due }: Props) => {
  if (due <= 0) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-4 mb-6">
      <h4 className="font-semibold text-yellow-800">⚠ Warning</h4>
      <p className="text-sm text-yellow-700">
        You have outstanding tax obligations. Act to avoid penalties.
      </p>
      <button className="mt-3 bg-yellow-500 text-white px-4 py-2 rounded-lg">
        Review & Resolve
      </button>
    </div>
  );
};

export default WarningCard;
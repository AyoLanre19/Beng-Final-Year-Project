export default function StatCard({ title, value }: any) {
  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      flex: 1
    }}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}
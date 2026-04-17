export default function StatCard({title,value}:{title:string,value:string}){

  return(
    <div className="sme-card">
      <p className="sme-card-title">{title}</p>
      <h2>{value}</h2>
    </div>
  );
}
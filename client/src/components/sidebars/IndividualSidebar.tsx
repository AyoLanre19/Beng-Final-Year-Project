import "../../styles/IndividualSidesbar.css"
export default function Sidebar(){

return(

<div className="sidebar">

    <div className="logo">
        Logo
    </div>

    <nav>

        <a className="active">Dashboard</a>
        <a>Income & Deductions</a>
        <a>Tax Summary</a>
        <a>Review & File</a>

    </nav>

    <div className="logout">
        Log out
    </div>

</div>

)

}
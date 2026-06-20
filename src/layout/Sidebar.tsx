import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div className="sidebar">
            <Link to="/">Home</Link>

            <Link to="/risk">
                Add New Risks
            </Link>

            <Link to="/history">
                View History
            </Link>
        </div>
    );
}

export default Sidebar;
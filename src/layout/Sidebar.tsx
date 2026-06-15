import { Link } from "react-router-dom";

type SidebarProps = {

    isOpen: boolean;
};

function Sidebar({
    isOpen
}: SidebarProps) {

    return (

        <div
            className={
                isOpen
                    ? "sidebar open"
                    : "sidebar closed"
            }
        >

            <Link to="/">
                Home
            </Link>

            <Link to="/risk">
                Risks
            </Link>

             <Link to="/history">
                            view history
                        </Link>

        </div>
    );
}

export default Sidebar;
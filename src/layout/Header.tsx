import "./../styles/Header.css";

type HeaderProps = {

    toggleSidebar: () => void;

    isOpen: boolean;
};

function Header({
    toggleSidebar,
    isOpen
}: HeaderProps) {

    return (

        <div className="header">

            <button
                className="menu-btn"
                onClick={toggleSidebar}
            >
                {
                    isOpen
                        ? "◀"
                        : "▶"
                }
            </button>

            <h2>
                Risk Management
            </h2>

        </div>
    );
}

export default Header;
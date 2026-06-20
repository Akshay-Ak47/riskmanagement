import "./../styles/Header.css";
import { getCurrentWindow } from "@tauri-apps/api/window";

type HeaderProps = {
    toggleSidebar: () => void;
    isOpen: boolean;
};

function Header({
    toggleSidebar,
    isOpen
}: HeaderProps) {

    const appWindow = getCurrentWindow();

    const minimizeWindow = async () => {
        await appWindow.minimize();
    };

    const maximizeWindow = async () => {
        await appWindow.toggleMaximize();
    };

    const closeWindow = async () => {
        await appWindow.close();
    };

    return (
        <div className="header">

            <button
                className="menu-btn"
                onClick={toggleSidebar}
            >
                {isOpen ? "◀" : "▶"}
            </button>

            <h2>
                Risk Management
            </h2>

            <div className="window-controls">

                <button
                    className="window-btn"
                    onClick={minimizeWindow}
                >
                    ─
                </button>

                <button
                    className="window-btn"
                    onClick={maximizeWindow}
                >
                    □
                </button>

                <button
                    className="window-btn close-btn"
                    onClick={closeWindow}
                >
                    ✕
                </button>

            </div>

        </div>
    );
}

export default Header;
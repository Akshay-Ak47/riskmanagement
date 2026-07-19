import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

type HeaderProps = {
  toggleSidebar: () => void;
  isOpen: boolean;
};

function Header({ toggleSidebar, isOpen }: HeaderProps) {
  const appWindow = getCurrentWindow();

 useEffect(() => {
  void appWindow.setResizable(true);
  void appWindow.setMaximizable(true);
}, [appWindow]);

  const minimizeWindow = async () => {
    await appWindow.minimize();
  };
  
  const toggleMaximizeWindow = async () => {
  await appWindow.toggleMaximize();
};

  const closeWindow = async () => {
    await appWindow.close();
  };

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <button className="btn btn--secondary app-header__toggle" type="button" onClick={toggleSidebar} aria-label="Toggle navigation" aria-expanded={isOpen}>
          ☰
        </button>
        <div>
          <div className="app-header__title">Risk Management</div>
          <div className="app-header__subtitle">Enterprise risk oversight workspace</div>
        </div>
      </div>

      <div className="app-header__actions">
        <button className="window-control window-control--minimize" type="button" onClick={minimizeWindow} aria-label="Minimize window">
          −
        </button>
        <button className="window-control window-control--maximize" type="button"  onClick={toggleMaximizeWindow}
  aria-label="Maximize window">
          □
        </button>
        <button className="window-control window-control--close" type="button" onClick={closeWindow} aria-label="Close window">
          ✕
        </button>
      </div>
    </header>
  );
}

export default Header;
import { type ReactNode, useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

type LayoutProps = {
  children: ReactNode;
};

function Layout({ children }: LayoutProps) {
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 840 : false));
  const [isOpen, setIsOpen] = useState(() => (typeof window !== "undefined" ? window.innerWidth >= 840 : true));

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 840;
      setIsMobile(mobile);
      setIsOpen(mobile ? false : true);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const isCollapsed = !isOpen && !isMobile;

  return (
    <div className="app-shell">
      <Header toggleSidebar={toggleSidebar} isOpen={isOpen} />
      {isMobile && isOpen ? <button className="sidebar-overlay" aria-label="Close navigation" onClick={closeSidebar} /> : null}
      <div className="app-shell__body">
        <Sidebar isOpen={isOpen} isCollapsed={isCollapsed} onNavigate={closeSidebar} />
        <main className="page-main">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
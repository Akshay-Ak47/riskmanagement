import { NavLink } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
  isCollapsed: boolean;
  onNavigate: () => void;
};

const navItems = [
  { to: "/", label: "Overview", icon: "◉" },
  { to: "/risk", label: "New Risk", icon: "＋" },
  { to: "/history", label: "History", icon: "◌" },
 
];

function Sidebar({ isOpen, isCollapsed, onNavigate }: SidebarProps) {
  return (
    <aside className={`app-sidebar ${isOpen ? "is-open" : ""} ${isCollapsed ? "is-collapsed" : ""}`}>
      <div className="app-sidebar__brand">
        <div className="app-header__brand-mark">RM</div>
        <div className="app-sidebar__brand-label">Dashboard</div>
      </div>
      <nav className="app-sidebar__nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={onNavigate} title={item.label}>
            <span className="nav-link__icon" aria-hidden="true">
              {item.icon}
            </span>
            {!isCollapsed ? <span className="nav-link__label">{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
};

type CardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
};

type SectionTitleProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

type StatusBadgeProps = {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

type ActionButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
};

type DataTableProps = {
  headers: string[];
  children: ReactNode;
  className?: string;
};

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return <div className={`page-shell ${className}`.trim()}>{children}</div>;
}

export function PageHeader({ title, description, actions, eyebrow }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div className="page-header__content">
        {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
        <h1 className="page-title">{title}</h1>
        {description ? <p className="page-subtitle">{description}</p> : null}
      </div>
      {actions ? <div className="page-header__actions">{actions}</div> : null}
    </div>
  );
}

export function Card({ children, className = "", title, description, actions }: CardProps) {
  return (
    <section className={`card ${className}`.trim()}>
      {(title || description || actions) && (
        <div className="card__header">
          <div>
            {title ? <h3 className="card__title">{title}</h3> : null}
            {description ? <p className="card__description">{description}</p> : null}
          </div>
          {actions ? <div className="card__actions">{actions}</div> : null}
        </div>
      )}
      <div className="card__body">{children}</div>
    </section>
  );
}

export function SectionTitle({ title, description, actions }: SectionTitleProps) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  );
}

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${tone}`}>{label}</span>;
}

export function ActionButton({ children, variant = "primary", type = "button", onClick, className = "" }: ActionButtonProps) {
  return (
    <button type={type} className={`btn btn--${variant} ${className}`.trim()} onClick={onClick}>
      {children}
    </button>
  );
}

export function DataTable({ headers, children, className = "" }: DataTableProps) {
  return (
    <div className={`table-shell ${className}`.trim()}>
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { fieldHelp } from "../config/fieldHelp";

type FieldHelpProps = {
  field: keyof typeof fieldHelp;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function FieldHelp({ field, isOpen, setIsOpen }: FieldHelpProps) {
  const help = fieldHelp[field];
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [popupStyle, setPopupStyle] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const width = 700;
setPopupStyle({ top: rect.bottom + 8, left: Math.max(10, Math.min(rect.left, window.innerWidth - width - 10)) });

    }
  }, [isOpen]);

  return (
    <div style={{ display: "inline-block", marginLeft: 6 }}>
      <button
        ref={buttonRef}
        type="button"
          className="help-icon"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        
      >
        ℹ
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: popupStyle.top,
            left: popupStyle.left,
            width: 500,
            background: "#fff",
            border: "1px solid #dbe7f5",
            borderRadius: 10,
            padding: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,.15)",
            zIndex: 9999,
            maxHeight: "90vh",
            overflowY: "auto"
          }}
        >
          <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>{help.title}</h3>

{help.table ? (
  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
    <tbody>
      {help.table.map((row, i) => (
        <tr key={i}>
          {row.map((cell, j) => (
            <td key={j} style={{ border: "1px solid #ccc", padding: 6, fontWeight: i === 0 || j === 0 ? 600 : 400, textAlign: "center" }}>
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
) : (help.options.map(option => (
            <div key={option.value} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 600, color: "#2563eb" }}>{option.value}</div>
              <div style={{ marginTop: 4, fontSize: 14, color: "#555" }}>{option.description}</div>
            </div>
          ))
)}
        </div>
      )}
    </div>
  );
}

export default FieldHelp;
import Swal from "sweetalert2";
import "../styles/Alert.css";

export const showMessage = (
    icon: "success" | "error" | "warning" | "info",
    title: string,
    message: string
) => {

    const confirmButtonColor =
        icon === "success"
            ? "#16a34a"
            : icon === "error"
            ? "#dc2626"
            : icon === "warning"
            ? "#d97706"
            : "#2563eb";

    Swal.fire({
    icon,
    title,
    text: message,

    position: "center",

    showConfirmButton: false,

    timer: 1000,

    timerProgressBar: true,

    width: "22rem",
    

    background: "#ffffff",

    color: "#1f2937",

    iconColor: confirmButtonColor
});
};
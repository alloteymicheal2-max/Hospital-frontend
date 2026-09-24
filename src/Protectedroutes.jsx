import { useNavigate } from "react-router-dom";

function Protectedroutes({ children }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token")

    if (!token) {
        return navigate("/login")
    }

    return children;





}
export default Protectedroutes;
import { Link } from "react-router-dom";
import "./ButtonLink.css";

interface ButtonLinkProps {
    linkRoute?: string;
    btnName: string;
    onClick?: () => void;
}

function ButtonLink({ btnName, linkRoute, onClick } : ButtonLinkProps){
    return(
        <Link className="btn" to={linkRoute} onClick={onClick}>
            {btnName}
        </Link>
    );
}

export default ButtonLink;
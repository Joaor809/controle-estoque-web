import { Link } from "react-router-dom";
import "./ButtonLink.css";

function ButtonLink(props){
    return(
        <Link className="btn" to={props.linkRoute}>
            {props.btnName}
        </Link>
    );
}

export default ButtonLink;
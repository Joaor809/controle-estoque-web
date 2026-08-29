import { Link } from "react-router-dom";
import "./Button.css";

function Button(props){
    return(
        <Link className="btn" to={props.linkRoute}>
            {props.btnName}
        </Link>
    );
}

export default Button;
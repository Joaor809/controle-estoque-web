import "./Button.css";

function Button({ typeButton = "button", className = "", btnName, onClick}){
    return(
        <button type={typeButton} className={`btn ${className}`} onClick={onClick}>
            {btnName}
        </button>
    );
}

export default Button;
import "./CardDashboard.css";
function CardDashboard(props){
    return(
        <div className="card">
            <i className={props.icon}></i>
            <div className="card-body">
                <h4>{props.cardName}</h4>
                <p>{props.countInfo}</p>
            </div>
        </div>
    );
}

export default CardDashboard;
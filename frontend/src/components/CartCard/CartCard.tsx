import "./CartCard.css";
function CartCard({ nameProduct, priceProduct, amountProduct }) {
    return (
        <div className="cart-card">
            <div className="infoProduct">
                <h2>{nameProduct}</h2>
                <p>R${priceProduct}</p>
            </div>
            <div className="amount">
                <p>{amountProduct} produtos</p>
            </div>
        </div>
    );
}

export default CartCard;
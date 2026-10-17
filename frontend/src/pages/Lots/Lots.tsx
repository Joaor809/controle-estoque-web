import "./Lots.css";
import generateCod from "../../services/generateCod";
import Menu from "../../components/Menu/Menu";
import Button from "../../components/Button/Button";
import React, { useState } from "react";

function Lots() {
    const [openModal, setOpenModal] = useState(false);
    const [codProduct, setCodProduct] = useState();
    const [quantity, setQuantity] = useState();
    const [expirationDate, setExpirationDate] = useState("");

    async function createLot(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();

        try{
            const response = await fetch("https://api.joaor809.online/lots", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    codProduct: codProduct,
                    quantity: quantity,
                    expirationDate: expirationDate
                })
            });
            const data = response.json();
        } catch(error) {
            alert("Erro ao cadastrar novo Lote");
        }
    }

    return (
        <div className="container-lots">
            <Menu />
            <div className="content-lots">
                <header>
                    <div className="header-info">
                        <h2>Lotes</h2>
                    </div>
                    <Button btnName="Novo Lote" onClick={() => setOpenModal(true)} />
                </header>
                {openModal && (
                    <div className="modal-form">
                        <form>
                            <div className="btn-close">
                                <h3>Novo Lote</h3>
                                <Button btnName="X" onClick={() => setOpenModal(false)} />
                            </div>
                            <div className="form-group">
                                <label>Código do Produto:</label>
                                <input type="text" />
                            </div>
                            <div className="form-group">
                                <label>Quantidade:</label>
                                <input type="number" />
                            </div>
                            <div className="form-group">
                                <label>Data de validade:</label>
                                <input type="date" value={expirationDate} />
                            </div>
                            <Button typeButton="submit" btnName="Cadastrar Lote" />
                        </form>
                    </div>
                )}
                <main className="container-lots">
                    <div className="cards-lots">

                    </div>
                </main>
            </div>
        </div>
    );
}
export default Lots;
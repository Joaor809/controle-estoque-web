import "./Menu.css";
import ButtonLink from "../ButtonLink/ButtonLink";
import logout from "../../services/logout";
import { useState } from "react";

function Menu(){
    const [openModalLogout, setOpenModalLogout] = useState(false);
    return(
        <nav className="navbar">
            <img src="../../public/logo.png" alt="Logo" />
            <div className="nav-links">
                <ButtonLink linkRoute="/" btnName="Início"/>
                <ButtonLink linkRoute="/products" btnName="Produtos"/>
                <ButtonLink linkRoute="/sell" btnName="Vender"/>
                <ButtonLink linkRoute="/sales" btnName="Relatório de vendas"/>
                <ButtonLink btnName="Sair" onClick={() => setOpenModalLogout(true)}/>
            </div>
            {openModalLogout && (
                <div className="modalLogout">
                    <h3>Você realmente deseja sair?</h3>
                    <button className="yes" onClick={() => {
                        logout();
                        setOpenModalLogout(false);
                    }}>Sim</button>
                    <button className="no" onClick={() => {
                        setOpenModalLogout(false);
                    }}>Não</button>
                </div>
            )}
        </nav>
    );
}

export default Menu;
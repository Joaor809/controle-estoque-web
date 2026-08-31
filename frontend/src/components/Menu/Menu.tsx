import "./Menu.css";
import ButtonLink from "../ButtonLink/ButtonLink";

function Menu(){
    return(
        <nav className="navbar">
            <img src="../../public/logo.png" alt="Logo" />
            <div className="nav-links">
                <ButtonLink linkRoute="/" btnName="Início"/>
                <ButtonLink linkRoute="/produtos" btnName="Produtos"/>
                <ButtonLink linkRoute="/vender" btnName="Vender"/>
                <ButtonLink linkRoute="/" btnName="Sair"/>
            </div>
        </nav>
    );
}

export default Menu;
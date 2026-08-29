import "./Menu.css";
import Button from "../Button/Button";

function Menu(){
    return(
        <nav className="navbar">
            <img src="../../public/logo.png" alt="Logo" />
            <div className="nav-links">
                <Button linkRoute="/" btnName="Início"/>
                <Button linkRoute="/produtos" btnName="Produtos"/>
                <Button linkRoute="/" btnName="Vender"/>
                <Button linkRoute="/" btnName="Sair"/>
            </div>
        </nav>
    );
}

export default Menu;
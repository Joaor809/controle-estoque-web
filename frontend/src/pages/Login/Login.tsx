import Button from "../../components/Button/Button";
import "./Login.css";
import { useState } from "react";

function Login() {
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    function formatarCPF(event) {
        let valor = event.target.value;

        valor = valor.replace(/\D/g, "");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        setCpf(valor);
    }

    async function login(event) {
        event.preventDefault();

        const cpfNumeros = cpf.replace(/\D/g, "");

        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cpfNumeros,
                senha
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.erro);
            return;
        }

        console.log("Salvando token...");
        console.log("Token:", data.token);
        console.log("Usuário:", data.usuario);
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        window.location.href = "/";
    }
    return (
        <div className="container-login">
            <div className="card-login">
                <div className="form-info">
                    <h2>Faça seu login</h2>
                    <p>Faça seu login para entrar no controle de estoque</p>
                </div>
                <form>
                    <div className="form-group">
                        <label>Digite seu CPF:</label>
                        <input type="text" name="cpf" id="cpf" placeholder="000.000.000-00" value={cpf} onChange={formatarCPF} />
                    </div>
                    <div className="form-group">
                        <label>Digite sua senha:</label>
                        <div className="password-group">
                            <input type={mostrarSenha ? "text" : "password"} value={senha} onChange={event => setSenha(event.target.value)} placeholder="Senha" />
                            <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}>
                                <i className={mostrarSenha ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </button>
                        </div>
                    </div>
                    <div className="btn-login">
                        <Button btnName="Fazer login" onClick={login}/>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Login;
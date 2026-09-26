import Button from "../../components/Button/Button";
import "./Login.css";
import { useState } from "react";

function Login() {
    const [cpf, setCpf] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    function formatCpf(event) {
        let valor = event.target.value;

        valor = valor.replace(/\D/g, "");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        setCpf(valor);
    }

    async function login(event) {
        event.preventDefault();

        const cpfNumbers = cpf.replace(/\D/g, "");

        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                cpfNumbers,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.erro);
            return;
        }

        console.log("Salvando token...");
        console.log("Token:", data.token);
        console.log("Usuário:", data.user);
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
                <form onSubmit={login}>
                    <div className="form-group">
                        <label>Digite seu CPF:</label>
                        <input type="text" name="cpf" id="cpf" placeholder="000.000.000-00" value={cpf} onChange={formatCpf} />
                    </div>
                    <div className="form-group">
                        <label>Digite sua senha:</label>
                        <div className="password-group">
                            <input type={showPassword ? "text" : "password"} value={password} onChange={event => setPassword(event.target.value)} placeholder="Senha" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                            </button>
                        </div>
                    </div>
                    <div className="btn-login">
                        <Button btnName="Fazer login" typeButton="submit"/>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Login;
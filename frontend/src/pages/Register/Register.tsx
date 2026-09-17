import Button from "../../components/Button/Button";
import "./Register.css";
import { useState } from "react"

function Register() {
    const [cpf, setCpf] = useState("");
    const [telephone, setTelephone] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function formatCpf(event) {
        let valor = event.target.value;

        valor = valor.replace(/\D/g, "");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        setCpf(valor);
    }
    function formatTelephone(event) {
        let valor = event.target.value;

        valor = valor.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        setTelephone(valor)
    }

    async function register(event) {
        event.preventDefault();

        const cpfNumbers = cpf.replace(/\D/g, "");
        const telephoneNumbers = telephone.replace(/\D/g, "");

        // let response = confirm("olá mundo?")
        // alert(response)

        if (name == "" || email == "" || telephone == "" || cpf == "" || password == "") {
            alert("Todos os campos devem ser preenchidos!");
        } else {
            const confirmation = confirm("Você deseja mesmo cadastrar um novo usuário?")

            if (confirmation) {
                const response = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        telephoneNumbers,
                        cpfNumbers,
                        password
                    })
                });

                const data = await response.json();
                console.log("STATUS:", response.status);
                console.log("DADOS:", data);
                if (!response.ok) {
                    alert(data.error);
                    return;
                }
                window.location.href = "/login";
            } else {
                alert("Usuário não cadastrado!");
                setName("");
                setEmail("");
                setCpf("");
                setTelephone("");
                setPassword("");
            }

        }

    }
    return (
        <div className="container-register">
            <div className="card-register">
                <h3>Faça seu cadastro</h3>
                <form onSubmit={register}>
                    <div className="form-group-register">
                        <input type="text" value={name} onChange={event => setName(event.target.value)} placeholder=" " />
                        <label>Digite seu nome</label>
                    </div>
                    <div className="form-group-register">
                        <input type="text" placeholder=" " value={cpf} onChange={formatCpf} minLength={14} maxLength={14} />
                        <label>Digite seu CPF</label>
                    </div>
                    <div className="form-group-register">
                        <input type="text" placeholder=" " value={telephone} onChange={formatTelephone} />
                        <label>Digite seu telefone</label>
                    </div>
                    <div className="form-group-register">
                        <input type="text" value={email} onChange={event => setEmail(event.target.value)} placeholder=" " />
                        <label>Digite seu email</label>
                    </div>
                    <div className="form-group-register">
                        <input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder=" " />
                        <label>Digite uma senha</label>
                    </div>
                    <Button btnName="Cadastrar" typeButton="submit" />
                </form>
            </div>
        </div>
    );
}

export default Register;
import { useState } from "react";
import logo from "../../assets/Discrowd.png";
import TextInput from "./TextInput.jsx";
import {useNavigate} from "react-router";
import Cookies from "js-cookie";


function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await fetch("http://localhost:9000/auth-service/auth/authenticate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) {
                throw new Error("Nieprawidłowy e-mail lub hasło");
            }
            const data = await response.json();
            Cookies.set("token", data.token);
            Cookies.set("refreshToken", data.refreshToken);
            navigate("/select");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
                <img src={logo} alt="Logo" className="w-24 h-24 mx-auto mb-4 rounded-lg" />
                <h1 className="text-2xl font-bold mb-5 text-center ">Zaloguj się</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <TextInput
                        id="email"
                        label="E-mail"
                        type="email"
                        placeholder="Wpisz e-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <TextInput
                        id="password"
                        label="Hasło"
                        type="password"
                        placeholder="Wpisz hasło"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white py-2 font-bold text-2xl rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Zaloguj się
                    </button>
                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                </form>
            </div>
        </div>
    );
}

export default Login;
import {useState} from "react";
import {login} from "../api/auth-service";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (<div className="cont">
        <h1>Login</h1>
        <input placeholder="email" onChange={e => setEmail(e.target.value)}/>
        <input placeholder="password" type="password" onChange={e => setPassword(e.target.value)}/>
        <button onClick={() => {
            console.log({email, password})
            login(email, password).then(res => {
                localStorage.setItem("accessToken", res.data.accessToken)
                localStorage.setItem("refreshToken", res.data.refreshToken)
            })
        }}>Submit
        </button>
    </div>)
}

export default LoginPage
import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function handleGoogle() {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      nav("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert(`Erro Google: ${err.code}\n${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleEmail() {
    try {
      setLoading(true);

      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), pass);
      }

      nav("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert(`Erro: ${err.code}\n${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="loginWrap">
      <div className="loginCard">
        <div className="loginBrand">
          <div className="loginLogo">✈️</div>
          <div>
            <div className="loginTitle">TuristaApp</div>
            <div className="loginSub">Explore o mundo</div>
          </div>
        </div>

        <h1 className="loginH1">
          {mode === "register" ? "Criar conta" : "Entrar"}
        </h1>
        <p className="loginP">
          {mode === "register"
            ? "Crie sua conta para salvar destinos, tours e editar seu perfil."
            : "Entre para acessar seu painel e seu perfil."}
        </p>

        <button className="googleBtn" onClick={handleGoogle} disabled={loading}>
          <span className="gIcon">G</span>
          {loading ? "Aguarde..." : "Continuar com Google"}
        </button>

        <div className="loginDivider">
          <span />
          <p>ou</p>
          <span />
        </div>

        {mode === "register" && (
          <>
            <label className="authLabel">Nome</label>
            <input
              className="authInput"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
          </>
        )}

        <label className="authLabel">Email</label>
        <input
          className="authInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seuemail@gmail.com"
          type="email"
        />

        <label className="authLabel">Senha</label>
        <input
          className="authInput"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="••••••••"
          type="password"
        />

        <button className="authBtn" onClick={handleEmail} disabled={loading}>
          {loading ? "Aguarde..." : mode === "register" ? "Criar conta" : "Entrar"}
        </button>

        <button
          className="switchMode"
          type="button"
          onClick={() => setMode(mode === "register" ? "login" : "register")}
          disabled={loading}
        >
          {mode === "register"
            ? "Já tem conta? Entrar"
            : "Não tem conta? Criar agora"}
        </button>

        <div className="loginFoot">
          Ao continuar, você concorda com os termos e a política de privacidade.
        </div>
      </div>
    </div>
  );
}

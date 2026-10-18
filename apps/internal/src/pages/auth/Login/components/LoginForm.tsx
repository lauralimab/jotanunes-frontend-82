import { useState } from "react";



export default function LoginForm({ onLogin }: { onLogin: () => void }) {
const [forgot, setForgot] = useState(false);
const [email, setEmail] = useState("");
const [pass, setPass] = useState("");

  return (
<div style={{ flex: "1 1 320px", maxWidth: 420, padding: 48, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {forgot ? (
            <>
              <button className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start", marginBottom: 20 }} onClick={() => setForgot(false)}>← Voltar</button>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>Recuperar senha</h2>
              <p style={{ color: "#6b7280", fontSize: 13.5, margin: "0 0 24px" }}>Informe seu e-mail para receber as instruções.</p>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>E-mail</label>
              <input className="input-base" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: 16 }} />
              <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}>Enviar instruções</button>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 700, margin: "0 0 6px" }}>Entrar no sistema</h2>
              <p style={{ color: "#6b7280", fontSize: 13.5, margin: "0 0 28px" }}>Acesse com suas credenciais internas da Jotanunes</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 8 }}>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>E-mail</label>
                  <input className="input-base" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12.5, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Senha</label>
                  <input className="input-base" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button style={{ background: "none", border: "none", color: "#c01a2b", fontSize: 12.5, cursor: "pointer", fontWeight: 500 }} onClick={() => setForgot(true)}>Esqueci minha senha</button>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                <button className="btn btn-secondary btn-lg" style={{ width: "100%", justifyContent: "center" }} onClick={onLogin}>Entrar como Jotanunes (Interno)</button>
              </div>
              <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 11, marginTop: 16 }}>RNF01 — Acesso restrito por autenticação. <br/>Suporte: ti@jotanunes.com.br</p>
            </>
          )}
        </div>
  );
}

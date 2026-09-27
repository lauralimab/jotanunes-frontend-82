import { useState, type SubmitEvent } from 'react'

import jotanunesLogo from '../assets/jotanunes-logo.png'
import './LoginPage.css'

type LoginErrors = {
  email?: string
  password?: string
}

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})

  function validateForm() {
    const newErrors: LoginErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Informe o e-mail.'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Informe um e-mail válido.'
    }

    if (!password.trim()) {
      newErrors.password = 'Informe a senha.'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <img
            src={jotanunesLogo}
            alt="Jotanunes Construtora"
            className="login-logo"
          />

          <div className="login-brand-content">

    <h1>
      Gestão Documental
      <br />
      de Fornecedores
    </h1>

    <p>
      Envie e acompanhe, em um só lugar, a documentação da sua empresa
      e dos profissionais vinculados aos serviços prestados à Jotanunes.
    </p>
          </div>


        </div>

        <div className="login-form-area">
          <div className="login-form-container">
           <header className="login-header">
              <span>Portal do Fornecedor</span>
              <h2>Acesse sua conta</h2>
              <p>
                Informe suas credenciais para acessar o ambiente da sua empresa.
              </p>
            </header>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="email">E-mail</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={email}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={errors.email ? 'input-error' : ''}
                  onChange={(event) => {
                    setEmail(event.target.value)

                    if (errors.email) {
                      setErrors((current) => ({
                        ...current,
                        email: undefined,
                      }))
                    }
                  }}
                />

                {errors.email && (
                  <span id="email-error" className="field-error">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="password">Senha</label>

                <div className="password-field">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Digite sua senha"
                    value={password}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? 'password-error' : undefined
                    }
                    className={errors.password ? 'input-error' : ''}
                    onChange={(event) => {
                      setPassword(event.target.value)

                      if (errors.password) {
                        setErrors((current) => ({
                          ...current,
                          password: undefined,
                        }))
                      }
                    }}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? 'Ocultar senha' : 'Mostrar senha'
                    }
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>

                {errors.password && (
                  <span id="password-error" className="field-error">
                    {errors.password}
                  </span>
                )}
              </div>

              <button type="submit" className="login-submit">
                Entrar
              </button>
            </form>

            <p className="login-security-text">
              Acesso restrito a fornecedores autorizados pela Jotanunes.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
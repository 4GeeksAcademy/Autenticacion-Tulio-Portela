import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/login.css";

const Login = () => {
	const navigate = useNavigate();
	const { store, actions } = useContext(Context);
	const [isShow, setIsShown] = useState(false);
	const [user, setUser] = useState({
		name: "",
		email: "",
		password: "",
		password_check: "",
	});
	const [message, setMessage] = useState(""); // Novo estado para mensagens

	useEffect(() => {
		if (store.token) {
			navigate("/private");
		}
		return () => {
			setUser({
				name: "",
				email: "",
				password: "",
				password_check: "",
			});
		};
	}, [store.token]);

	const registerUser = async () => {
		if (user.password === user.password_check && user.password !== "") {
			const createUser = await actions.createUser(user);
			if (createUser) {
				setMessage("Usuario creado con éxito"); // Mensagem de sucesso
				setUser({
					name: "",
					email: "",
					password: "",
					password_check: "",
				});
				setIsShown(!isShow);
			} else {
				setMessage("Ocurrió un error inesperado"); // Mensagem de erro
			}
		} else {
			setMessage("Las contraseñas no coinciden"); // Mensagem de senha não coincidente
			setUser({ ...user, password: "", password_check: "" });
		}
	};

	const loginCustomer = async () => {
		const login = await actions.loginUser(user);
		if (login) {
			if (login.success) {
				setMessage("Inicio de sesión exitoso"); // Mensagem de login bem-sucedido
				navigate("/private");
			} else if (login.error === "invalid_email") {
				setMessage("El correo electrónico no está registrado"); // Mensagem de e-mail não reconhecido
			} else if (login.error === "invalid_password") {
				setMessage("La contraseña es incorrecta"); // Mensagem de senha incorreta
			} else {
				setMessage("No se pudo iniciar sesión"); // Mensagem de falha no login genérica
			}
		} else {
			setMessage("No se pudo iniciar sesión"); // Mensagem de falha no login genérica
		}
	};

	return (
		<div className="login-form">
			<section onSubmit={(e) => e.preventDefault()}>
				<h1>{!isShow ? "Iniciar sesión" : "Registrarse"}</h1>
				<div className="content">
					{isShow && (
						<div className="input-field">
							<input
								type="text"
								value={user.name}
								placeholder="Nombre"
								autoComplete="nope"
								onChange={(e) => setUser({ ...user, name: e.target.value })}
							/>
						</div>
					)}
					<div className="input-field">
						<input
							type="email"
							value={user.email}
							placeholder="Correo electrónico"
							autoComplete="nope"
							onChange={(e) => setUser({ ...user, email: e.target.value })}
						/>
					</div>
					<div className="input-field">
						<input
							type="password"
							value={user.password}
							placeholder="Contraseña"
							autoComplete="new-password"
							onChange={(e) => setUser({ ...user, password: e.target.value })}
						/>
					</div>
					{isShow && (
						<div className="input-field">
							<input
								type="password"
								value={user.password_check}
								placeholder="Repetir contraseña"
								autoComplete="new-password"
								onChange={(e) => setUser({ ...user, password_check: e.target.value })}
							/>
						</div>
					)}
				</div>
				<div className="action">
					<button
						className={!isShow ? "btn btn-primary" : "btn btn-secondary"}
						onClick={() => (isShow ? registerUser() : setIsShown(!isShow))}
					>
						{isShow ? "Registrarse" : "Registrar"}
					</button>
					<button
						className={isShow ? "btn btn-primary" : "btn btn-secondary"}
						onClick={() => (!isShow ? loginCustomer() : setIsShown(!isShow))}
					>
						{isShow ? "Iniciar sesión" : "Acceder"}
					</button>
				</div>
				{message && <div className="message">{message}</div>} {/* Exibe a mensagem */}
			</section>
		</div>
	);
};

export default Login;

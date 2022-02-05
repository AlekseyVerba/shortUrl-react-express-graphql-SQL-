import React,{useContext, useState} from "react";
import { Link } from "react-router-dom";
import useHttp from "../hooks/useHttp";
import useChangeHandler from "../hooks/useChangeHandel";
import Context from "../context";


const styleAuth = {
    maxWidth: "400px",
    margin: "0 auto"
}

const Auth = () => {
    const emailInput = useChangeHandler("", { isEmty: { status: false, message: "Необходимо заполнить поле" }, isEmail: { status: true, message: "Поле должно быть заполнено в виде email@mail.ru" } })
    const passwordInput = useChangeHandler("", { minLength: { count: 6, message: "Поле должно иметь более 6 символов" }, maxLength: { count: 12, message: "Поле должно иметь менее 12 символов" }, isEmty: { status: false, message: "Необходимо заполнить поле" } })
    const {login} = useContext(Context) 
    // console.log(isAuth)
    const { request, loading } = useHttp()
    const [errors, setErrors] = useState(null)


    const submitAuth = async (e) => {
        e.preventDefault()
        try {
            const query = `
            query{
                checkAuth(authInfo: {login: "${emailInput.value}", password: "${passwordInput.value}"}) {
                    user {name,surname,email,city,birthday} status {status message} userInfo {tokenUser userId}
                }
            }
            `

            const data = await request(query)
            if (!data.data.checkAuth.status.status) {
                setErrors(data.data.checkAuth.status.message)
            } else {
                setErrors(null)
                login(data.data.checkAuth.userInfo.tokenUser, data.data.checkAuth.userInfo.userId)
            }
        } catch(e) {
            console.log("Ошибка")
        }
    }

    return (
        <div style={styleAuth}>
            <form onSubmit={submitAuth}>
                <div className="form-group">
                    <label className="form-label mt-4">Email</label>
                    {emailInput.isDirty && (emailInput.validation.isEmty.status || emailInput.validation.isEmail.status) ? <p style={{ color: "red" }}>{emailInput.validation.isEmty.message || emailInput.validation.isEmail.message}</p> : null}
                    <input value={emailInput.value} onBlur={emailInput.changeDirty} onChange={(e) => emailInput.onChangeInput(e)} type="text" name="email" className="form-control" placeholder="Email" />
                </div>

                <div className="form-group">
                    <label className="form-label mt-4">Password</label>
                    {passwordInput.isDirty && (passwordInput.validation.isEmty.status || passwordInput.validation.minLength.status || passwordInput.validation.maxLength.status) ? <p style={{ color: "red" }}>{passwordInput.validation.isEmty.message || passwordInput.validation.minLength.message || passwordInput.validation.maxLength.message}</p> : null}
                    <input value={passwordInput.value} onBlur={passwordInput.changeDirty} onChange={(e) => passwordInput.onChangeInput(e)} type="password" name="password" className="form-control" placeholder="Password" />
                </div>
                {errors ? <p style={{color: "red", marginTop: "15px", marginBottom: "0", textAlign: "center"}}>{errors}</p> : null}
                <button disabled={emailInput.validation.validInput && passwordInput.validation.validInput ? false : true} type="submit" style={{width: "100%", marginTop: "20px"}} className="btn btn-primary btn-lg">Вход</button>
            </form>

            
            <div style={{margin: "10px auto", textAlign: "center"}}>
                <Link  to="/register">Регистрация</Link> <br></br>
                <Link  to="/reset-password">Забыли пароль?</Link>
            </div>

        </div>
    )
}

export default Auth
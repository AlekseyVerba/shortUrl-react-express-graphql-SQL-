import React, { useState, useEffect } from "react"
import { withRouter } from "react-router-dom"
import useHttp from "../hooks/useHttp";
import useChangeHandler from "../hooks/useChangeHandel";


const styleAuth = {
    maxWidth: "400px",
    margin: "0 auto"
}

const ConfirmPassword = ({ match: { params: { token } } }) => {
    const passwordInput = useChangeHandler("", { minLength: { count: 6, message: "Поле должно иметь более 6 символов" }, maxLength: { count: 12, message: "Поле должно иметь менее 12 символов" }, isEmty: { status: false, message: "Необходимо заполнить поле" } })

    const [currentToken, setCurrentToken] = useState(null)
    const { request, loading } = useHttp()
    const [errors, setErrors] = useState(null)
    const [messageSuccess, setMessageSucces] = useState(null)

    useEffect(() => {
        if (currentToken === null && token) {
            async function checkPassword() {
                const query = `
                mutation {
                    checkTokenPassword(token: "${token}") {
                        status message
                    }
                } 
                `
                const data = await request(query)
                if (data.data.checkTokenPassword.status) {
                    setCurrentToken(token)
                    setMessageSucces(data.data.checkTokenPassword.message)
                } else {
                    console.log(data)
                    setErrors(data.data.checkTokenPassword.message)
                }
            }
            checkPassword()
        }
    }, [])

    const submitAuth = async (e) => {
        e.preventDefault()
        try {
            const query = `
            mutation{
                updatePassword(info: {newPassword: "${passwordInput.value}", token: "${currentToken}"}) {
                    status message
                }
            }
            `

            const data = await request(query)
            console.log(data)
            debugger
            // if (!data.data.checkAuth.status) {
            //     setErrors(data.data.checkAuth.message)
            // } else {
            //     setErrors(null)
            // }
        } catch (e) {
            console.log("Ошибка")
        }
    }

    return (
        <div style={styleAuth}>
            <h1 style={{textAlign: "center", color: "red"}}>{errors}</h1>
            <h1 style={{textAlign: "center", color: "green"}}>{messageSuccess}</h1>
            {currentToken ? 
            <form onSubmit={submitAuth}>
         
                
            <div className="form-group">
                <label className="form-label mt-4">New password</label>
                {passwordInput.isDirty && (passwordInput.validation.isEmty.status || passwordInput.validation.minLength.status || passwordInput.validation.maxLength.status) ? <p style={{ color: "red" }}>{passwordInput.validation.isEmty.message || passwordInput.validation.minLength.message || passwordInput.validation.maxLength.message}</p> : null}
                <input value={passwordInput.value} onBlur={passwordInput.changeDirty} onChange={(e) => passwordInput.onChangeInput(e)} type="password" name="password" className="form-control" placeholder="New password" />
            </div>
            {errors ? <p style={{ color: "red", marginTop: "15px", marginBottom: "0", textAlign: "center" }}>{errors}</p> : null}
            <button disabled={passwordInput.validation.validInput ? false : true} type="submit" style={{ width: "100%", marginTop: "20px" }} className="btn btn-primary btn-lg">Обновить пароль</button>
        </form> :
        null    
        }
            

        </div>
    )
}

export default withRouter(ConfirmPassword)
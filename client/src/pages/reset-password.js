import React, {useState} from "react";
import { Link } from "react-router-dom";
import useHttp from "../hooks/useHttp";
import useChangeHandler from "../hooks/useChangeHandel";

const styleAuth = {
    maxWidth: "400px",
    margin: "0 auto"
}

const ResetPassword = () => {

    const emailInput = useChangeHandler("", { isEmty: { status: false, message: "Необходимо заполнить поле" }, isEmail: { status: true, message: "Поле должно быть заполнено в виде email@mail.ru" } })

    const { request, loading } = useHttp()
    const [errors, setErrors] = useState(null)
    const [success, setSuccess] = useState(null)


    const submitAuth = async (e) => {
        e.preventDefault()
        try {
            const query = `
            mutation{
                resetPassword(email: "${emailInput.value}") {
                    status message
                }
            }
            `

            const data = await request(query)
            if (!data.data.resetPassword.status) {
                setErrors(data.data.resetPassword.message)
            } else {
                setSuccess(data.data.resetPassword.message)
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
                {errors ? <p style={{color: "red", marginTop: "15px", marginBottom: "0", textAlign: "center"}}>{errors}</p> : null}
                {success ? <p style={{color: "green", marginTop: "15px", marginBottom: "0", textAlign: "center"}}>{success}</p> : null}
                <button disabled={emailInput.validation.validInput ? false : true} type="submit" style={{width: "100%", marginTop: "20px"}} className="btn btn-primary btn-lg">Отправить код</button>
            </form>

            
            <div style={{margin: "10px auto", textAlign: "center"}}>
                <Link  to="/auth">Вход</Link> <br></br>
            </div>

        </div>
    )
}

export default ResetPassword
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useHttp from "../hooks/useHttp";
import useChangeHandler from "../hooks/useChangeHandel";


const styleRegister = {
    maxWidth: "400px",
    margin: "0 auto"
}


const defaultStatus = {
    show: false,
    isError: false,
    message: null
}



const Register = () => {

    const nameInput = useChangeHandler("", { minLength: { count: 3, message: "Поле должно иметь более 3 символов" }, isEmty: { status: false, message: "Необходимо заполнить поле" } })
    const surnameInput = useChangeHandler("", { minLength: { count: 3, message: "Поле должно иметь более 3 символов" }, isEmty: { status: false } })
    const cityInput = useChangeHandler("")
    const birthdayInput = useChangeHandler("")
    const emailInput = useChangeHandler("", { isEmty: { status: false, message: "Необходимо заполнить поле" }, isEmail: { status: true, message: "Поле должно быть заполнено в виде email@mail.ru" } })
    const passwordInput = useChangeHandler("", { minLength: { count: 6, message: "Поле должно иметь более 6 символов" }, maxLength: { count: 12, message: "Поле должно иметь менее 12 символов" }, isEmty: { status: false, message: "Необходимо заполнить поле" } })


    const [status, setStatus] = useState(defaultStatus)
    const { request, loading } = useHttp()


    const submitForm = async (e) => {
        e.preventDefault()




        try {
            const query = `
            mutation {
                addUser(user: {
                        name: "${nameInput.value}", 
                        surname: "${surnameInput.value}", 
                        city: "${cityInput.value ? cityInput.value : ""}",
                        birthday: "${birthdayInput.value ? birthdayInput.value : ""}",
                        email: "${emailInput.value}", 
                        password: "${passwordInput.value}"
                    }
                ) {
                    status message
                }
            }`
            // console.log(query)
            // debugger
            const data = await request(query)
            if (data.data.addUser.status === true) {
                setStatus({
                    show: true,
                    isError: false,
                    message: data.data.addUser.message
                })
                setTimeout(() => {
                    setStatus(defaultStatus)
                }, 3000)
            } else {
                setStatus({
                    show: true,
                    isError: true,
                    message: data.data.addUser.message
                })
            }

        } catch (e) {
            console.log("Ошбика")
        }

    }


    return (
        <div style={styleRegister}>
            <form onSubmit={submitForm}>
                <div className="form-group">
                    <label className="form-label mt-4">Your name </label>
                    {nameInput.isDirty && (nameInput.validation.isEmty.status || nameInput.validation.minLength.status) ? <p style={{ color: "red" }}>{nameInput.validation.isEmty.message || nameInput.validation.minLength.message}</p> : null}

                    <input type="text" value={nameInput.value} onBlur={nameInput.changeDirty} onChange={(e) => nameInput.onChangeInput(e)} name="name" className="form-control" placeholder="Name" />
                </div>

                <div className="form-group">
                    <label className="form-label mt-4">Your surname</label>
                    {surnameInput.isDirty && (surnameInput.validation.isEmty.status || surnameInput.validation.minLength.status) ? <p style={{ color: "red" }}>{surnameInput.validation.isEmty.message || surnameInput.validation.minLength.message}</p> : null}
                    <input type="text" value={surnameInput.value} onBlur={surnameInput.changeDirty} onChange={(e) => surnameInput.onChangeInput(e)} name="surname" className="form-control" placeholder="Surname" />
                </div>

                <div className="form-group">
                    <label className="form-label mt-4">Your city</label>

                    <input type="text" value={cityInput.value} onBlur={cityInput.changeDirty} onChange={(e) => cityInput.onChangeInput(e)} name="city" className="form-control" placeholder="City" />
                </div>

                <div className="form-group">
                    <label className="form-label mt-4">Your birthday</label>
                    <input type="date" value={birthdayInput.value} onBlur={birthdayInput.changeDirty} onChange={(e) => birthdayInput.onChangeInput(e)} name="birthday" className="form-control" placeholder="Birthday" />
                </div>

                <div className="form-group">
                    <label className="form-label mt-4">Email</label>
                    {emailInput.isDirty && (emailInput.validation.isEmty.status || emailInput.validation.isEmail.status) ? <p style={{ color: "red" }}>{emailInput.validation.isEmty.message || emailInput.validation.isEmail.message}</p> : null}
                    <input type="text" value={emailInput.value} onBlur={emailInput.changeDirty} onChange={(e) => emailInput.onChangeInput(e)} name="email" className="form-control" placeholder="Email" />
                </div>

                <div className="form-group">
                    <label className="form-label mt-4">Password</label>
                    {passwordInput.isDirty && (passwordInput.validation.isEmty.status || passwordInput.validation.minLength.status || passwordInput.validation.maxLength.status) ? <p style={{ color: "red" }}>{passwordInput.validation.isEmty.message || passwordInput.validation.minLength.message || passwordInput.validation.maxLength.message}</p> : null}
                    <input type="password" value={passwordInput.value} onBlur={passwordInput.changeDirty} onChange={(e) => passwordInput.onChangeInput(e)} name="password" className="form-control" placeholder="Password" />
                </div>

                {status.show ? <p style={{ color: status.isError ? "red" : "green", fontSize: "17px", textAlign: "center", margin: "10px auto 0" }}>{status.message}</p> : null}

                {
                    !loading ?
                        <button disabled={nameInput.validation.validInput && surnameInput.validation.validInput && emailInput.validation.validInput && passwordInput.validation.validInput ? false : true} type="submit" style={{ width: "100%", marginTop: "20px" }} className="btn btn-primary btn-lg">Регистрация</button> :
                        null
                }

            </form>


            <div style={{ margin: "10px auto", textAlign: "center" }}>
                <Link to="/">Вход</Link>
            </div>

        </div>
    )
}

export default Register
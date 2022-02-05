import React, {useState} from "react";
import useChangeHandler from "../hooks/useChangeHandel";
import useHttp from "../hooks/useHttp"

const EditProfile = ({ name, surname, city, birthday, email, imgUser , cancelEdit, changeInfoProfile}) => {
    const nameInput = useChangeHandler(name ? name : "", { minLength: { count: 3, message: "Поле должно иметь более 3 символов" }, isEmty: { status: false, message: "Необходимо заполнить поле" } })
    const surnameInput = useChangeHandler(surname ? surname : "", { minLength: { count: 3, message: "Поле должно иметь более 3 символов" }, isEmty: { status: false } })
    const cityInput = useChangeHandler(city ? city : "")
    const birthdayInput = useChangeHandler(birthday ? birthday : "")
    const emailInput = useChangeHandler(email ? email : "", { isEmty: { status: false, message: "Необходимо заполнить поле" }, isEmail: { status: true, message: "Поле должно быть заполнено в виде email@mail.ru" } })

    const { request, loading } = useHttp()

    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    const submitForm = async (e) => {
        e.preventDefault()
        const query = `
            mutation {
                updateProfile(user: {
                    name: "${nameInput.value}",
                    surname: "${surnameInput.value}",
                    city: "${cityInput.value}",
                    birthday: "${birthdayInput.value}",
                    email: "${emailInput.value}"
                }) {
                    status message
                }
            }
        `
        const {data: {updateProfile: {status, message}}} = await request(query)
        if (status) {
            setSuccessMessage(message)
            setErrorMessage(null)
            setTimeout(() => {
                setSuccessMessage(null)
            }, 3000)
            changeInfoProfile({name: nameInput.value, surname: surnameInput.value, city: cityInput.value, birthday: birthdayInput.value, email: emailInput.value})
        } else {
            setSuccessMessage(null)
            setErrorMessage(message)
            setTimeout(() => {
                setErrorMessage(null)
            }, 3000)
        }
    }

    console.log(loading)

    return (
        <div>
            
            <form onSubmit={submitForm}>
                <div className="form-group">
                    <fieldset disabled="">
                        <label className="form-label" >Имя</label>
                        <input value={nameInput.value} onBlur={nameInput.changeDirty} onChange={(e) => nameInput.onChangeInput(e)} className="form-control"  type="text"   />
                        {nameInput.isDirty && (nameInput.validation.isEmty.status || nameInput.validation.minLength.status) ?  <div style={{display: "block"}} className="invalid-feedback">{nameInput.validation.isEmty.message || nameInput.validation.minLength.message}</div>: null}
                        
                    </fieldset>
                </div>
                <div className="form-group">
                    <fieldset disabled="">
                        <label className="form-label" >Фамилия</label>
                        <input value={surnameInput.value} onBlur={surnameInput.changeDirty} onChange={(e) => surnameInput.onChangeInput(e)} className="form-control"  type="text" />
                        {surnameInput.isDirty && (surnameInput.validation.isEmty.status || surnameInput.validation.minLength.status) ? <div style={{display: "block"}} className="invalid-feedback">{surnameInput.validation.isEmty.message || surnameInput.validation.minLength.message}</div> : null}
                        
                    </fieldset>
                </div>
                <div className="form-group">
                    <fieldset disabled="">
                        <label className="form-label" >Город</label>
                        <input value={cityInput.value} onBlur={cityInput.changeDirty} onChange={(e) => cityInput.onChangeInput(e)} className="form-control"  type="text"  />
                    </fieldset>
                </div>
                <div className="form-group">
                    <fieldset disabled="">
                        <label className="form-label" >Дата рождения</label>
                        <input value={birthdayInput.value} onBlur={birthdayInput.changeDirty} onChange={(e) => birthdayInput.onChangeInput(e)} className="form-control"  type="date" />
                    </fieldset>
                </div>
                <div className="form-group">
                    <fieldset disabled="">
                        <label className="form-label" >Email</label>
                        <input value={emailInput.value} onBlur={emailInput.changeDirty} onChange={(e) => emailInput.onChangeInput(e)} className="form-control"  type="text" />

                        {emailInput.isDirty && (emailInput.validation.isEmty.status || emailInput.validation.isEmail.status) ? <div style={{display: "block"}} className="invalid-feedback">{emailInput.validation.isEmty.message || emailInput.validation.isEmail.message}</div> : null}
                    </fieldset>
                </div>


                {errorMessage ? <p style={{color: "red", fontSize: "17px", textAlign: "center", margin: "10px auto 0" }}>{errorMessage}</p> : null }

                {successMessage ? <p style={{color: "green", fontSize: "17px", textAlign: "center", margin: "10px auto 0" }}>{successMessage}</p> : null }

                {!loading ? 
                    
                <button style={{marginTop: "50px", width: "100%"}} disabled={nameInput.validation.validInput && surnameInput.validation.validInput && emailInput.validation.validInput ? false : true} className="btn btn-lg btn-primary" type="submit">Сохранить</button>

                : null}


            </form>

            <div className="d-grid gap-2" >

                <button className="btn btn-lg btn-primary" onClick={cancelEdit} style={{marginTop: "10px"}} type="button">Отменить</button> 
            </div>
        </div>
    )
}

export default EditProfile
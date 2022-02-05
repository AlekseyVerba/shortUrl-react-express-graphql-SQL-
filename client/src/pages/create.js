import React, { useState } from "react";
import { Link } from "react-router-dom"
import useHttp from "../hooks/useHttp";
import useChangeHandler from "../hooks/useChangeHandel";
const styleForm = {
    maxWidth: "400px",
    margin: "0 auto"
}

const Create = () => {
    const linkHandler = useChangeHandler("", { isEmty: { status: false, message: "Необходимо заполнить поле" }})
    const [newLink, setNewLink] = useState(null)
    const [errors, setErrors] = useState(null)
    const [success, setSuccess] = useState(null)

    const { request } = useHttp()


    const submitForm = async (e) => {
        e.preventDefault()
        try {
            const query = `
                mutation {
                    createLink(link: "${linkHandler.value}") {
                    status message urlLink
                    }
                }
            `
            const data = await request(query)
            if (data.data.createLink.status) {
                setErrors(null)
                setSuccess(data.data.createLink.message)
                setNewLink(`/t/${data.data.createLink.urlLink}`)
                linkHandler.clearVal()
                
            } else {
                setNewLink(null)
                setSuccess(null)
                setErrors(data.data.createLink.message)
                linkHandler.clearVal()
            }
        } catch (e) {

        }
    }


    

    return (
        <div style={styleForm}>
            <form onSubmit={submitForm}>
                <div className="form-group">
                    <label className="form-label mt-4">Create link</label>
                    {linkHandler.isDirty && (linkHandler.validation.isEmty.status) ? <p style={{ color: "red" }}>{linkHandler.validation.isEmty.message}</p> : null}
                    <input type="text" onBlur={linkHandler.changeDirty} value={linkHandler.value} onChange={(e) => linkHandler.onChangeInput(e)} name="link" className="form-control" placeholder="Create link" />
                </div>
                {success ? <h5 style={{marginTop: "15px",color: "green", textAlign: "center"}}>{success}</h5> : null}
                {errors ? <h5 style={{marginTop: "15px",color: "red", textAlign: "center"}}>{errors}</h5> : null}
                {newLink ? <div style={{textAlign: "center"}}><Link className="navbar-brand" to={newLink}>Перейти</Link></div> : null}
                <button disabled={linkHandler.validation.validInput ? false : true} type="submit" style={{ width: "100%", marginTop: "20px" }} className="btn btn-primary btn-lg">Создать</button>
            </form>
        </div>
    )
}

export default Create;
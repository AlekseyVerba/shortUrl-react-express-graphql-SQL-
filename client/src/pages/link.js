import React, { useState } from "react"
import useHttp from "../hooks/useHttp"
import { useEffect } from "react"
import { withRouter } from "react-router-dom"
import {Redirect} from "react-router-dom"

const Link = ({match: {params: {link}}}) => {
    const {request, loading} = useHttp()
    const [redirectUrl, setRedirectUrl] = useState(null)
    const [errors, setErrors] = useState(null)
    const [success, setSuccess] = useState(null)
    useEffect(() => {
        async function  redirectToUrl() {
            const query = `
                query {
                    redirectToUrl(code: "${link}") {
                        status message url
                    }
                }
            `
            const data = await request(query)
            if (data.data.redirectToUrl.status) {
                setErrors(null)
                setSuccess(data.data.redirectToUrl.message)
                setRedirectUrl(data.data.redirectToUrl.url)
            } else {
                setSuccess(null)
                setErrors(data.data.redirectToUrl.message)
            }
            
        }
        redirectToUrl()
    }, [])

    if (redirectUrl) {
        window.location.replace(redirectUrl)
    }

    return (
        <div>
            {errors ?  <h5 style={{marginTop: "15px",color: "red", textAlign: "center"}}>{errors}</h5> : null}
            {success ?  <h5 style={{marginTop: "15px",color: "green", textAlign: "center"}}>{success}</h5> : null}
        </div>
    )
}

export default withRouter(Link) 
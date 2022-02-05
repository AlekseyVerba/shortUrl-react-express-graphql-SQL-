
import React,{useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import useHttp from "../hooks/useHttp"


const ConfirmToken = ({match: {params: {token}}}) => {
    const [currentToken, setCurrentToken] = useState(null)
    const [messageError, setMessageError] = useState(null)
    const [messageSucces, setMessageSucces] = useState(null)
    const { request, loading } = useHttp()

        useEffect(() => {
        if (currentToken == null && token) {
            async function checkTotal() {
                const query = `
                mutation {
                    checkToken(token: "${token}") {
                        status message
                    }
                } 
                `
                const data = await request(query)
                if (data.data.checkToken.status) {
                    setCurrentToken(token)
                    setMessageSucces(data.data.checkToken.message)
                } else {
                    console.log(data)
                    setMessageError(data.data.checkToken.message)
                }
            }
            checkTotal()
        }
    }, [])


    return (
        <div>
            <h1 style={{textAlign: "center", color: "red"}}>{messageError}</h1>
            <h1 style={{textAlign: "center", color: "green"}}>{messageSucces}</h1>
        </div>
    )
}

export default withRouter(ConfirmToken) 
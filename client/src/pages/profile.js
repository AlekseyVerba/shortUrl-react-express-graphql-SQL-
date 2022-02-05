import React, { useEffect, useState } from "react"
import useHttp from "../hooks/useHttp"
import Loader from "../components/loader/loader"
import InfoProfile from "../components/infoProfile"
import EditProfile from "../components/editProfile"

const Profile = () => {

    const [infoUser, setInfoUser] = useState({})
    const [errorsMessage, setErrorMessage] = useState(null)
    const [isGetInfo, setIsGetInfo] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const { request, loading } = useHttp()

    useEffect(() => {

        async function getInfoProfile() {

            const query = `
            query {
                getCurrentUser {
                  status {status message}
                  user {name surname city birthday email imgUser}
                }
              }
            `
            const { data: { getCurrentUser: { status, user } } } = await request(query)
            if (status.status) {
                setInfoUser(user)
            } else {
                setErrorMessage(status.message)
            }


            setIsGetInfo(true)
        }

        if (!isGetInfo) {
            getInfoProfile()
        }
    }, [])

    const changeInfoProfile = (infoProfile) => {
        setInfoUser(infoProfile)
    }


    const startEdit = () => {
        setIsEdit(true)
    }

    const cancelEdit = () => {
        setIsEdit(false)
    }


    if (loading) {
        return <Loader />
    }

    if (errorsMessage) {
        return (
            <div>
                <h1 style={{ textAlign: "center", color: "red" }}>{errorsMessage}</h1>
            </div>
        )
    }


    return (
        <div>
            <div style={{width: "1024px", margin: "0 auto"}}>
                {isEdit

                    ?
                    
                    <EditProfile {...infoUser} cancelEdit={cancelEdit} changeInfoProfile={changeInfoProfile} />

                    :

                    <InfoProfile {...infoUser} startEdit={startEdit} />

                }
            </div>
            <div>

            </div>
        </div>
    )
}

export default Profile
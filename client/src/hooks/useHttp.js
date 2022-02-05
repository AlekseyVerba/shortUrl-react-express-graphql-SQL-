import {useState, useCallback} from "react"

const useHttp = () => {
    const [loading, setLoading] = useState(false)

    const request = useCallback( async (query) => {
        try {
            setLoading(true)
            let headers
            if (JSON.parse(localStorage.getItem("userData")) && JSON.parse(localStorage.getItem("userData")).token) {
                headers = {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Auth": JSON.parse(localStorage.getItem("userData")).token
                }
            } else {
                headers = {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            }
            const response = await fetch("/graphql", {
                method: "POST",
                headers,
                body: JSON.stringify({query})
            })
            const data = await response.json()
            console.log(data)
            // debugger

            if (!response.ok) {
                throw new Error(data.message || "Прозиошла ошибка")
            }
            setLoading(false)

            return data

        } catch(e) {
            setLoading(false)
            throw new Error("Прозиошла ошибка")
        }
    }, [])

    return {request, loading}
}


export default useHttp
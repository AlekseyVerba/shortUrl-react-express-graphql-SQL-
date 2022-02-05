import React, { useEffect, useState } from "react"
import useHttp from "../hooks/useHttp";
import Loader from "../components/loader/loader"
import CardLink from "../components/card-link";

const Links = () => {
    const [itemsList, setItemsList] = useState([])
    const {request, loading} = useHttp()
    const [errors, setErrors] = useState(null)
    const [loadingGetLinks, setLoadingGetLinks] = useState(true)
    useEffect(() => {
        if (itemsList.length === 0) {
            async function  getInfo () {
                const query = `
                    query {
                        getLinks {
                            links {
                                id from to code clicks shortDescription created
                            } status message
                        }
                    }
                `
                const data = await request(query)
                if (data.data.getLinks.status) {
                    setItemsList(data.data.getLinks.links)
                } else {
                    setErrors(data.data.getLinks.message)
                }
                setLoadingGetLinks(false)
                
              
            }
            getInfo()
        }
    }, [])

    const deleteLink = async (id) => {
        const newItems = itemsList.filter(link => link.id !== id)
        setItemsList(newItems)
        const query = `
            mutation {
                deleteLink(id:${+id}) {
                    status message
                }
            }
        `
        await request(query)
    }

    const addDescription = async (id, description) => {
        const currentItemId = itemsList.findIndex(item => item.id === id)
        const newItems = itemsList.map((item, idx) => {
            console.log(currentItemId)
            if (currentItemId === idx) {
                item.shortDescription = description
            }
            return item
        })
        setItemsList(newItems)
        
        const query = `
            mutation {
                changeDescription(info: {id: ${+id}, description: "${description}"}) {
                    status message
                }
            }
        `
        await request(query)
    }

    if (loadingGetLinks) {
        return <Loader />
    }
    if (itemsList.length === 0) {
        if (errors) {
            return  <h5 style={{marginTop: "15px",color: "red", textAlign: "center"}}>{errors}</h5>
        } else {
            return <h5 style={{marginTop: "15px", textAlign: "center"}}>Ссылки ещё не были созданы</h5>
        }
    }
    const items = itemsList.map(item => {
        return <CardLink key={item.id} addDescription={addDescription} deleteLink={deleteLink} {...item}/>
    })
    return (
        <div>
            {items}
        </div>
    )
}

export default Links
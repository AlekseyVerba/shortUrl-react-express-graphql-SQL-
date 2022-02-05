import React, {useState} from "react"
import { Link } from "react-router-dom"
import useChangeHandler from "../hooks/useChangeHandel"


const CardLink = ({clicks, created, from, shortDescription, to, code, id, deleteLink, addDescription}) => {

    const dateCreate = new Date(+created).toDateString()
    const [inpDescrip, setInpDescrip] = useState(false)
    const descripHandler = useChangeHandler("", { isEmty: { status: false, message: "Необходимо заполнить поле" }})

    const clickAddDescription = () => {
        addDescription(id,descripHandler.value)
        descripHandler.clearVal()
        setInpDescrip(false)
    }

    console.log(shortDescription)

    return (
        <div className="card" style={{marginBottom: "15px"}}>
            <div className="card-body">
                <p className="card-text">
                    <h2>{shortDescription}</h2>
                </p>
                <p>Переходов по ссылке: {clicks}</p>
                <p>Ссылка создана: {dateCreate}</p>
                <p>Оригинальная ссылка: {from}</p>
                <p>Новая ссылка: {to}</p>
                <div style={{display: "flex"}}>
                    <Link style={{marginRight: "20px"}} to={`/t/${code}`} className="btn btn-primary">Перейти</Link>
                    {!inpDescrip ? <button style={{marginRight: "20px"}} onClick={() => setInpDescrip(true)}  type="button" className="btn btn-info">{shortDescription ? <span>Изменить описание</span> : <span>Добавить описание</span>}</button> : null}
                    
                    {inpDescrip ? <> <input onBlur={descripHandler.changeDirty} value={descripHandler.value} onChange={(e) => descripHandler.onChangeInput(e)} style={{width: "150px", marginRight: "20px"}} type="text" className="form-control"></input><button onClick={() => clickAddDescription()} style={{marginRight: "20px"}}  type="button" className="btn btn-success">Ок</button><button style={{marginRight: "20px"}} onClick={() => setInpDescrip(false)}  type="button" className="btn btn-light">X</button></> : null}
                    
                    <button  type="button" onClick={() => deleteLink(id)} className="btn btn-danger">Удалить</button>
                </div>
            </div>
        </div>
    )
}

export default CardLink
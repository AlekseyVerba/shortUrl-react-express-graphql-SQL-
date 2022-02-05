import React from "react"

const InfoProfile = ({name, surname, city, birthday, email, imgUser, startEdit}) => {

    const convertTimeStampToDate = (timeStamp) => {
        if (timeStamp) {
            const date = new Date(+timeStamp).toDateString()
            return date
        } 
    }

    return (
        <div>
            <div>
                <h3>Имя: {name ? name : "Неизвестно"}</h3>
                <h3>Фамилия: {surname ? surname : "Неизвестно"}</h3>
                <h3>Город: {city ? city : "Неизвестно"}</h3>
                <h3>Дата рождения: {birthday ? convertTimeStampToDate(birthday) : "Неизвестно"}</h3>
                <h3>Почта: {email ? email : "Неизвестно"}</h3>
            </div>
            <div className="d-grid gap-2" style={{marginTop: "50px"}}>
                <button className="btn btn-lg btn-primary" onClick={startEdit} type="button">Редактировать</button>
            </div>
        </div>
    )
}

export default InfoProfile
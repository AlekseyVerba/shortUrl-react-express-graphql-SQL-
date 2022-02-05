import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Context from "../context";
import { useContext } from "react";

const NavMenu = ({location}) => {
    const {isAuth, logout} = useContext(Context)
    const currentUrl = location.pathname

    const logoutHandler = (e) => {
        e.preventDefault()
        logout()
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">

                <Link className="navbar-brand" to="/">Создание коротких ссылок</Link>

                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav me-auto">
                        {
                            !isAuth ?
                            <li className="nav-item">
                                <Link className={currentUrl == "/" || currentUrl.indexOf("register") !== -1 ? "nav-link active" : "nav-link"} to="/">Вход</Link>
                            </li> : 
                            null 
                        }

                        {
                            isAuth ?
                            <>
                                <li className="nav-item">
                                    <Link 
                                        className={currentUrl.indexOf("profile") !== -1 ? 
                                        "nav-link active" : 
                                        "nav-link"
                                        } 
                                        to="/profile"
                                        >Профиль
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className={currentUrl.indexOf("create") !== -1 ? 
                                        "nav-link active" : 
                                        "nav-link"
                                        } 
                                        to="/create"
                                        >Создать новую ссылку
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        className={currentUrl.indexOf("links") !== -1 ? 
                                        "nav-link active" : 
                                        "nav-link"
                                        } 
                                        to="/links"
                                        >Мои ссылки
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button type="button" onClick={(e) => logoutHandler(e)} className="btn btn-primary">Выход</button>
                                </li>
                            </>
                            :
                            null

                        }


                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default withRouter(NavMenu)
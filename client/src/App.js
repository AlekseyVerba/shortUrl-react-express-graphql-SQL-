import {BrowserRouter as Router} from "react-router-dom"
import routePage from "./routes/index"
import NavMenu from "./components/nav-menu";
import React from "react";
import Context from "./context";
import useAuth from "./hooks/useAuth";
import Loader from "./components/loader/loader";


function App() {
  const {token,userId, ready, login, logout} = useAuth()
  const isAuth = !!token
  const pageShow = routePage(isAuth)

  if (!ready) {
    return <Loader />
  }

  return (
    <Context.Provider value={{token,userId, ready, login, logout,isAuth}}>
      <Router>
        <div className="App">
          <NavMenu />
          <div style={{marginTop: "20px"}} className="container">
            {pageShow}
          </div>
        </div>
      </Router>
    </Context.Provider>
  );
}

export default App;

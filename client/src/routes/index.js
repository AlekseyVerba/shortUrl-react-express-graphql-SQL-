import { Switch, Route, Redirect} from "react-router-dom"
import Auth from "../pages/auth"
import Create from "../pages/create"
import Register from "../pages/register"
import ConfirmToken from "../pages/confirm-token"
import ResetPassword from "../pages/reset-password"
import confirmPassword from "../pages/confirm-password"
import Profile from "../pages/profile"
import Links from "../pages/links"
import Link from "../pages/link"

const useRoutes = isAuth => {
    if (isAuth) {
        return (
            <Switch>
                <Route path="/create/" exact component={Create} />
                <Route path="/profile/" exact component={Profile} />
                <Route path="/links/" exact component={Links} />
                <Route path="/t/:link" exact component={Link} />
                <Redirect to="/create" />
                
            </Switch>
        )
    }


    return (
        <Switch>
            <Route path="/" exact component={Auth}/>
            <Route path="/register" exact component={Register} />
            <Route path="/confirm-register/:token" exact component={ConfirmToken} />
            <Route path="/reset-password" exact component={ResetPassword} />
            <Route path="/reset-password/:token" exact component={confirmPassword} />
            <Redirect to="/" />
        </Switch>
    )
}

export default useRoutes
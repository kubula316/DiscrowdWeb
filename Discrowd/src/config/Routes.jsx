import {Route, Routes} from "react-router";
import App from "../App.jsx";
import React from "react";
import Login from "../components/login/Login.jsx";
import ServerSelect from "../components/serverSelect/ServerSelect.jsx";
import ServerPanel from "../components/serverPanel/ServerPanel.jsx";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/select" element={<ServerSelect/>} />
            <Route path="/server/:id" element={<ServerPanel/>} />
            <Route path="/*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
    );
}
export default AppRoutes;
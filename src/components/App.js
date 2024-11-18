import React from "react";
import ReactDOM from "react-dom/client"
import Header from "./Header";
import NewUser from "./NewUser";
import DeleteUser from "./DeleteUser";
import UpdateUser from "./UpdateUser";
import Error from "./Error";
import { createBrowserRouter,Outlet,RouterProvider } from "react-router-dom";
import ShowUser from "./ShowUser";
import AddPartInfo from "./AddPartInfo";
import ShowPartInfo from "./ShowPartInfo";
import UpdateParts from "./UpdateParts";

const App = () => {
    return (
        <div className="container">
            <Header/>
            <Outlet/>
            <BillPage/>
        </div>
    );
}

const appRouter=createBrowserRouter([
     {
        path:"/",
        element:<App/>,
        children:[
            {
                    path:"/newuser",
                    element:<NewUser/>,
            },
            {
                path:"/updateuser",
                element:<UpdateUser/>,
            },
            {
                path:"/deleteuser",
                element:<DeleteUser/>,
            },
            {
                path:"/showuser",
                element:<ShowUser/>
            },
            {
                path:"/updateparts",
                element:<UpdateParts/>,
            },
            {
                path:"/addparts",
                element:<AddPartInfo/>,
            },
            {
                path:"/showparts",
                element:<ShowPartInfo/>,
            }
        ],
        errorElement: <Error/>,
     },
     
])

const root = ReactDOM.createRoot(document.getElementById('root')); // Corrected ReactDom to ReactDOM
root.render(<RouterProvider router={appRouter}></RouterProvider>);

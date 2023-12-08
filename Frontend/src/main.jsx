import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";
import Perfil from "./pages/Perfil/Perfil.jsx";
import Pago from "./pages/Pago/Pago.jsx";
import Subastas from "./pages/Subasta/Subastas.jsx";
import EditarCatalogo from "./pages/EditarCatalogo/EditarCatalogo.jsx";
import Reportes from "./pages/Reportes/Reportes.jsx";
import Token from "./pages/Token.jsx";
import Compras from "./pages/Compras/Compras.jsx";
import Busqueda from "./pages/Busqueda/Busqueda.jsx";
import BienUsuario from "./pages/BienUsuario/BienUsuario.jsx";
import InBien from "./pages/InBien/InBien.jsx";
import AsBien from "./pages/AsBien/AsBien.jsx";
import SinAsignar from "./pages/SinAsignar/SinAsignar.jsx";
import DeBaja from "./pages/DeBaja/DeBaja.jsx";
import Bitacora from "./pages/Bitacora/Bitacora.jsx";
import AdminUsuario from "./pages/AdminUsuario/AdminUsuario.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/AdminUsuario",
        element: <AdminUsuario/>,
      },
      {
        path: "/BienUsuario",
        element: <BienUsuario/>,
      },
      {
        path: "/InBien",
        element: <InBien/>,
      },
      {
        path: "/AsBien",
        element: <AsBien/>,
      },
      {
        path: "/busqueda",
        element: <Busqueda />,
      },
      {
        path: "/SinAsignar",
        element: <SinAsignar/>,
      },
      {
        path: "/DeBaja",
        element: <DeBaja/>,
      },
      {
        path: "/Bitacora",
        element: <Bitacora />,
      },
      {
        path: "/perfil",
        element: <Perfil />,
      },
      {
        path: "/pago",
        element: <Pago />,
      },
      {
        path: "/editar_catalogo",
        element: <EditarCatalogo />,
      },
      {
        path: "/reportes",
        element: <Reportes />,
      },
      {
        path: "/subastas",
        element: <Subastas />,
      },
      {
        path: "/compras",
        element: <Compras />,
      },
      {
        path: "/token",
        element: <Token />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

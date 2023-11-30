import { FiUser } from "react-icons/fi";
import Cliente from "./components/FormCliente";
import { useState } from "react";
import Proveedor from "./components/FormProveedor";
import useAuth from "../../auth/authStore";
import { Navigate } from "react-router-dom";

const SignUp = () => {
  const [toggleTipo, setToggleTipo] = useState(true);

  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-base-300 w-full h-[100vh] flex justify-center items-center">
      <div className="card  bg-base-100 shadow-xl max-w-screen-2xl lg:h-fit">
        <div className="card-body p-6 w-full flex flex-col justify-between">
          <div>
            <h2 className="card-title font-semibold text-2xl text-primary-focus">
              <FiUser />
              Crear nueva cuenta
            </h2>
            <div className="divider my-1 mt-2"></div>
          </div>
          <label className="label pl-0">
            <span className="label-text">Tipo de cuenta</span>
          </label>
          <div className="tabs tabs-boxed w-fit">
            <a
              className={"tab " + (toggleTipo ? "tab-active" : "")}
              onClick={() => setToggleTipo(true)}
            >
              Cliente
            </a>
            <a
              className={"tab " + (toggleTipo ? "" : "tab-active")}
              onClick={() => setToggleTipo(false)}
            >
              {" "}
              Proveedor
            </a>
          </div>
          {toggleTipo ? <Cliente /> : <Proveedor />}
        </div>
      </div>
    </div>
  );
};

export default SignUp;

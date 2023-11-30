import { Link } from "react-router-dom";
import useAuth from "../auth/authStore";
import Carrito from "../components/Carrito";
import useCarrito from "../store/carritoStore";

import Favorito from "../components/Favorito";
// eslint-disable-next-line react/prop-types
const AppLayout = ({ children }) => {
  const { imagen, logout } = useAuth((state) => state);
  const vaciar = useCarrito((state) => state.vaciar);
  const handleLogout = () => {
    logout();
    vaciar();
  };

  // console.log('usuario', usuario);
  return (
    <>
      <header>
        <div className="navbar bg-base-100 z-50">
          <div className="flex-1">
          
          <Link to="/" className="btn btn-ghost normal-case text-3xl">Inventario</Link>
          
          </div>
          <div className="flex-none">
            <div className="navbar-center flex">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <Link to="/Subastas">Subastas</Link>
                </li>
                <li>
                  <Link to="/">Cátalogo de productos</Link>
                </li>
                <li>
                  <Link to="/editar_catalogo">Editar cátalogo</Link>
                </li>
              </ul>
            </div>

            <Favorito />
            <Carrito />
            <div className="dropdown dropdown-end z-50">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={imagen} />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link className="justify-between" to="/perfil">
                      Perfil
                    </Link>
                  </li>
                  <li>
                    <Link className="justify-between" to="/reportes">
                      Reporte de ventas
                    </Link>
                  </li>
                  <li>
                    <Link className="justify-between" to="/compras">
                      Compras realizadas
                    </Link>
                  </li>
                  <li>
                    <a onClick={handleLogout}>Cerrar sesión</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full bg-base-200 flex flex-col items-center h-screen overflow-y-auto">
        {children}
      </main>
    </>
  );
};

export default AppLayout;

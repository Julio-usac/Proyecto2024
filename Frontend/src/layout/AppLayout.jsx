import { Link,useNavigate } from "react-router-dom";
import useAuth from "../auth/authStore";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

import { useEffect } from "react";


// eslint-disable-next-line react/prop-types
const AppLayout = ({ children }) => {

//---------------------------------------------------Retornar datos del usuario-----------------------------------------
  const { nombre,rol,logout,token,Revalidar } = useAuth((state) => state);
  

//---------------------------------------------------Funciones utilizadas-----------------------------------------
//Funcion para navegar a otros modulos
  const navigate = useNavigate();

//Funcion para cerrar sesion
  const handleLogout = () => {
    logout();
  };
//Funcion para Verificar Rol Administrador
  const VerificarRol= () => {
    if (rol == 1){
      navigate("/AdminUsuario");
    }else{
      toast.error("Necesita permisos de Administrador")
    }
    
  }

  //Funcion para Revalidar token
  
  useEffect(() => {
    axios.post("http://localhost:9095/Revalidar",{},{ headers: {
      'Authorization': token
    },})
        .then((resp) => {
          Revalidar(resp.data.token);
        })
        .catch((error) => {
          
          setTimeout(function(){toast.error("Se requiere volver a iniciar sesion");  }, 2000);
          logout();
        });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.post("http://localhost:9095/token", {
          token: token,
        
      })
        .then((resp) => {
          
        })
        .catch((error) => {
          
          setTimeout(function(){toast.error("Se requiere volver a iniciar sesion");  }, 2000);
          logout();
        });
    }, 600000); // 600000 milisegundos son 10 minutos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);


  // console.log('usuario', usuario);
  return (
    <>
      <header>
        <div className="navbar bg-base-100 z-50">
          <div className="flex-1">
          
          <Link to="/" className="btn btn-ghost normal-case text-4xl">Inventario</Link>
          
          </div>
          <div className="flex-none">
            <div className="navbar-center flex">
              <ul className="menu menu-horizontal px-1">
                
              </ul>
            </div>
           <h1 className="px-5 text-2xl">{nombre}</h1> 
          {/*
            <Favorito />
            <Carrito />*/
          }
         
            <div className="dropdown dropdown-end z-50">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-12 rounded-full">
                    <img src={'./src/assets/user.png'} />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link className="justify-between" to="/perfil">
                      Editar contraseña
                    </Link>
                  </li>
                  <li>
                    <a className="justify-between" onClick={VerificarRol}>
                      
                      Administrar usuarios
                    </a>
                  </li>
                  
                  <li>
                    <a onClick={handleLogout}>Cerrar sesión</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
        </div>
        <Toaster/>
      </header>

      <main className="w-full bg-base-200 flex flex-col items-center h-screen overflow-y-auto">
        {children}
      </main>
    </>
  );
};

export default AppLayout;

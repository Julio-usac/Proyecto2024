import { useAsync, useMountEffect } from "@react-hookz/web";
import AppLayout from "./layout/AppLayout";
import { Link } from "react-router-dom";
import axios from "axios";
import ModalAgregar from "./components/ModalAgregar";
import useCarrito from "./store/carritoStore";
import useFav from "./store/favStore";
import { useState } from "react";
import { useEffect } from "react";
import useAuth from "./auth/authStore";
import { FiUserCheck,FiShoppingBag, FiUsers,FiTrash2,FiSearch,FiInfo } from "react-icons/fi";

function App() {
  const setProductoSeleccionado = useCarrito(
    (state) => state.setProductoSeleccionado
  );
  const url = useAuth((state) => state.url);

  const agregarFav = useFav((state) => state.agregar);
  const setFav = useFav((state) => state.setProductoSeleccionado);

  const [showButton, setShowButton] = useState(Array(9999).fill(true));

  const toggleButton = (id) => {
    const updatedVisibility = [...showButton];
    updatedVisibility[id] = false;
    setShowButton(updatedVisibility);
  };


  // set the page data when the number of page changes, from the state.result

  return (
    <AppLayout>
      <div style={{ height: '50px' }} />
      <h1 className="text-5xl">Menu principal</h1>
      <div style={{ height: '60px' }} />
      <div className="grid grid-cols-3  gap-y-20 gap-x-20">
        
      <Link to="/BienUsuario" className=" flex flex-col items-center py-5 px-20 m-1 bg-gray-100 hover:bg-gray-400 
      text-black font-bold py-2 px-4 border border-gray-400 rounded-xl">
        <button className=" flex flex-col items-center ">
        
        <FiUsers  className="text-9xl"/>
        
        <span className=" text-3xl">Activos por usuario</span>
        </button>
      </Link>
      <Link to="/InBien" className=" flex flex-col items-center py-5 px-20 m-1 bg-gray-100 hover:bg-gray-400 
      text-black font-bold py-2 px-4 border border-gray-400 rounded-xl">
        <button className=" flex flex-col items-center">
        
        <FiShoppingBag  className="text-9xl"/>
        
        <span className=" text-3xl">Ingresar Activos</span>
        </button>
      </Link>
      <Link to="/Asbien" className=" flex flex-col items-center py-5 px-20 m-1 bg-gray-100 hover:bg-gray-400 
      text-black font-bold py-2 px-4 border border-gray-400 rounded-xl">
        <button className=" flex flex-col items-center">
        
        <FiUserCheck className="text-9xl"/>
        
        <span className=" text-3xl">Asignar activos</span>
        </button>
      </Link>
      <Link to="/busqueda" className=" flex flex-col items-center py-5 px-20 m-1 bg-gray-100 hover:bg-gray-400 
      text-black font-bold py-2 px-4 border border-gray-400 rounded-xl">
      <button className=" flex flex-col items-center ">
      
      <FiSearch  className="text-9xl"/>
      
      <span className=" text-3xl">Buscar Activos</span>
      </button>
      </Link>
      <Link to="/SinAsignar" className=" flex flex-col items-center py-5 px-20 m-1 bg-gray-100 hover:bg-gray-400 
      text-black font-bold py-2 px-4 border border-gray-400 rounded-xl">
      <button className=" flex flex-col items-center ">
      
      <FiTrash2  className="text-9xl"/>
      
      <span className=" text-3xl">Activos de baja</span>
      </button>
      </Link>
      <Link to="/Bitacora" className=" flex flex-col items-center py-5 px-20 m-1 bg-gray-100 hover:bg-gray-400 
      text-black font-bold py-2 px-4 border border-gray-400 rounded-xl">
      <button className=" flex flex-col items-center">
      
      <FiInfo  className="text-9xl"/>
      
      <span className=" text-3xl">Bitacora</span>
      </button>
      </Link>


</div>
    </AppLayout>
  );
}

export default App;

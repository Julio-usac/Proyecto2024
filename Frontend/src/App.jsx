import { useAsync, useMountEffect } from "@react-hookz/web";
import AppLayout from "./layout/AppLayout";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import ModalAgregar from "./components/ModalAgregar";
import useCarrito from "./store/carritoStore";
import useFav from "./store/favStore";
import { useState } from "react";
import { useEffect } from "react";
import useAuth from "./auth/authStore";
import { FiUserCheck,FiShoppingBag, FiUsers,FiTrash2,FiSearch,FiInfo } from "react-icons/fi";
import toast, { Toaster } from 'react-hot-toast';

function App() {

  const { rol } = useAuth((state) => state);
  const navigate = useNavigate();

 

  const VerificarRol1= () => {
    if (rol != 3){
      navigate("/Asbien");
    }else{
      toast.error("No cuenta con los permisos para esta operacion")
    }
    
  }

  const VerificarRol2= () => {
    if (rol != 3){
      navigate("/InBien");
    }else{
      toast.error("No cuenta con los permisos para ingresar a este modulo")
    }
    
  }




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
      <a  className=" flex flex-col items-center py-5 px-20 m-1 bg-gray-100 hover:bg-gray-400 
      text-black font-bold py-2 px-4 border border-gray-400 rounded-xl" onClick={VerificarRol2}>
        <button className=" flex flex-col items-center">
        
        <FiShoppingBag  className="text-9xl"/>
        
        <span className=" text-3xl">Ingresar Activos</span>
        </button>
      </a>
      <a className=" flex flex-col items-center py-5 px-20 m-1 bg-gray-100 hover:bg-gray-400 
      text-black font-bold py-2 px-4 border border-gray-400 rounded-xl" onClick={VerificarRol1}>
        <button className=" flex flex-col items-center">
        
        <FiUserCheck className="text-9xl"/>
        
        <span className=" text-3xl">Asignar activos</span>
        </button>
      </a>
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
    <Toaster/>
    </AppLayout>
  );
}

export default App;

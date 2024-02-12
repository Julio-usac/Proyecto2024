import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

import useAuth from "../auth/authStore";
import useEmpleado from '../store/empleadoStore';

const ModelEditarEmpleado = () => {

  //--------------------------------------------Declaracion de estados-----------------------------------------
  
  const [Roles, setRoles] = useState([]);
  const userid = useEmpleado((state) => state.id);
  const usernombre = useEmpleado((state) => state.nombres);
  const userapellido = useEmpleado((state) => state.apellidos);
  const userdpi = useEmpleado((state) => state.dpi);
  const usernit = useEmpleado((state) => state.nit);
  const userpuesto = useEmpleado((state) => state.puesto);

//--------------------------------------------Retornar datos del usuario-----------------------------------------
 
  const { id } = useAuth((state) => state);
  const { token,logout} = useAuth((state) => state);
  const url = useAuth((state) => state.url);

 

//----------------------------------Declaracion de datos a enviar en el formulario-------------------------------
 
  const { register, handleSubmit,reset} = useForm({
    defaultValues: {
      nombres: null,
      apellidos: null,
      dpi: null,
      nit: null,
      puesto: null,
    },
  });

   //-------------------------------------------Funciones utilizadas----------------------------------------


  //Funcion utilizada para obtener los roles de los usuarios

  useEffect(() => {
    const load = async () => {
      let result = await fetch(url+"/ObtenerRoles");
      result = await result.json();
      setRoles(result.message)
    };
    load();
  },[]);

  //Funcion utilizada para enviar los datos del formulario al endpoint CrearUsuario
  const onSubmit = async (data) => {
    if(data.nombres || data.apellidos || data.dpi || data.nit || data.puesto){
      try {
        const resp = await axios({
          url: url+"/EditarEmpleado",
          method: "put",
          data: {
            id: userid,
            nombres: (data.nombres)?data.nombres:usernombre,
            apellidos: (data.apellidos)?data.apellidos:userapellido,
            dpi: (data.dpi)?data.dpi:userdpi,
            nit: (data.nit)?data.nit:usernit,
            puesto: (data.puesto)?data.puesto:userpuesto,
          },
          headers: {
            'Authorization': token
          },
          
        });
        
        if (resp.data.success === true) {
          toast.success("Registro exitoso")

          //Si la creacion es exitosa, se registra la operacion en la bitacora
          
          try {
            await axios({
              url: "http://localhost:9095/IngresarBitacora",
              method: "post",
              data: {
                usuario: id,
                empleado: userid,
                bienaf: null,
                tipo: 2,
                afectado:false,
              },
            });
          } catch (error) {
            console.log(error)
          }
          window.my_modal_6.close();
          setTimeout(function(){ window.location.reload(); }, 1000);
        }else{
          toast.error(resp.data.message);
        }
      } catch (error) {
        if ('token' in error.response.data){
          logout();
        }else{
          
          toast.error(error.response.data.message);
        }
      }
    }else{
      toast.error("Debe realizar un cambio para actualizar");
    }
  };

  //----------------------------------------------HTML-----------------------------------------------------
  return (
    <dialog id="my_modal_6" className="modal">
   <div className="card  bg-base-100 shadow-xl max-w-screen-2xl lg:h-fit">
        <div className="card w-[500px] bg-base-100 shadow-xl  lg:h-fit">
          
        <div className="flex justify-end mt-3 px-3">
          <button
                        className="flex bg-red-500 text-white px-4 py-2 rounded w-fit"
                        onClick={(e) => {
                          e.preventDefault()
                          reset();
                          window.my_modal_6.close();
                        }}
                    >
                        X
                    </button>
        </div>
         
          <div className="card-body p-1 w-full flex flex-col">


            <div>
           
              <h2 className="card-title font-bold text-4xl text-black justify-center">
          
                Registrar Empleado

              </h2>
              <div className="divider my-1 mt-2"></div>
            </div>
            
            <div className="container mx-auto">
             
            
                <div className="flex items-center justify-center">
                  
                
                    <div className="flex flex-col -mx-1 mb-11">
                      
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <h3 className="mt-10 font-bold">Nombres</h3>
                      
                      <input className="appearance-none block w-72 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      type="text" placeholder={usernombre} {...register("nombres", { required: false })} />
                      

                      <h3 className="mt-2 font-bold">Apellidos</h3>
                      
                      <input className="appearance-none block w-72 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      type="text" placeholder={userapellido} {...register("apellidos", { required: false })} />
                      

                      <h3 className="mt-2 font-bold">DPI</h3>
                      <input className="appearance-none block w-72 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      type="text" placeholder={userdpi} {...register("dpi", { required: false })} />

                      <h3 className="mt-2 font-bold">NIT</h3>
                      <input className="appearance-none block w-72 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      type="text" placeholder={usernit} {...register("nit", { required: false })} />

                      <h3 className="mt-2 font-bold">Puesto</h3>
                      <input className="appearance-none block w-72 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      type="text" placeholder={userpuesto} {...register("puesto", { required: false })} />

                      
                    
                      <div className="flex justify-center">
                      
                        <button className="btn bg-blue-500 text-white w-fit mt-10 "  type="submit">
                          Editar Empleado
                        </button>
                      </div>
                      
                </form> 
                    </div>
                    
                </div>
              
              
            </div>
        </div>
      </div>
    </div>
    <Toaster />
    </dialog>
  );
};

export default ModelEditarEmpleado;

import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

import useAuth from "../auth/authStore";

const ModelCrearUsuario = () => {

  //--------------------------------------------Declaracion de estados-----------------------------------------
  
  const [Roles, setRoles] = useState([]);

//--------------------------------------------Retornar datos del usuario-----------------------------------------
 
  const { id } = useAuth((state) => state);
  const { token,logout} = useAuth((state) => state);
  const url = useAuth((state) => state.url);

 

//----------------------------------Declaracion de datos a enviar en el formulario-------------------------------
 
  const { register, handleSubmit} = useForm({
    defaultValues: {
      nombres: null,
      apellidos: null,
      correo: null,
      rol: null,
    },
  });

   //-------------------------------------------Funciones utilizadas----------------------------------------


  //Funcion utilizada para obtener los roles de los usuario

  useEffect(() => {
    const load = async () => {
      let result = await fetch(url+"/ObtenerRoles",{headers: {
        'Authorization': token
      },});
      result = await result.json();
      setRoles(result.message)
    };
    load();
  },[]);

  //Funcion utilizada para enviar los datos del formulario al endpoint CrearUsuario
  const onSubmit = async (data) => {
  
    if(data.rol && data.rol != "Seleccionar"){
      try {
        const resp = await axios({
          url: url+"/CrearUsuario",
          method: "post",
          data: {
            nombres: data.nombres,
            apellidos: data.apellidos,
            rol: data.rol,
            correo: data.correo,
          },
          headers: {
            'Authorization': token
          },
          
        });
        
        if (resp.data.success === true) {
          toast.success("Registro exitoso")

         
          window.my_modal_3.close();
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
    toast.error("Debe elegir un rol");
  }
  };

  //----------------------------------------------HTML-----------------------------------------------------
  return (
    <dialog id="my_modal_3" className="modal">
   <div className="card  bg-base-100 shadow-xl max-w-screen-2xl lg:h-fit">
        <div className="card w-[500px] bg-base-100 shadow-xl  lg:h-fit">
          
        <div className="flex justify-end mt-3 px-3">
          <button
                        className="flex bg-red-500 text-white px-4 py-2 rounded w-fit"
                        onClick={(e) => {
                          e.preventDefault()
                            window.my_modal_3.close();
                        }}
                    >
                        X
                    </button>
        </div>
         
          <div className="card-body p-1 w-full flex flex-col">


            <div>
           
              <h2 className="card-title font-bold text-4xl text-black justify-center">
          
                Crear Usuario

              </h2>
              <div className="divider my-1 mt-2"></div>
            </div>
            
            <div className="container mx-auto">
             
            
                <div className="flex items-center justify-center">
                  
                
                    <div className="flex flex-col -mx-1 mb-11">
                      
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <h3 className="mt-10 font-semibold">Nombres</h3>
                      
                      <input className="appearance-none block w-72 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                        required type="text" {...register("nombres", { required: true })} />
                      

                      <h3 className="mt-2 font-semibold">Apellidos</h3>
                      
                      <input className="appearance-none block w-72 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      required type="text" {...register("apellidos", { required: true })} />
                      

                      <h3 className="mt-2 font-semibold">Correo (nombre de usuario)</h3>
                      <input className="appearance-none block w-72 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      required type="text" {...register("correo", { required: true })} />

                      <h3 className="mt-2 font-semibold">Rol</h3>
                      <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      defaultValue={null} {...register("rol", { required: false })}>
                        <option value={null} >Seleccionar</option>
                        {
                          Roles.map((item)=>
                            
                            <option key={item.rolId} value={item.rolId} >{item.rol}</option>
                          )
                        }
                        </select>
                      <div className="flex justify-center">
                      
                        <button className="btn bg-blue-500 text-white w-fit mt-10 "  type="submit">
                          Crear usuario
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

export default ModelCrearUsuario;

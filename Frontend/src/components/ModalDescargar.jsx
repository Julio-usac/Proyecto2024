import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import useUrl from '../store/urlStore';
import useAuth from "../auth/authStore";


const ModelDescargar = () => {
    
//--------------------------------------------Declaracion de estados-----------------------------------------

  const [fecha, setFecha] = useState('');
  const [fecha2, setFecha2] = useState('');
//--------------------------------------------Retornar url-----------------------------------------

const url = useAuth((state) => state.url);

//--------------------------------------------Retornar ID del usuario-----------------------------------------
  
  const  userid  = useAuth((state) => state.id);
  const  endpointName = useUrl((state) => state.url);
  const { token} = useAuth((state) => state);

//-------------------------------------Llamadas a endpoints que se ejecutaran al ingresar al modulo-----------------------------------------
 

 //-------------------------------------------Funciones utilizadas----------------------------------------

  //Funcion utilizada para guardar la fecha inicial

  const CambiarFecha = (evento) => {
    setFecha(evento.target.value);
  }

  //Funcion utilizada para guardar la fecha final

  const CambiarFecha2 = (evento) => {
    setFecha2(evento.target.value);
  }
//-------------------------------------Funcion enviar los datos del formulario-----------------------------------------
 
  const Descargar = async () => {
    if(fecha && fecha2){
      try {
        const response = await axios.get(url+endpointName, { 
        responseType: 'blob',
        params: {
          fecha1: fecha,
          fecha2: fecha2,
          usuario: userid
        },
        headers: {
          'Authorization': token
        },});

        const url2 = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url2;
        link.setAttribute('download', 'Descarga.xlsx'); 
        document.body.appendChild(link);
        link.click();

      } catch (error) {
        console.error('Error al descargar el archivo');
      }
    }else{
      toast.error('Debe seleccionar un rango de fechas');
    }
  };
//-------------------------------------------------------HTML---------------------------------------------------------
 
  return (
    <dialog id="my_modal_8" className="modal">
   <div className="card  bg-base-100 shadow-xl max-w-screen-2xl lg:h-fit">
        <div className="card w-[500px] bg-base-100 shadow-xl  lg:h-fit">
          
        <div className="flex justify-end mt-3 px-3">
          <button
                        className="flex bg-red-500 text-white px-4 py-2 rounded w-fit"
                        onClick={(e) => {
                          e.preventDefault()
                          window.my_modal_8.close();
                        }}
                    >
                        X
                    </button>
        </div>
         
          <div className="card-body p-1 w-full flex flex-col">


            <div>
           
              <h2 className="card-title font-bold text-4xl text-black justify-center">
          
                Descargar Reporte 

              </h2>
              <div className="divider my-1 mt-2"></div>
            </div>
            
            <div className="container mx-auto">
             
            
                <div className="flex items-center justify-center">
                  
                
                    <div className="flex flex-col -mx-1 mb-11">
                      
                    
                      <h1 className="mt-10 px-4 mb-5 font-semibold text-xl">Ingresar rango de fechas</h1>
                      <div className="py-4 pt-2 flex justify-between items-center">
  
        <div className="flex  items-center" >


        <span className="mx-4 text-gray-500">De</span>
          <input className="appearance-none block w-fit ring-2 bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" 
            type="date" onChange={CambiarFecha} />

            <span className="mx-4 text-gray-500">a</span>

          <input className="appearance-none block w-fit ring-2 bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" 
            type="date" onChange={CambiarFecha2} />

          <span className="mx-4 text-gray-500"></span>
        </div>
          
          </div>
                     
                      <div className="flex justify-center">
                      
                        <button className="btn bg-blue-500 text-white w-fit mt-10 "  onClick={ Descargar}>
                          Aceptar
                        </button>
                      </div>
                      
                
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

export default ModelDescargar;

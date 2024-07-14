import { useAsync, useMountEffect } from "@react-hookz/web";
import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

import ModalDescargar from "../../components/ModalDescargar";
import ModalDescargarMarca from "../../components/ModalDescargarMarca";

import useUrl from '../../store/urlStore';
import useAuth from "../../auth/authStore";

function Reporte() {
 
  const url2 = useAuth((state) => state.url);
  
  const { token} = useAuth((state) => state);


  const seturl = useUrl((state) => state.setUrl);


//Funcion para descargar el reporte de bienes activos
const Descargar = async() => {
  await seturl("/DescargarBienesActivos")
  window.my_modal_8.showModal();
};

//Funcion para descargar el reporte de bienes fungibles
const Descargar2 = async() => {
  await seturl("/DescargarBienesFungibles")
  window.my_modal_8.showModal();
};

//Funcion para descargar el reporte de bienes fungibles
const Descargar3 = async() => {
  await seturl("/DescargarBienesMarca")
  window.my_modal_9.showModal();
};

//Funcion para descargar el reporte por ubicacion
/*
const Descargar2 = async() => {
  try {
    const response = await axios.get(url2+'/DescargarBienesUbicacion/', { responseType: 'blob',
    headers: {
      'Authorization': token
      }, });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Descarga.xlsx'); // o el nombre de archivo que desees
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Hubo un error al descargar el archivo: ', error);
  }
};
*/
//Funcion para descargar el reporte de tarjetas por usuario
/*
const Descargar3 = async() => {
  try {
    const response = await axios.get(url2+'/DescargarUsuariosTarjetas/', { responseType: 'blob',
    headers: {
      'Authorization': token
      }, });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Descarga.xlsx'); // o el nombre de archivo que desees
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error('Hubo un error al descargar el archivo: ', error);
  }
};
 */

  return (
    <AppLayout>
   <ModalDescargar />
   <ModalDescargarMarca />
   <div className="bg-base-300 w-full h-[90vh] flex justify-center items-center">
        <div className="card w-[500px] bg-base-100 shadow-xl  lg:h-fit">
          
          <div className="card-body  p-20 w-full flex flex-col justify-right">
            <div>
              <h2 className="card-title font-bold text-4xl text-black justify-center">
          
                Reportes
              </h2>
              <div className="divider my-1 mt-2"></div>
            </div>
            <div className="container mx-auto mt-5">
                       
                <div className="flex items-center justify-center">
                  
                  
                    <div className="flex flex-col -mx-1 mb-11 justify-center">
                    
                      
                    <div className="card-body p-1 w-full flex flex-col">
                    
                      <div className="flex justify-center">
                        <h3 className="font-bold">INVENTARIO GENERAL DE BIENES ACTIVOS</h3>
                      </div>
                      
                      <div className="flex justify-center">
                        <button
                          className="btn bg-blue-500 text-white w-fit mt-2"
                          onClick={ Descargar}
                        >
                          Descargar reporte
                        </button>
                      </div>

                      <div className="flex justify-center mt-6">
                        <h3  className="font-bold -mx-5"> INVENTARIO GENERAL DE BIENES FUNGIBLES</h3>
                      </div>

                      <div className="flex justify-center">
                        <button
                          className="btn bg-blue-500 text-white w-fit mt-2"
                          onClick={ Descargar2}
                        >
                          Descargar reporte
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <h3  className="mt-6 font-bold"> INVENTARIO DE BIENES POR MARCA</h3>
                      </div>
                      <div className="flex justify-center">
                        <button
                          className="btn bg-blue-500 text-white w-fit mt-2"
                          onClick={ Descargar3}
                        >
                          Descargar reporte
                        </button>
                      </div>
                    </div>
                    
                    </div>
                  
                </div>
              
              
            </div>
        </div>
      </div>
    </div>
    <Toaster />
    </AppLayout>
  );
}

export default Reporte;

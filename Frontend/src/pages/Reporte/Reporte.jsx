import { useAsync, useMountEffect } from "@react-hookz/web";
import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

function Reporte() {
 

//Funcion para descargar el reporte por usuario
const Descargar = async() => {
  try {
    const response = await axios.get('http://localhost:9095/DescargarBienesUsuario/', { responseType: 'blob' });
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

//Funcion para descargar el reporte por ubicacion
const Descargar2 = async() => {
  try {
    const response = await axios.get('http://localhost:9095/DescargarBienesUbicacion/', { responseType: 'blob' });
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

//Funcion para descargar el reporte de tarjetas por usuario
const Descargar3 = async() => {
  try {
    const response = await axios.get('http://localhost:9095/DescargarUsuariosTarjetas/', { responseType: 'blob' });
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
 

  return (
    <AppLayout>
   
   <div className="bg-base-300 w-full h-[90vh] flex justify-center items-center">
        <div className="card w-[500px] bg-base-100 shadow-xl  lg:h-fit">
          
          <div className="card-body  p-20 w-full flex flex-col justify-right">
            <div>
              <h2 className="card-title font-bold text-4xl text-black justify-center">
          
                Reportes
              </h2>
              <div className="divider my-1 mt-2"></div>
            </div>
            <div className="container mx-auto">
                       
                <div className="flex items-center justify-center">
                  
                  
                    <div className="flex flex-col -mx-1 mb-11">
                    
                      
                    <div className="w-fit mt-6">
                      <h3 className="font-bold">Numero total de bienes por usuario</h3>
                      <button
                        className="btn btn-success w-fi mt-2"
                        onClick={ Descargar}
                      >
                        Descargar reporte
                      </button>

                      <h3  className="mt-6 font-bold"> Numero total de bienes por ubicacion</h3>
                      <button
                        className="btn btn-success w-fit mt-2"
                        onClick={ Descargar2}
                      >
                        Descargar reporte
                      </button>

                      <h3  className="mt-6 font-bold"> Numero total de tarjetas por usuario</h3>
                      <button
                        className="btn btn-success w-fit mt-2"
                        onClick={ Descargar3}
                      >
                        Descargar reporte
                      </button>
                    </div>
                    <div className="flex justify-center">
                    
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

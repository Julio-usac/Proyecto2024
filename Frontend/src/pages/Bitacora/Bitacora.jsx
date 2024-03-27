import { useAsync, useMountEffect } from "@react-hookz/web";
import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import useAuth from "../../auth/authStore";

function Bitacora() {

  //-----------------------------------------Declaracion de estados----------------------------------------

  const [usuarios, setUsuarios] = useState([]);
  const [fecha, setFecha] = useState('');
  const [fecha2, setFecha2] = useState('');
  const url = useAuth((state) => state.url);

  const { token} = useAuth((state) => state);

  //-------------------------------------------Funciones utilizadas----------------------------------------

  //Funcion utilizada para guardar la fecha inicial

  const CambiarFecha = (evento) => {
    setFecha(evento.target.value);
  }

  //Funcion utilizada para guardar la fecha final

  const CambiarFecha2 = (evento) => {
    setFecha2(evento.target.value);
  }

 //Funcion utilizada para llamar al endpoint DescargarBitacora y descargar la bitacora

  const Descargar = async() => {
    try {
      const response = await axios.get(url+'/DescargarBitacora/', { responseType: 'blob', headers: {
        'Authorization': token
      },});
      const url2 = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url2;
      link.setAttribute('download', 'Descarga.xlsx'); 
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Hubo un error al descargar el archivo');
    }
  };
  

  //Funcion utilizada para obtener la bitacora segun la fecha.

  const ObtenerBitacora= async() => {
    if(fecha && fecha2){
      try {
        const response = await axios.get(url+'/ObtenerBitacora/', { params: {
          fecha1: fecha,
          fecha2: fecha2
        },
        headers: {
          'Authorization': token
        },  });
        setUsuarios(response.data.message);
      } catch (error) {
        console.error('Hubo un error al retornar la informacion');
      }
    }else{
      toast.error('Debe seleccionar un rango de fechas');
    }
  };

  //HTML

  return (
    <AppLayout>
      <h1 className="text-5xl mt-6">Bitacora</h1>

      <div className="w-full max-w-screen-xl px-4 xl:p-0 flex flex-col justify-center">

        <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 text-xl dark:text-black mt-6">Seleccione un rango de fechas</label>
        <div className="py-4 pt-2 flex justify-between items-center">
  
        <div className="flex  items-center" >
          <input className="appearance-none block w-fit ring-2 bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" 
            type="date" onChange={CambiarFecha} />

            <span className="mx-4 text-gray-500">a</span>

          <input className="appearance-none block w-fit ring-2 bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white" 
            type="date" onChange={CambiarFecha2} />

           <button  className="text-white ml-6 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={ObtenerBitacora}>Buscar</button>
        </div>
          <button
                className="btn btn-success w-fit"
                onClick={ Descargar}
              >
                Descargar Bitacora
              </button>
          </div>
          <div style={{ height: '30px' }} />

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg  overflow-y-auto h-4/6">
              <table className="table table-sm table-pin-rows table-pin-cols w-full text-sm text-left text-gray-500 dark:text-gray-900">
                  <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                      <tr>
                          <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                              Fecha
                          </th>
                          <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                              Hora
                          </th>
                          <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                              Usuario
                          </th>
                          <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                              Movimiento
                          </th>
                          <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                              Objetivo
                          </th>
                          <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                              NIT/B.Codigo
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                          usuarios.map((item)=>
                              <tr key={item.id} className="bg-white border-b dark:bg-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-400">
                                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black">
                                      { new Date (item.fecha).toLocaleDateString()}
                                  </th>
                                  <td className="px-6 py-4 "> {item.hora}</td>
                                  <td className="px-6 py-4 "> {item.usuario}</td>
                                  <td className="px-6 py-4 "> {item.movimiento}</td>
                                  <td className="px-6 py-4 "> {(item.objetivo==0)?"Empleado":"Bien"}</td>
                                  <td className="px-6 py-4 "> {(item.nit)?item.nit:item.bien}</td>
                              </tr>
                          )
                      }
                  </tbody>
              </table>
              
          </div>
        </div>
      </div>
      <Toaster />
    </AppLayout>
  );
}

export default Bitacora;

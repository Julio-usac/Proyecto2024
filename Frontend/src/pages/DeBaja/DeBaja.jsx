import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import { useEffect } from "react";

function DeBaja() {

  const [bien, setBien] = useState([]);


  //Obtener bienes de baja
  useEffect(() => {
    
      axios.get('http://localhost:9095/DadosdeBaja')
      .then((resp) => {

      setBien(resp.data.message);

      })
      .catch((error) => {

        console.error('Hubo un error al retornar los bienes: ', error);

      });

  },[]);


  //Funcion para volver a activar el bien.

  const DarBaja = (e) => {
    
    const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (confirmacion) {
      axios.delete('http://localhost:9095/DardeBaja/'+e)
      .then(response => {
        toast.success(response.data.message);
        setTimeout(function(){ window.location.reload(); }, 1000);
      })
      .catch(error => {
        console.log(error.error);
        toast.error(error.message);
      });
    }

  }

  return (
    <AppLayout>
      <h1 className="text-5xl mt-6"> Bienes de baja</h1>

      <div className="w-full max-w-screen-xl px-4 xl:p-0 flex flex-col justify-center">

        <div>
        <div className="py-4 pt-2 flex justify-between items-center">
  
          <button
                className="btn btn-success w-fit"
              >
                Descargar Reporte
              </button>
          </div>
          <div style={{ height: '30px' }} />

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg  overflow-y-auto h-4/6">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-900">
                  <thead className="text-xm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                      <tr>
                          <th scope="col" className="px-6 py-3">
                              Fecha ultima operacion
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Ultimo usuario
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Codigo
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Marca
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Modelo
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Serie
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Descripcion
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Saldo
                          </th>
                          <th scope="col" className="px-6 py-3">
                              <span className="sr-only">Dar de baja</span>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                          bien.map((item)=>
                              <tr key={item.id} className="bg-white border-b dark:bg-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-400">
                                  <th scope="row" className="px-6 py-4 font-medium text-xm text-gray-900 whitespace-nowrap dark:text-black">
                                      { new Date(item.fecha).toLocaleDateString()}
                                  </th>
                                  <td className="px-6 py-4"> {item.usuario}</td>
                                  <td className="px-6 py-4"> {item.codigo}</td>
                                  <td className="px-6 py-4"> {item.marca}</td>
                                  <td className="px-6 py-4"> {item.modelo}</td>
                                  <td className="px-6 py-4"> {item.serie}</td>
                                  <td className="px-6 py-4"> {item.descripcion}</td>
                                  <td className="px-6 py-4"> {item.precio}</td>
                                  
                                  <td className="px-6 py-4 text-right">
                                        
                                    <button  onClick={() => {DarBaja(item.id);}} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Restaurar</button>
                                  </td>
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

export default DeBaja;

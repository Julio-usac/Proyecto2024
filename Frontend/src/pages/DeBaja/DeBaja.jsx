import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import { useEffect } from "react";

import useAuth from "../../auth/authStore";

function DeBaja() {

  //--------------------------------------------Declaracion de estados-----------------------------------------


  const [bien, setBien] = useState([]);
  const [Opcion, setOpcion] = useState(0);
  const [Buscar, setBuscar] = useState('');

  const { token,logout} = useAuth((state) => state);
    //----------------------------Funciones para manejar cambios de estado -------------------------

  //Funcion para manejar el cambio de estado de las elecciones de busqueda
  const handleChange = (event) => {
    setOpcion(event.target.value);
  };
  //Funcion para manejar el cambio de estado de la busqueda.
  const handleChange2 = (event) => {
    setBuscar(event.target.value);
  };

  //--------------------------------------- Funciones utilizadas -----------------------------------------

  //Funcion para buscar los bienes dados de baja
  const Busqueda = async() => {
    if (Opcion!=0 && Buscar!=''){
        try {
        const response = await axios.get('http://localhost:9095/DadosdeBaja/', { params: {
            opcion: Opcion,
            buscar: Buscar
        }  });
        console.log(response.data)
        if(response.data.success==true){
            setBien(response.data.message)
        }

        } catch (error) {
        toast.error("Error al buscar");
        console.error('Error en el endpoint de busqueda', error);
        }
    }
  }


  //Funcion para volver a activar el bien.

  const Restaurar= (e) => {
    
    const confirmacion = window.confirm('¿Estás seguro de que quieres restaurar este producto?');
    if (confirmacion) {
      axios.put('http://localhost:9095/RestaurarBien/'+e,{ headers: {
        'Authorization': token
      },})
      .then(response => {
        toast.success(response.data.message);
        setTimeout(function(){ window.location.reload(); }, 1000);
      })
      .catch(error => {
        if ('token' in error.response.data){
          logout();
        }else{
          toast.error(error.response.data.message);
        }
      });
    }

  }


 //Funcion para descargar todos los bienes dadosd de baja
  const Descargar = async() => {
    try {
      const response = await axios.get('http://localhost:9095/DescargarBienesBaja/', { responseType: 'blob'  });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Descarga.xlsx'); 
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Hubo un error al descargar el archivo: ', error);
    }
  };
//----------------------------------------------------HTML---------------------------------------------
  return (
    <AppLayout>
      <h1 className="text-5xl mt-6"> Bienes de baja</h1>

      <div className="w-full max-w-screen-xl px-4 xl:p-0 flex flex-col justify-center mt-6">
      <div className="flex justify-end">
            <button
                    className="btn btn-success w-fit "
                    onClick={ Descargar}
                    >
                    Descargar reporte
            </button>
        </div>
            <div className="flex items-center">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative" >
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search"  className="block w-full p-4 pl-10 px-40  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Buscar ..." onChange={handleChange2}/>
                    <button  className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="submit" onClick={Busqueda}  >Buscar</button>
                </div>
                <input type="radio" name="radio" id="radio1" className="ml-6 mr-5" value={1} onChange={handleChange}/>
                <label htmlFor="checkbox1">Codigo</label>
                <input type="radio" name="radio" id="radio2" className="ml-6 mr-5" value={2} onChange={handleChange}/>
                <label htmlFor="checkbox1">Marca</label>
                <input type="radio" name="radio" id="radio3" className="ml-6 mr-5" value={3} onChange={handleChange}/>
                <label htmlFor="checkbox1">Modelo</label>
                <input type="radio" name="radio" id="radio3" className="ml-6 mr-5" value={4} onChange={handleChange}/>
                <label htmlFor="checkbox1">Serie</label>
                <input type="radio" name="radio" id="radio3" className="ml-6 mr-5" value={5} onChange={handleChange}/>
                <label htmlFor="checkbox1">Descripcion</label>

            </div>

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg  overflow-y-auto h-96 mt-6">
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
                                      {item.fecha}
                                  </th>
                                  <td className="px-6 py-4"> {item.usuario}</td>
                                  <td className="px-6 py-4"> {item.codigo}</td>
                                  <td className="px-6 py-4"> {item.marca}</td>
                                  <td className="px-6 py-4"> {item.modelo}</td>
                                  <td className="px-6 py-4"> {item.serie}</td>
                                  <td className="px-6 py-4"> {item.descripcion}</td>
                                  <td className="px-6 py-4"> {item.precio}</td>
                                  
                                  <td className="px-6 py-4 text-right">
                                        
                                    <button  onClick={() => {Restaurar(item.id);}} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Restaurar</button>
                                  </td>
                              </tr>
                          )
                      }
                  </tbody>
              </table>
              
          </div>

        
      </div>
      <Toaster />
    </AppLayout>
  );
}

export default DeBaja;

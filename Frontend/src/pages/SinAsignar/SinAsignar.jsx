import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import useAuth from "../../auth/authStore";

function SinAsignar() {

//-------------------------------------------------Declaracion de estados------------------------------------------

  const [bien, setBien] = useState([]);

  const  userid  = useAuth((state) => state.id);

  const { token,logout} = useAuth((state) => state);
  const url = useAuth((state) => state.url);

  const [retornar, setRetornar] = useState([]);

//-----------------------------------------------Funciones utilizadas----------------------------------------------

  //Obtener bienes sin asignar
  useEffect(() => {
    
      axios.get(url+'/SinAsignar', {headers: {
        'Authorization': token
      },})
      .then((resp) => {

        setBien(resp.data.message);
        setRetornar("");
      })
      .catch((error) => {

        console.error('Hubo un error al retornar los bienes: ', error);

      });

  },[retornar]);


  //Funcion para dar bienes de baja.

  const DarBaja = (e) => {
    
    const confirmacion = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
    if (confirmacion) {
      axios.delete(url+'/DardeBaja/'+e,{ headers: {
        'Authorization': token
      },})
      .then(async response => {
        try {
          await axios({
            url: url+"/IngresarBitacora",
            method: "post",
            data: {
              usuario: userid,
              empleado: null,
              bienaf: e,
              tipo: 3,
              afectado: true,
            },
            headers: {
              'Authorization': token
            },
          });
        } catch (error) {
          console.log(error)
        }
        toast.success(response.data.message);
        setRetornar("actualizar");
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

  return (
    <AppLayout>
      <h1 className="text-5xl mt-6"> Bienes sin asignar</h1>

      <div className="w-full max-w-screen-xl px-4 xl:p-0 flex flex-col justify-center">

        <div>
        <div className="py-4 pt-2 flex justify-between items-center">

        <Link to="/DeBaja">
          <button
                className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-700 text-white font-bold w-fit"
              >
                Bienes de baja
              </button>
              </Link>
          </div>
          <div style={{ height: '30px' }} />

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg  overflow-y-auto h-[560px]">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-900">
                  <thead className="text-xm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                      <tr>
                          <th scope="col" className="px-6 py-3">
                              Fecha compra
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
                              saldo
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
                                      {(item.fechaco)?new Date(item.fechaco).toLocaleDateString():"No ingresado"}
                                  </th>
                                  <td className="px-6 py-4"> {item.codigo}</td>
                                  <td className="px-6 py-4"> {item.marca}</td>
                                  <td className="px-6 py-4"> {item.modelo}</td>
                                  <td className="px-6 py-4"> {item.serie}</td>
                                  <td className="px-6 py-4"> {item.descripcion}</td>
                                  <td className="px-6 py-4"> {item.precio}</td>
                                  
                                  <td className="px-6 py-4 text-right">
                                        
                                    <button  onClick={() => {DarBaja(item.id);}} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Eliminar</button>
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

export default SinAsignar;

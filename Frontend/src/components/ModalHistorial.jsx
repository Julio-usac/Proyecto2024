import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import useAuth from "../auth/authStore";
import useEmpleado from '../store/empleadoStore';
import DataTable from 'datatables.net-dt';

import $ from "jquery";

const ModelHistorial = () => {

    //--------------------------------------------Retornar datos del usuario-----------------------------------------
    
    const [bien, setBien] = useState([]);  
    const { token,logout} = useAuth((state) => state);
    const url = useAuth((state) => state.url);
    const {borrarDatos}= useEmpleado((state) => state);


    
  const empleadoid = useEmpleado((state) => state.id);
    
//-----------------------------------------------Funciones utilizadas----------------------------------------------

  //Obtener bienes sin asignar
  useEffect(() => {
    
    axios.get(url+'/HistorialEmpleado',{ headers: {
      'Authorization': token
    }, params: {
      empleado: empleadoid
    } })
    .then((resp) => {
      
    setBien(resp.data.message);

    if ( $.fn.dataTable.isDataTable('#myTable3') ) {
      let table=$('#myTable3').DataTable();
      table.destroy();
    }
    setTimeout(function(){
                
      if ( $.fn.dataTable.isDataTable('#myTable3') ) {
       
      }else{
        new DataTable('#myTable3',{
          
        });
        const searchInput = document.querySelector('#myTable3_filter input');
        const searchlabel = document.querySelector('#myTable3_filter label');
        
        
        // Aplica las clases de Tailwind al label
        searchlabel.classList.add(
            'font-bold',
            'text-xl'
        );
        

        // Aplica las clases de Tailwind al cuadro de búsqueda
        searchInput.classList.add(
            'font-normal',
            'border-2',
            'py-1',
            'mt-2',
            'mb-3',
            'mx-2',
            'input-primary',
            'border-black-400',
            'focus:outline-none',
            'focus:border-blue-500'
        );
      }
    }, 1000);

    })
    .catch((error) => {
      if ('token' in error.response.data){
        logout();
      }else{
        console.error('Hubo un error al retornar el personal');
      }
      

    });

},[]);





    //-------------------------------------------------------HTML---------------------------------------------------------
 
    return (
        <dialog id="my_modal_7" className="modal">
        <div className="card  bg-base-100 shadow-xl max-w-screen-2xl lg:h-fit">
        <div className="flex justify-end mt-3 px-3">
          <button
                        className="flex bg-red-500 text-white px-4 py-2 rounded w-fit"
                        onClick={async (e) => {
                            e.preventDefault();
                            //const searchInput = document.querySelector('#myTable3_filter input');
                            //searchInput.value="";
                            borrarDatos();
                            window.my_modal_7.close();
                            window.location.reload();
                        }}
                    >
                        X
                    </button>
        </div>
        <h1 className="flex text-5xl justify-center mt-6"> Historial de Bienes Asignados</h1>
        <div className="divider my-1 mt-2"></div>
    <div className=" max-w-screen-xl px-4 xl:p-0 flex flex-col justify-center">
      
    <div className="card-body p-6 w-full flex flex-col justify-between">
      <div>
      
       

        <div className="relative mt-6 overflow-x-auto shadow-md sm:rounded-lg  overflow-y-auto h-[560px]">
            <table id="myTable3" className="table table-xs text-sm text-left text-gray-500 dark:text-gray-900">
                <thead className="text-xm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Fecha Asignacion
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
                    </tr>
                </thead>
                <tbody>
                    {
                        bien.map((item)=>
                            <tr key={item.id} className="bg-white border-b dark:bg-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-400">
                                <th scope="row" className="px-6 py-4 font-medium text-xm text-gray-900 whitespace-nowrap dark:text-black">
                                    {(item.fecha)?new Date(item.fecha).toLocaleDateString():"No ingresado"}
                                </th>
                                <td className="px-6 py-4"> {item.codigo}</td>
                                <td className="px-6 py-4"> {item.marca}</td>
                                <td className="px-6 py-4"> {item.modelo}</td>
                                <td className="px-6 py-4"> {item.serie}</td>
                                <td className="px-6 py-4"> {item.descripcion}</td>
                                <td className="px-6 py-4"> {item.precio}</td>
                                
                              
                            </tr>
                        )
                    }
                </tbody>
            </table>
            
        </div>

      </div>
</div>
</div>
<Toaster />
</div>
      </dialog>
    );
};

export default ModelHistorial;

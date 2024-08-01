import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import useAuth from "../../auth/authStore";
import ModalDescargar from "../../components/ModalDescargar";
import useUrl from '../../store/urlStore';
import DataTable from 'datatables.net-dt';
import $ from "jquery";

function BienesMarca() {

  //-----------------------------------------Declaracion de estados----------------------------------------

  const [usuarios, setUsuarios] = useState([]);
  const [Buscar, setBuscar] = useState('');
  const url = useAuth((state) => state.url);
  const seturl = useUrl((state) => state.setUrl);
  const setbuscar = useUrl((state) => state.setBuscar);

  const { token} = useAuth((state) => state);

  //-------------------------------------------Funciones utilizadas----------------------------------------

  //Funcion para manejar el cambio de estado de la busqueda.
  const handleChange2 = (event) => {
    setBuscar(event.target.value);
  };

 //Funcion utilizada para llamar al endpoint DescargarBitacora y descargar la bitacora

  const AbrirModalDescargar = async() => {
    if(Buscar!=''){
      await seturl("/DescargarBienesMarca")
      await setbuscar(Buscar)
      window.my_modal_8.showModal();
    }else{
      toast.error('Debe ingresar una Marca al buscador');
    }
  };

  //Funcion utilizada para llamar al endpoint DescargarBitacora y descargar la bitacora

  const AbrirModalDescargarPDF = async() => {
    if(Buscar!=''){
      await seturl("/ReportePDFMarca")
      await setbuscar(Buscar)
      window.my_modal_8.showModal();
    }else{
      toast.error('Debe ingresar una Marca al buscador');
    }
  };
  

  //Funcion utilizada para obtener los bienes fungibles.

  const ObtenerBienes= async() => {
    if(Buscar!=''){
      try {
        const response = await axios.get(url+'/BienesMarca/', {
        params: {
            busqueda: Buscar
        },
        headers: {
          'Authorization': token
        },  });
        
        if(response.data.success==true){
          setUsuarios(response.data.message);

          if ( $.fn.dataTable.isDataTable('#myTable2') ) {
              let table2=$('#myTable2').DataTable();
              table2.destroy();
          }
          setTimeout(function(){
              
              if ( $.fn.dataTable.isDataTable('#myTable2') ) {
               
              }else{
                  new DataTable('#myTable2');

                  const searchInput = document.querySelector('#myTable2_filter input');
                  const searchlabel = document.querySelector('#myTable2_filter label');
                  
                  
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
      }
      } catch (error) {
        console.error('Hubo un error al retornar la informacion');
      }
    }else{
      toast.error('Debe ingresar una Marca al buscador');
    }
  };

  //HTML

  return (
    <AppLayout>
    <ModalDescargar />
      <h1 className="text-5xl mt-6">Bienes por Marca</h1>

      <div className="w-full max-w-screen-xl px-4 xl:p-0 flex flex-col justify-center">

        <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 text-xl dark:text-black mt-6">Ingrese la Marca a buscar</label>
        <div className="py-4 pt-2 flex justify-between items-center">
  
        <div className="flex  items-center" >
        <div className="relative" >
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search"  className="block w-full p-4 pl-10 px-40  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Buscar ..." onChange={handleChange2}/>
                    <button  className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    type="submit" onClick={ObtenerBienes}  >Buscar</button>
                </div>
        </div>
        <div>
          <button
                className="btn btn-success w-fit"
                onClick={ AbrirModalDescargar}
              >
                Descargar Excel
              </button>
              <button
                className="btn btn-error w-fit mx-2"
                onClick={ AbrirModalDescargarPDF}
              >
                Descargar PDF
              </button>
              </div>
          </div>
          <div style={{ height: '20px' }} />

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6  overflow-y-auto  h-[500px]">
                    <table id="myTable2" className="table table-sm table-pin-rows table-pin-cols w-full text-sm text-left text-gray-500 dark:text-gray-900 ">
                        <thead className="text-xm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                            <tr>
                               
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Fecha
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800 ">
                                    Codigo
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Cantidad
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Marca
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Modelo
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Serie
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Descripcion
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Asignado a:
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody>
                            {
                                usuarios.map((item)=>
                                    <tr key={item.id} className="bg-white border-b dark:bg-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-400">
                                        <th scope="row" className="px-6 py-4 font-medium text-xm text-gray-900 whitespace-nowrap dark:text-black">
                                            {item.fechaco}
                                        </th>
                                        <td className="px-6 py-4"> {item.codigo}</td>
                                        <td className="px-6 py-4"> {item.cantidad}</td>
                                        <td className="px-6 py-4"> {item.marca}</td>
                                        <td className="px-6 py-4"> {item.modelo}</td>
                                        <td className="px-6 py-4"> {item.serie}</td>
                                        <td className="px-6 py-4"> {item.descripcion}</td>
                                        <td className="px-6 py-4"> {item.empleado}</td>
                                        
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

export default BienesMarca;

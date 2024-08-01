import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import useAuth from "../../auth/authStore";
import DataTable from 'datatables.net-dt';
import $ from "jquery";

function BienesActivos() {

  //-----------------------------------------Declaracion de estados----------------------------------------

  const [usuarios, setUsuarios] = useState([]);
  const [fecha, setFecha] = useState('');
  const [fecha2, setFecha2] = useState('');
  const url = useAuth((state) => state.url);
  const  userid  = useAuth((state) => state.id);
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

 //Funcion utilizada para descargar el reporte de bienes activos

  const Descargar = async() => {
    if(fecha && fecha2){
      try {
        const response = await axios.get(url+'/DescargarBienesActivos/', { responseType: 'blob',
        params: {
          fecha1: fecha,
          fecha2: fecha2,
          usuario: userid
        },
        headers: {
          'Authorization': token
        },});
        const url2 = window.URL.createObjectURL(response.data);
        window.open(url2,'_blank')
      } catch (error) {
        console.error('Hubo un error al descargar el archivo');
      }
    }else{
      toast.error('Debe seleccionar un rango de fechas');
    }
  };

  
  //Funcion para descargar el reporte por usuario en PDF
  const DescargarPDF = async() => {
    if(fecha && fecha2){
      try {
        const response = await axios.get(url+'/ReportePDFbienesActivos/',
        { 
          responseType: 'blob',
          params: {
            fecha1: fecha,
            fecha2: fecha2,
            usuario: userid
          },
          headers: {
            'Authorization': token
          },  
      
        });
        const url2 = window.URL.createObjectURL(response.data);
        window.open(url2,'_blank')
    
      } catch (error) {
        console.error('Hubo un error al descargar el archivo: ', error);
      }
    }else{
      toast.error('Debe seleccionar un rango de fechas');
    }
  };
  

  //Funcion utilizada para obtener los bienes fungibles.

  const ObtenerBienes= async() => {
    if(fecha && fecha2){
      try {
        const response = await axios.get(url+'/BienesActivos/', { params: {
          fecha1: fecha,
          fecha2: fecha2
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
      toast.error('Debe seleccionar un rango de fechas');
    }
  };

  //HTML

  return (
    <AppLayout>
      <h1 className="text-5xl mt-6">Bienes Activos</h1>

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
            onClick={ObtenerBienes}>Buscar</button>
        </div>
        <div>
          <button
                className="btn btn-success w-fit"
                onClick={ Descargar}
              >
                Descargar Excel
              </button>
              <button
                className="btn btn-error w-fit mx-2"
                onClick={ DescargarPDF}
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

export default BienesActivos;

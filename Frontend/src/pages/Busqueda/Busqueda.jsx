import { useAsync, useMountEffect } from "@react-hookz/web";
import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import ModalImagen from "../../components/ModalImagen";
import ModalEditar from "../../components/ModalEditar";
import toast, { Toaster } from 'react-hot-toast';
import useCarrito from "../../store/carritoStore";
import useFav from "../../store/favStore";
import useImagen from '../../store/imgStore';
import useEditar from '../../store/editarStore';
import { useState } from "react";
import { useEffect } from "react";
import useAuth from "../../auth/authStore";

function Busqueda() {
  const setimag = useImagen((state) => state.setImagen);
  const ima= useImagen((state) => state.imagen);
  const seteditar = useEditar((state) => state.setEditar);
 
  //Inicilizar variables

  const [Opcion, setOpcion] = useState(0);
  const [Buscar, setBuscar] = useState('');
  const [im,setim] = useState(null);
  
  const [ed,seted] = useState(null);
  const [Tabla, setTabla] = useState([]);
  const [PageData, setPageData] = useState([]);

  //----------------------------Funciones para manejar cambios de estado -------------------------

  //Funcion para manejar el cambio de estado de las elecciones de busqueda
  const handleChange = (event) => {
    setOpcion(event.target.value);
  };
  //Funcion para manejar el cambio de estado de la busqueda.
  const handleChange2 = (event) => {
    setBuscar(event.target.value);
  };
 
 
  useEffect(() => {
    if (Opcion==10) {
      axios.get("http://localhost:9095/bienAsignado", {
        // Aquí van los datos que quieres enviar en la petición POST
        
          usuario: Opcion,
        
      })
        .then((resp) => {
          if (resp.data.success === true) {
            setBien2(resp.data.message);
          }else{
            toast.error(resp.data.message)
          }
        })
        .catch((error) => {
          console.error(error);
        });
    
    }
  }, [Opcion]);

  useEffect(() => {
    if(im!=null){
        window.my_modal_1.showModal();
        setim(null);
    }
  }, [im]);

  useEffect(() => {
    if(ed!=null){
        window.my_modal_2.showModal();
        seted(null);
    }
  }, [ed]);

  const FImagen = (e) => {
    
    setimag(e)
    setim("e")

  }

  const Feditar = (id,codigo,cuenta,fecha,marca,modelo,serie,precio,cantidad,descripcion,ubicacion,tipo,imagen) => {
    
    seteditar(id,codigo,cuenta,fecha,marca,modelo,serie,precio,ubicacion,tipo,cantidad,descripcion,imagen);
    seted("e");

  }


  const Descargar = async() => {
    try {
      const response = await axios.get('http://localhost:9095/DescargarReporteTotal/', { responseType: 'blob'  });
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


  const Busqueda = async() => {
    if (Opcion!=0 && Buscar!=''){
        try {
        const response = await axios.get('http://localhost:9095/BuscarBienes/', { params: {
            opcion: Opcion,
            buscar: Buscar
        }  });
        console.log(response.data)
        if(response.data.success==true){
            setTabla(response.data.message)
        }

        } catch (error) {
        toast.error("Error al buscar");
        console.error('Error en el endpoint de busqueda', error);
        }
    }
}

  return (
    <AppLayout>
        <ModalImagen />
        <ModalEditar />
        <h1 className="text-5xl mt-6">Buscar bienes</h1>
        
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
            
            <div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-900">
                        <thead className="text-xm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                            <tr>
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
                                    <span className="sr-only">Editar</span>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Imagen</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Tabla.map((item)=>
                                    <tr key={item.id} className="bg-white border-b dark:bg-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-400">
                                        <th scope="row" className="px-6 py-4 font-medium text-xm text-gray-900 whitespace-nowrap dark:text-black">
                                            {item.codigo}
                                        </th>
                                        <td className="px-6 py-4"> {item.marca}</td>
                                        <td className="px-6 py-4"> {item.modelo}</td>
                                        <td className="px-6 py-4"> {item.serie}</td>
                                        <td className="px-6 py-4"> {item.descripcion}</td>
                                        <td className="px-6 py-4"> {item.precio}</td>
                                        <td className="px-6 py-4 text-right">
                                        <button  onClick={() => {Feditar(item.id,item.codigo,item.cuenta, new Date(item.fechaco).toLocaleDateString(),item.marca,item.modelo,item.serie,item.precio,item.cantidad,item.descripcion,item.ubicacion2,item.categoria)}} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Editar</button>
                                  </td>
                                        <td className="px-6 py-4 text-right">
                                        
                                            <button  onClick={() => {FImagen(item.imagen);}} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Imagen</button>
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

export default Busqueda;

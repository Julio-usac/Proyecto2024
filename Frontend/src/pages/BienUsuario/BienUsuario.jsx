import { useAsync, useMountEffect } from "@react-hookz/web";
import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import ModalImagen from "../../components/ModalImagen";
import ModalEditar from "../../components/ModalEditar";
import useImagen from '../../store/imgStore';
import useEditar from '../../store/editarStore';
import { useState } from "react";
import { useEffect } from "react";
import useAuth from "../../auth/authStore";

function BienUsuario() {

  const setimag = useImagen((state) => state.setImagen);
  const seteditar = useEditar((state) => state.setEditar);
  const {rol } = useAuth((state) => state);
  const [usuarios, setUsuarios] = useState([]);
  const [opcion, setOpcion] = useState('');
  const [bien, setBien] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [im,setim] = useState(null);
  const [ed,seted] = useState(null);


  useEffect(() => {
    const load = async () => {
      let result = await fetch("http://localhost:9095/listaUsuarios");
      result = await result.json();
      setUsuarios(result.message)
    };
    load();
  },[]);

  useEffect(() => {
    if (opcion) {
      axios.post("http://localhost:9095/bienAsignado2", {
        
          usuario: opcion,
        
      })
        .then((resp) => {
          if (resp.data.success === true) {
            setBien(resp.data.message);
            Saldo();
          }else{
            toast.error(resp.data.message)
          }
          
        })
        .catch((error) => {
          console.error(error);
        });
    
    }
  }, [opcion]);
  
  const CambioS = (event) => {
    setOpcion(event.target.value);
  };

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
    if (rol!=3){
      seteditar(id,codigo,cuenta,fecha,marca,modelo,serie,precio,ubicacion,tipo,cantidad,descripcion,imagen);
      seted("e");
    }else{
      toast.error("No cuenta con los permisos para realizar esta operacion")
    }

  }


  const Descargar = async() => {
    try {
      const response = await axios.get('http://localhost:9095/DescargarReporteUsuario/', { responseType: 'blob',  params: {
        usuario: opcion
      }  });
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
  

  
  const Saldo = async() => {
    try {
      const response = await axios.get('http://localhost:9095/saldoUsuario/', { params: {
        usuario: opcion
      }  });
      setSaldo(response.data.message);
    } catch (error) {
      console.error('Hubo un error al retornar el saldo: ', error);
    }
  };


  return (
    <AppLayout>
      <ModalImagen />
      <ModalEditar />
      <h1 className="text-5xl mt-6">Bienes por usuario</h1>

      <div className="w-full max-w-screen-xl px-4 xl:p-0 flex flex-col justify-center">

        <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 text-xl dark:text-black">Seleccione un empleado</label>
        <div className="py-4 pt-2 flex justify-between items-center">
  
        <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
         value = {opcion} onChange={(e)=> {CambioS(e);}}>
        
        <option>Seleccionar</option>
          {
            usuarios.map((item)=>
              <option key={item.userId} value={item.userId} >{item.nombre}</option>
            )
          }
          </select> 

          <button
                className="btn btn-success w-fit"
                onClick={ Descargar}
              >
                Descargar reporte
              </button>
          </div>
          <div style={{ height: '30px' }} />

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg  overflow-y-auto h-4/6">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-900">
                  <thead className="text-xm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                      <tr>
                          <th scope="col" className="px-6 py-3">
                              Fecha compra
                          </th>
                          <th scope="col" className="px-6 py-3">
                              No.cuenta
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Codigo
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Cantidad
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Descripcion
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Ubicacion
                          </th>
                          <th scope="col" className="px-6 py-3">
                              saldo
                          </th>
                          <th scope="col" className="px-6 py-3">
                              <span className="sr-only">Edit</span>
                          </th>
                          <th scope="col" className="px-6 py-3">
                              <span className="sr-only">imagen</span>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                          bien.map((item)=>
                              <tr key={item.id} className="bg-white border-b dark:bg-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-400">
                                  <th scope="row" className="px-6 py-4 font-medium text-xm text-gray-900 whitespace-nowrap dark:text-black">
                                      { item.fechaco}
                                  </th>
                                  <td className="px-6 py-4"> {item.cuenta}</td>
                                  <td className="px-6 py-4"> {item.codigo}</td>
                                  <td className="px-6 py-4"> {item.cantidad}</td>
                                  <td className="px-6 py-4"> {item.descripcion}</td>
                                  <td className="px-6 py-4"> {item.ubicacion}</td>
                                  <td className="px-6 py-4"> {item.precio}</td>
                                  <td className="px-6 py-4 text-right">
                                        <button  onClick={() => {Feditar(item.id,item.codigo,item.cuenta, item.fechaco,item.marca2,item.modelo,item.serie,item.precio,item.cantidad,item.descripcion,item.ubicacion2,item.categoria,item.imagen)}} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Editar</button>
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

          <h1 className="text-3xl mt-6">Saldo total:  Q {saldo} </h1>
          {/* 
          <button
              className="join-item btn"
              onClick={() => {
                if (Page > 1) {
                  setPage(Page - 1);
                }
              }}
            >
              «
            </button>
            <button className="join-item btn">Pagina {Page}</button>
            <button
              className="join-item btn"
              onClick={() => {
                if (Page >= 1 && Page < state.result.data.mensaje.length / 7) {
                  setPage(Page + 1);
                }
              }}
            >
              »
            </button>*/}
        </div>
      </div>
      <Toaster />
    </AppLayout>
  );
}

export default BienUsuario;

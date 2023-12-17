import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";

import useAuth from "../../auth/authStore";

function AsBien() {


  const [showButton, setShowButton] = useState([]);
  const [showButton2, setShowButton2] = useState([]);
  const [agregar, setAgregar] = useState([]);
  const [quitar, setQuitar] = useState([]);
  const [tipo, setTipo] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [bien, setBien] = useState([]);
  const [bien2, setBien2] = useState([]);
  const [opcion, setOpcion] = useState('');
  
  const { token,logout} = useAuth((state) => state);
  const  userid  = useAuth((state) => state.id);

  //Variables utilizadas para la visibilidad de las tablas
  const [Vagregar, setVagregar] = useState(true);
  const [Vquitar, setVquitar] = useState(false);
  
  const [toggleTipo, setToggleTipo] = useState(true);

  const fVagregar = (e) => {
    setVagregar(true);
    setVquitar(false);
  };

  const fVeliminar = (e) => {
    setVquitar(true);
    setVagregar(false);
  };



  const fagregar = (id) => {
    setAgregar([...agregar,id]);
  };

  const fagregar2 = (id) => {
    const agregarid= [...agregar];
    let indice = agregarid.indexOf(id);

    if(indice !== -1){
      agregarid.splice(indice, 1);
    }
    setAgregar(agregarid);
  };

  const fquitar = (id) => {
    setQuitar([...quitar,id]);
  };

  const fquitar2 = (id) => {
    const quitarid= [...quitar];
    let indice = quitarid.indexOf(id);

    if(indice !== -1){
      quitarid.splice(indice, 1);
    }
    setQuitar(quitarid);
  };

  const toggleButton = (id) => {
    const updatedVisibility = [...showButton];
    updatedVisibility[id] =  !updatedVisibility[id] ;
    setShowButton(updatedVisibility);
  };

  const toggleButton2 = (id) => {
    const updatedVisibility = [...showButton2];
    updatedVisibility[id] =  !updatedVisibility[id] ;
    setShowButton2(updatedVisibility);
  };



  
  const { register, handleSubmit } = useForm({
    defaultValues: {
      tarjeta: null,
      categoria: null,
      usuario: null,
      saldo: null,
      asignar: null,
      quitar: null,
      url: "http://localhost:9095/AsBien",
    },
  });

  useEffect(() => {
    const load = async () => {
      let result = await fetch("http://localhost:9095/tipo");
      result = await result.json();
      setTipo(result.message)
    };
    load();
  },[]);

  useEffect(() => {
    const load = async () => {
      let result = await fetch("http://localhost:9095/listaUsuarios");
      result = await result.json();
      setUsuario(result.message)
    };
    load();
  },[]);

  useEffect(() => {
 

    axios.get('http://localhost:9095/BienesNoAsignados')
      .then((resp) => {

      setBien(resp.data.message);

      let bienarray =[];

      for (let i = 0; i < resp.data.message.length; i++) {
   
        bienarray[resp.data.message[i].id]=true;
        
      }
      setShowButton(bienarray);
      })
      .catch((error) => {
        toast.error('Error al retornar los bienes no asignados')
        console.error('Hubo un error al retornar los bienes: ', error);

      });
  },[]);

  useEffect(() => {
    if (opcion) {
      axios.post("http://localhost:9095/bienAsignado", {
          usuario: opcion,
        
      })
        .then((resp) => {
          if (resp.data.success === true) {
            setBien2(resp.data.message);
            let bienarray =[];

            for (let i = 0; i < resp.data.message.length; i++) {
        
              bienarray[resp.data.message[i].id]=true;
              
            }
            setShowButton2(bienarray);
          }else{
            toast.error(resp.data.message)
          }
        })
        .catch((error) => {
          console.error(error);
        });
    
    }
  }, [opcion]);


  const Cambio = (event) => {
    setOpcion(event.target.value);
  };

  const onSubmit = async (data) => {
   
    if (data.categoria!=null && data.categoria!="Seleccionar" && opcion!="" && opcion!="Seleccionar" ){
      if (agregar.length!=0 || quitar.length!=0){
        try {
          const resp = await axios({
            url: "http://localhost:9095/AsBien",
            method: "post",
            data: {
              op: toggleTipo,
              tarjeta: data.tarjeta,
              categoria: data.categoria,
              usuario: data.usuario,
              saldo: data.saldo,
              asignar: agregar,
              quitar: quitar,
              token: token,
            },
          });
          
          if (resp.data.success === true) {
            toast.success("Ingreso exitoso!")

            try {
              const resp = await axios({
                url: "http://localhost:9095/IngresarBitacora",
                method: "post",
                data: {
                  usuario: userid,
                  usuarioaf: data.usuario,
                  bienaf: null,
                  tipo: 4,
                  afectado:false,
                },
              });
            } catch (error) {
              console.log(error)
            }
            setTimeout(function(){ window.location.reload(); }, 1000);
          }else{
            toast.error(resp.data.message)
          }
        } catch (error) {

          if ('token' in error.response.data){
            logout();
          }else{
            
            toast.error(error.response.data.message);
          }
        }
      }else{
        toast.error("Debe asignar o quitar un bien")
      }
    }else{
        toast.error("Debe seleccionar un tipo y un usuario")
    }
  };

  return (
    <AppLayout>
   
   <div className="bg-base-300 w-full h-[100vh] flex justify-center items-center">
        <div className="card  bg-base-100 shadow-xl max-w-screen-2xl lg:h-fit">
          
          <div className="card-body p-16 w-full flex flex-col justify-between">
            <div>
              <h2 className="card-title font-semibold text-4xl text-black justify-center">
          
                Tarjeta de responsabilidad
              </h2>
              <div className="divider my-1 mt-2"></div>
            </div>
            <div className="container mx-auto">
              <div className="flex justify-center space-x-4"></div>
              <form onSubmit={handleSubmit(onSubmit)}>
                
                <div className="flex items-center justify-center">
                  
                  <div className="grid grid-cols-2">
                  
                    <div className="flex flex-col justify-left -mx-1 mb-11">
                      <div className="tabs tabs-boxed w-fit">
                        <a
                          className={"tab " + (toggleTipo ? "tab-active" : "")}
                          onClick={() => setToggleTipo(true)}
                        >
                          Nuevo
                        </a>
                        <a
                          className={"tab " + (toggleTipo ? "" : "tab-active")}
                          onClick={() => setToggleTipo(false)}
                        >
                          {" "}
                          Actualizar
                        </a>
                      </div>
                      <div style={{ height: '50px' }} />
                      <div className="w-fit">
                        <h3>Numero de tarjeta</h3>
                        <input className="w-64 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                        type="number" required {...register("tarjeta", { required: true })}/>
                      </div>
                      
                      <div className="w-fit mt-4">
                        <h3>Tipo de tarjeta</h3>
                        <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required {...register("categoria", { required: true })} defaultValue={null}>
                          <option value={null}> Seleccionar </option>
                          {
                            tipo.map((item)=>
                              <option key={item.catId} value={item.catId}>{item.nombre}</option>
                            )
                          }
                          </select>
                      </div>
                      <div className="w-fit mt-6">
                        <h3>Usuario</h3>
                        <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required {...register("usuario", { required: true })} value = {opcion} onChange={(e)=>Cambio(e)}>
                        
                        <option>Seleccionar</option>
                          {
                            usuario.map((item)=>
                              <option key={item.userId} value={item.userId} >{item.nombre}</option>
                            )
                          }
                          </select>  
                      </div>
                      <div className="w-fit mt-6">
                        <h3>Saldo (Q)</h3>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                        type="number" step="0.01" placeholder="0.00" required {...register("saldo", { required: true })}/>
                      </div>
                      <button
                    className="btn bg-blue-500 text-white w-fit mt-6 "  type="submit"
                    >
                    Ingresar tarjeta
                </button>
                    </div>
                    
                    <div className="flex flex-col justify-left items-center -mx-1 mb-11">
                      <div>
                    <button
                        className="btn bg-blue-500 text-white w-fit"
                        onClick={(e) => {
                          e.preventDefault();
                          fVagregar();
                        }}
                    >
                        AGREGAR
                    </button>
                    <button
                        className="btn bg-red-500 text-white w-fit mx-6"
                        onClick={(e) => {
                          e.preventDefault();
                          fVeliminar();
                        }}
                    >
                        Desasignar
                    </button>
                    </div>
                {Vagregar&&<h2 className="card-title font-semibold text-4xl text-black justify-center mt-4">
                          
                  Asignar activos
                </h2>}
                {Vagregar&&<div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4 overflow-y-auto h-96">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-900 table-auto ">
                        <thead className="text-xm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Codigo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Marca
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Descripcion
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Saldo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Accion</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {
                                bien.map((item)=>
                                    <tr key={item.id} className="bg-white border-b dark:bg-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-400">
                                        <th scope="row" className="px-6 py-4 font-medium text-xm text-gray-900 whitespace-nowrap dark:text-black">
                                            {item.codigo}
                                        </th>
                                        <td className="px-6 py-4"> {item.marca}</td>
                                        <td className="px-6 py-4"> {item.descripcion}</td>
                                        <td className="px-6 py-4"> {item.precio}</td>
                                        {showButton[item.id] && (<td className="px-6 py-4 text-right">
                                        
                                          <button  key={item.id} className="btn bg-green-500 text-white w-fit"
                                          onClick={() => {
                                            fagregar(item.id);
                                            toggleButton(item.id);
                                          }}>
                                            Agregar
                                          </button>
                                        
                                        </td>)}
                                        {!showButton[item.id] && (<td className="px-6 py-4 text-right">
                                        
                                          <button  key={item.id} className="btn bg-red-500 text-white w-fit"
                                          onClick={() => {
                                            fagregar2(item.id);
                                            toggleButton(item.id);
                                          }}>
                                            Quitar
                                          </button>
                                        
                                        </td>)}
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    
                </div>}
                {Vquitar&& <h2 className="card-title font-semibold text-4xl text-black justify-center mt-4">
          
                  Desasignar activos
                </h2>}
                {Vquitar&&<div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4 overflow-y-auto h-96">
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
                                    Descripcion
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Saldo
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <span className="sr-only">Accion</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                                bien2.map((item)=>
                                    <tr key={item.id} className="bg-white border-b dark:bg-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-400">
                                        <th scope="row" className="px-6 py-4 font-medium text-xm text-gray-900 whitespace-nowrap dark:text-black">
                                            {item.codigo}
                                        </th>
                                        <td className="px-6 py-4"> {item.marca}</td>
                                        <td className="px-6 py-4"> {item.descripcion}</td>
                                        <td className="px-6 py-4"> {item.precio}</td>
                                        {!showButton2[item.id] && (<td className="px-6 py-4 text-right">
                                        
                                          <button  key={item.id} className="btn bg-green-500 text-white w-fit"
                                          onClick={() => {
                                            fquitar2(item.id);
                                            toggleButton2(item.id);
                                          }}>
                                            Agregar
                                          </button>
                                        
                                        </td>
                                        )}
                                         {showButton2[item.id] && (<td className="px-6 py-4 text-right">
                                       
                                          <button  key={item.id} className="btn bg-red-500 text-white w-fit"
                                          onClick={() => {
                                            fquitar(item.id);
                                            toggleButton2(item.id);
                                          }}>
                                            Quitar
                                          </button>
                                        
                                        </td>)}
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                    
                </div>}
            </div>
                </div>
                
            
                </div>
              
              </form>
            </div>

            {/* {
          <div className="tabs tabs-boxed w-fit">
            <a
              className={"tab " + (toggleTipo ? "tab-active" : "")}
              onClick={() => setToggleTipo(true)}
            >
              Cliente
            </a>
            <a
              className={"tab " + (toggleTipo ? "" : "tab-active")}
              onClick={() => setToggleTipo(false)}
            >
              {" "}
              Proveedor
            </a>
          </div>
          } */}
        </div>
      </div>
    </div>
    <Toaster />
    </AppLayout>
  );
}

export default AsBien;

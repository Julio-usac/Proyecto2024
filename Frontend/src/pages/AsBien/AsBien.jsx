import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";

import useAuth from "../../auth/authStore";
import DataTable from 'datatables.net-dt';
import $ from "jquery";

function AsBien() {

//-----------------------------------------Declaracion de estados-----------------------------------------

  const [showButton, setShowButton] = useState([]);
  const [showButton2, setShowButton2] = useState([]);
  const [agregar, setAgregar] = useState([]);
  const [quitar, setQuitar] = useState([]);
  const [tipo, setTipo] = useState([]);
  const [empleado, setEmpleado] = useState([]);
  const [bien, setBien] = useState([]);
  const [bien2, setBien2] = useState([]);
  const [opcion, setOpcion] = useState('');
  const [tarjetas, setTarjetas] = useState([]);

  
  const [nombres, setNombres] = useState([]);
  const [ids,setIds ] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredNames, setFilteredNames] = useState(nombres);
  
//-----------------------------------------Retornar informacion del usuario-----------------------------------------

  const { token,logout} = useAuth((state) => state);
  const  userid  = useAuth((state) => state.id);
  const url = useAuth((state) => state.url);

  //estados utilizados para la visibilidad de las tablas
  const [Vagregar, setVagregar] = useState(true);
  const [Vquitar, setVquitar] = useState(false);
  
  const [toggleTipo, setToggleTipo] = useState(true);

// funcion para filtrar los nombres

const handleSearchChange = (event) => {
  setSearch(event.target.value);
  setFilteredNames(nombres.filter(name => name.toLowerCase().includes(event.target.value.toLowerCase())));
};


  //funcion para cambiar el estado de los botones al agregar un bien

  const fVagregar = (e) => {
    if ( $.fn.dataTable.isDataTable('#myTable') ) {
      let table2=$('#myTable').DataTable();
      table2.destroy();
    }
    setTimeout(function(){
      
      if ( $.fn.dataTable.isDataTable('#myTable') ) {
        
      }else{
        new DataTable('#myTable');
        const searchInput = document.querySelector('#myTable_filter input');
        const searchlabel = document.querySelector('#myTable_filter label');
        
        
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
    setVagregar(true);
    setVquitar(false);
  };

  //funcion para cambiar el estado de los botones al quitar un bien

  const fVeliminar = (e) => {
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
    setVquitar(true);
    setVagregar(false);
  };

 //funcion para llenar el arreglo con los bienes a agregar

  const fagregar = (id) => {
    setAgregar([...agregar,id]);
  };

  //funcion para quitar un bien del arreglo

  const fagregar2 = (id) => {
    const agregarid= [...agregar];
    let indice = agregarid.indexOf(id);

    if(indice !== -1){
      agregarid.splice(indice, 1);
    }
    setAgregar(agregarid);
  };

  //funcion para llenar el arreglo con los bienes a quitar

  const fquitar = (id) => {
    setQuitar([...quitar,id]);
  };

//funcion para quitar un bien del arreglo

  const fquitar2 = (id) => {
    const quitarid= [...quitar];
    let indice = quitarid.indexOf(id);

    if(indice !== -1){
      quitarid.splice(indice, 1);
    }
    setQuitar(quitarid);
  };

//funcion para cambiar la visibilidad de los botones

  const toggleButton = (id) => {
    const updatedVisibility = [...showButton];
    updatedVisibility[id] =  !updatedVisibility[id] ;
    setShowButton(updatedVisibility);
  };

//funcion para cambiar la visibilidad de los botones

  const toggleButton2 = (id) => {
    const updatedVisibility = [...showButton2];
    updatedVisibility[id] =  !updatedVisibility[id] ;
    setShowButton2(updatedVisibility);
  };


//--------------------------------------------Declaracion de datos a enviar en el formulario-----------------------------------------
 
  
  const { register, handleSubmit } = useForm({
    defaultValues: {
      tarjeta: null,
      categoria: null,
      empleado: null,
      saldo: null,
      asignar: null,
      quitar: null,
    },
  });

  //-------------------------------------------Funciones utilizadas----------------------------------------

  //Funcion para retornar las categoria de los bienes

  useEffect(() => {
    const load = async () => {
      let result = await fetch(url+"/tipo",{headers: {
        'Authorization': token
      },});
      result = await result.json();
      setTipo(result.message)
    };
    load();
  },[]);

  //Funcion para retornar la lista de usuarios

  useEffect(() => {
    
    axios.get(url+'/listaPersonal',{ headers: {
        'Authorization': token
      },})
      .then((resp) => {

        setEmpleado(resp.data.message);
        const names=resp.data.message.map(item => item.nombre);
        const iden=resp.data.message.map(item => item.empleadoId);
        setNombres(names);
        setIds(iden);

      })
      .catch((error) => {
        if ('token' in error.response.data){
          logout();
        }else{
          console.error('Hubo un error al retornar el personal');
        }

      });
  },[]);

  //Funcion para retornar los bienes no asignados

  useEffect(() => {
 

    axios.get(url+'/BienesNoAsignados',{headers: {
      'Authorization': token
    },})
      .then((resp) => {

      setBien(resp.data.message);

      let bienarray =[];

      for (let i = 0; i < resp.data.message.length; i++) {
   
        bienarray[resp.data.message[i].id]=true;
        
      }
      setShowButton(bienarray);

      if ( $.fn.dataTable.isDataTable('#myTable') ) {
        let table2=$('#myTable').DataTable();
        table2.destroy();
      }
      setTimeout(function(){
        
        if ( $.fn.dataTable.isDataTable('#myTable') ) {
          
        }else{
          new DataTable('#myTable');
          const searchInput = document.querySelector('#myTable_filter input');
                    const searchlabel = document.querySelector('#myTable_filter label');
                    
                    
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
        toast.error('Error al retornar los bienes no asignados')

      });
  },[]);


   //Funcion para retornar los bienes asignados del usuario seleccionado

  useEffect(() => {
    if (opcion) {
      
      axios.post(url+"/bienAsignado", {
          empleado: opcion,
        
      },{headers: {
        'Authorization': token
      },})
        .then((resp) => {
          if (resp.data.success === true) {
            setBien2(resp.data.message);
            let bienarray =[];

            for (let i = 0; i < resp.data.message.length; i++) {
        
              bienarray[resp.data.message[i].id]=true;
              
            }
            setShowButton2(bienarray);
            /*
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
            }, 1000);*/
          }else{
            toast.error(resp.data.message)
          }
        })
        .catch((error) => {
          console.error(error);
        });
      if (!toggleTipo){
        axios.get(url+'/tarjetasAsignadas/'+opcion, {headers: {
          'Authorization': token
        }  })
          .then((resp) => {
    
          setTarjetas(resp.data.message);
    
          })
          .catch((error) => {
            toast.error('Error al retornar tarjetas')
    
          });
      }
        
    }
  }, [opcion]);

  //Funcion para indicar que se ha seleccionado un usuario

  const Cambio = (event) => {
    setOpcion(event.target.value);
  };


   //Funcion para enviar los datos del formulario
  const onSubmit = async (data) => {
   
    if (data.categoria && data.categoria!="Seleccionar" && opcion && opcion!="Seleccionar" && data.tarjeta && data.tarjeta!="Seleccionar"){
      if (agregar.length!=0 || quitar.length!=0){
        try {
          const resp = await axios({
            url: url+"/AsBien",
            method: "post",
            data: {
              op: toggleTipo,
              tarjeta: data.tarjeta,
              categoria: data.categoria,
              empleado: data.empleado,
              saldo: data.saldo,
              asignar: agregar,
              quitar: quitar,
            },headers: {
              'Authorization': token
            },
          });
          
          if (resp.data.success === true) {
            toast.success("Ingreso exitoso!")

            try {
              const resp = await axios({
                url: url+"/IngresarBitacora",
                method: "post",
                data: {
                  usuario: userid,
                  empleado: data.empleado,
                  bienaf: null,
                  tipo: 4,
                  afectado:false,
                },headers: {
                  'Authorization': token
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
        toast.error("Debe llenar todos los campos")
    }
  };
//----------------------------------------------HTML-----------------------------------------------------

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

                      <div className="w-fit ">
                        <h3>Seleccionar Empleado</h3>


                        <div>
                        <input 
                          type="text" 
                          value={search} 
                          onChange={handleSearchChange} 
                          className="w-full px-4 py-2  rounded-md focus:outline-none bg-white ring-2 ring-blue-300"
                          placeholder="Buscar..."
                        />
                        {search && (
                          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required {...register("empleado", { required: true })} value = {opcion} onChange={(e)=>Cambio(e)}>
                            <option>Seleccionar</option>
                            {filteredNames.map((name, index) => (
                              <option key={index} value={ids[nombres.indexOf(name)]}>
                                {name}
                              </option>
                            ))}
                          </select>
                        )}
                    </div>
                        
                      
                      </div>
                        
                      {toggleTipo && (<div className="w-fit mt-6">
                        <h3>Numero de tarjeta</h3>
                        <input className="w-64 appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                        type="number" {...register("tarjeta", { required: false })}/>
                      </div>
                      )}

                       {!toggleTipo && (<div className="w-fit mt-6">
                        <h3>Numero de Tarjeta</h3>
                        <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                         {...register("tarjeta", { required: false })} defaultValue={null}>
                          <option value={null}> Seleccionar </option>
                          {
                            tarjetas.map((item)=>
                              <option key={item.id} value={item.tarjeta}>{item.tarjeta}</option>
                            )
                          }
                          </select>
                      </div>
                      )}
                      
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
                        Asignar
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
                    <table id="myTable" className="table table-xs table-pin-rows w-full text-sm text-left text-gray-500 dark:text-gray-900 table-auto ">
                        <thead className="text-xm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Codigo
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Marca
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Descripcion
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Saldo
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
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
                {Vquitar&&<div>
                
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4 overflow-y-auto h-96">
                    <table id="myTable2" className="table table-xs table-pin-rows w-full text-sm text-left text-gray-500 dark:text-gray-900">
                        <thead className="text-xm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Codigo
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Marca
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Descripcion
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                                    Saldo
                                </th>
                                <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
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
                    
                </div>
                </div>}
            </div>
                </div>
                
            
                </div>
              
              </form>
            </div>

            
        </div>
      </div>
    </div>
    <Toaster />
    </AppLayout>
  );
}

export default AsBien;

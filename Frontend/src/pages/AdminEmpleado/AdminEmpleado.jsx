import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import { useEffect } from "react";
import ModalCrearEmpleado from "../../components/ModalCrearEmpleado";
import ModalEditarEmpleado from "../../components/ModalEditarEmpleado";
import ModalHistorial from "../../components/ModalHistorial";
import useEmpleado from '../../store/empleadoStore';
import useAuth from "../../auth/authStore";
import DataTable from 'datatables.net-dt';
import $ from "jquery";
import 'datatables.net-responsive-dt';

function AdminEmpleado() {

//--------------------------------------------Declaracion de estados-----------------------------------------

 
  let nambre='myTable2'
  const [empleado, setEmpleado] = useState([]);
  const [showButton, setShowButton] = useState([]);
  const [actualizar, setactualizar] = useState("");
  const [Buscar, setBuscar] = useState('');

// Estado para habilitar el modal Historial

  const [habilitar, setHabilitar] = useState(false);

  //-----------------------------Funcion para guardar la informacion del usuario a editar------------------------

  const seteditar = useEmpleado((state) => state.setEditarEmpleado);

  //-----------------------------------------Retornar informacion del usuario-----------------------------------------


  const  userid  = useAuth((state) => state.id);
  const { token,logout} = useAuth((state) => state);
  const url = useAuth((state) => state.url);

//-------------------------------------------Funciones utilizadas----------------------------------------


  //Funcion para obtener la lista de empleados al entrar al modulo
  useEffect(() => {
     
      axios.get(url+'/listaPersonal',{ headers: {
        'Authorization': token
      },})
      .then((resp) => {

      setEmpleado(resp.data.message);
      
      let userarray =[];

      for (let i = 0; i < resp.data.message.length; i++) {
        if (resp.data.message[i].activo==true){
          userarray[resp.data.message[i].empleadoId]=true;
        }else{
          userarray[resp.data.message[i].empleadoId]=false;
        }
        
      }
      
      setShowButton(userarray);
      setactualizar('');
      
      
      })
      .catch((error) => {
        if ('token' in error.response.data){
          logout();
        }else{
          console.error('Hubo un error al retornar los usuarios');
        }
        

      });

  },[actualizar]);


  
  //Funcion para actualizar el estado del empleado
  const ActualizarEstado = (id) => {
    
    const updatedVisibility = [...showButton];
    let estado=false;
    if (updatedVisibility[id]==true){
      estado=false;
    }else{
      estado=true;
    }
    updatedVisibility[id] = !updatedVisibility[id] ;
    

    axios.put(url+"/ActualizarEstadoEmpleado", {
      
        estado: estado,
        id: id,
      
    },{ headers: {
      'Authorization': token
    },})
      .then((resp) => {
        if (resp.data.success === true) {
          toast.success("Estado actualizado")
          setShowButton(updatedVisibility);
        }else{
          toast.error(resp.data.message)
        }
      })
      .catch((error) => {
        if ('token' in error.response.data){
          logout();
        }else{
          toast.error(error.message);
        }
      });
      
  };


   //Funcion para mostrar el formulario para crear usuarios
  const CrearUsuario= (e) => {
    window.my_modal_5.showModal();
    
  }


  //Funcion para guardar los datos del usuario a editar

  const EditarUsuario= async(id,nombre,apellido,dpi,nit,puesto) => {
    
    await seteditar(id,nombre,apellido,dpi,nit,puesto);
    window.my_modal_6.showModal();

    
  }

  //Funcion para guardar los datos del usuario a editar

  const Historial= async(id) => {
    setHabilitar(true);
    await seteditar(id,null,null,null,null,null);
    window.my_modal_7.showModal();
    
  }

  const handleChange2 = (event) => {
    setBuscar(event.target.value);
    
  };

   //Funcion para buscar Empleado

  const Busqueda = async() => {
    
    if (Buscar!=''){
        axios.get(url+'/BuscarEmpleado',{ headers: {
          'Authorization': token
        },params: {
          buscar: Buscar
      } })
        .then((resp) => {
  
        setEmpleado(resp.data.message);

        let userarray =[];
  
        for (let i = 0; i < resp.data.message.length; i++) {
          if (resp.data.message[i].activo==true){
            userarray[resp.data.message[i].empleadoId]=true;
          }else{
            userarray[resp.data.message[i].empleadoId]=false;
          }
          
        }
        setShowButton(userarray);
        if ( $.fn.dataTable.isDataTable('#myTable2') ) {
          let table2=$('#myTable2').DataTable();
          table2.destroy();
        }
        setTimeout(function(){
          
          if ( $.fn.dataTable.isDataTable('#myTable2') ) {
            //setTimeout(function(){new DataTable('#'+nambre);}, 1000);
            /*$('#myTable2').DataTable({
              destroy: true
            });
            nambre=Buscar;
            const element = document.getElementById('myTable2');
            if (element) {
              element.remove();
            }
            
            console.log(2);
            setTimeout(function(){new DataTable('#'+Buscar);}, 1000);*/
          }else{
            new DataTable('#myTable2');
          }
        }, 1000);
        
      
        })
        .catch((error) => {
          if ('token' in error.response.data){
            logout();
          }else{
            console.error('Hubo un error al retornar los usuarios');
          }
          
  
        });
    }
  }



//-------------------------------------------------------HTML---------------------------------------------------------
 
  return (
    
    <AppLayout>
      <ModalCrearEmpleado />
      <ModalEditarEmpleado/>
      {habilitar&&<ModalHistorial/>}
      
      
      <h1 className="text-5xl mt-6"> Administrar Empleados</h1>

      <div className="w-full max-w-screen-xl px-4 xl:p-0 flex flex-col justify-center mt-6">

        <div>
          <div className="py-4 pt-2 flex justify-between items-center">

        
            <button
                  className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-700 text-white font-bold w-fit"
                  onClick={(e) => {CrearUsuario(e);}}
            >
                  Registrar Empleado
            </button>
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
                
          </div>
          <div style={{ height: '30px' }} />
 
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg  overflow-y-auto h-[550px]">
              <table id={nambre} className="w-full text-sm text-left text-gray-500 dark:text-gray-900">
                  <thead  className="text-xm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                      <tr>
                          <th scope="col" className="px-6 py-3">
                              Nombre
                          </th>
                          <th scope="col" className="px-6 py-3">
                              DPI
                          </th>
                          <th scope="col" className="px-6 py-3">
                              NIT
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Estado
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Editar
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Historial
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                          empleado.map((item)=>
                              <tr key={item.empleadoId}  className="bg-white border-b dark:bg-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-400">
                                  <th scope="row" className="px-6 py-4 font-medium text-xm text-gray-900 whitespace-nowrap dark:text-black">
                                      { item.nombre}
                                  </th>
                                  <td className="px-6 py-4"> 
                                    {item.dpi}
                                  </td>
                                  <td className="px-6 py-4"> 
                                    {item.nit}
                                  </td>

                                  {showButton[item.empleadoId] && 
                                    (<td className="px-6 py-4 text-left">
                                        
                                    <button  key={item.empleadoId} className="btn bg-green-500 text-white w-fit"
                                    onClick={() => {
                                      ActualizarEstado(item.empleadoId);
                                    }}>
                                      Activo
                                    </button>
                                  
                                  </td>
                                  )}
                                    {!showButton[item.empleadoId] && (<td className="px-6 py-4 text-left">
                                  
                                    <button  key={item.empleadoId} className="btn bg-red-500 text-white w-fit"
                                    onClick={() => {
                                      ActualizarEstado(item.empleadoId);
                                    }}>
                                      Inactivo
                                    </button>
                                  
                                  </td>)}
                                  <td className="px-6 py-4 text-left">
                                        
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    onClick={() => {EditarUsuario(item.empleadoId,item.nombres,item.apellidos,item.dpi,item.nit,item.puesto);}}>
                                      Editar
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 text-left">
                                        
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    onClick={() => {Historial(item.empleadoId);}}>
                                      Historial
                                    </button>
                                    
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

export default AdminEmpleado;

import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from "react";
import { useEffect } from "react";
import ModalCrearUsuario from "../../components/ModalCrearUsuario";
import ModalEditarUsuario from "../../components/ModalEditarUsuario";
import useUsuario from '../../store/usuarioStore';

import useAuth from "../../auth/authStore";

import DataTable from 'datatables.net-dt';
import $ from "jquery";

function AdminUsuario() {

//--------------------------------------------Declaracion de estados-----------------------------------------


  const [usuario, setUsuario] = useState([]);
  const [showButton, setShowButton] = useState([]);
  const [actualizar, setactualizar] = useState("");
  


  //-----------------------------Funcion para guardar la informacion del usuario a editar------------------------

  const seteditar = useUsuario((state) => state.setEditarUser);

  //-----------------------------------------Retornar informacion del usuario-----------------------------------------


  const  userid  = useAuth((state) => state.id);
  const { token,logout} = useAuth((state) => state);
  const url = useAuth((state) => state.url);

//-------------------------------------------Funciones utilizadas----------------------------------------


  //Funcion para obtener la lista de usuarios al entrar al modulo
  useEffect(() => {
    
      axios.get(url+'/listaUsuarios',{ headers: {
        'Authorization': token
      },})
      .then((resp) => {

      setUsuario(resp.data.message);

      let userarray =[];

      for (let i = 0; i < resp.data.message.length; i++) {
        if (resp.data.message[i].estado==1){
          userarray[resp.data.message[i].userId]=true;
        }else{
          userarray[resp.data.message[i].userId]=false;
        }
        
      }
      setShowButton(userarray);
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


  
  //Funcion para actualizar el estado del usuario
  const ActualizarEstado = (id) => {

    const updatedVisibility = [...showButton];
    let estado=0;
    if (updatedVisibility[id]==true){
      estado=2;
    }else{
      estado=1;
    }
    updatedVisibility[id] = !updatedVisibility[id] ;
    

    axios.put(url+"/ActualizarEstado", {
      
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


//Funcion para eliminar al usuario

  const EliminarUsuario = (e) => {
    
    const confirmacion = window.confirm('¿Estás seguro de eliminar este usuario?');
    if (confirmacion) {
      axios.delete(url+'/EliminarUsuario/'+e,{ headers: {
        'Authorization': token
      },})
      .then( async response => {
       
        toast.success(response.data.message);
        setactualizar('a');
        setTimeout(function(){  }, 2000);
      })
      .catch(error => {
        
        if ('token' in error.response.data){
          logout();
        }else{
          toast.error(error.message);
        }
        
      });
    }

  }

  
  //Funcion para actualizar el estado del usuario
  const RestablecerPass = (id) => {    

    axios.put(url+"/RestablecerPass", {
      
        userid: id,
      
    },{ headers: {
      'Authorization': token
    },})
      .then((resp) => {
        if (resp.data.success === true) {
          toast.success("Contraseña restablecida exitosamente")
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
    window.my_modal_3.showModal();
    
  }


  //Funcion para guardar los datos del usuario a editar

  const EditarUsuario= async(id,nombre,apellido,correo,usuario) => {
    await seteditar(id,nombre,apellido,correo,usuario);
    window.my_modal_4.showModal();

    
  }

  
//-------------------------------------------------------HTML---------------------------------------------------------
 
  return (
    <AppLayout>
      
      <ModalCrearUsuario />
      <ModalEditarUsuario />
      <h1 className="text-5xl mt-6"> Administrar Usuarios</h1>

      <div className="w-full max-w-screen-xl px-4 xl:p-0 flex flex-col justify-center">

        <div>
          <div className="py-4 pt-2 flex justify-between items-center">

        
            <button
                  className="bg-blue-500 py-2 px-4 rounded hover:bg-blue-700 text-white font-bold w-fit"
                  onClick={(e) => {CrearUsuario(e);}}
            >
                  Crear usuario
            </button>
            
                
          </div>
          <div style={{ height: '30px' }} />

          <div className="relative overflow-x-auto shadow-md sm:rounded-lg  overflow-y-auto h-[550px]">
              <table id="myTable2" className="table table-sm table-pin-rows table-pin-cols w-full text-left text-gray-500 dark:text-gray-900">
                  <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                      <tr>
                          <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                              Nombre
                          </th>
                          <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                              Usuario
                          </th>
                          <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                              Rol
                          </th>
                          <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                              Estado
                          </th>
                          <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                              Editar
                          </th>
                          <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                            contraseña
                          </th>
                          <th scope="col" className="px-6 py-3 dark:bg-gray-400 dark:text-gray-800">
                            Eliminar
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                          usuario.map((item)=>
                              <tr key={item.userId} className="bg-white border-b dark:bg-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-400">
                                  <th scope="row" className="px-6 py-4 font-medium text-xm text-gray-900 whitespace-nowrap dark:text-black">
                                      { item.nombre}
                                  </th>
                                  <td className="px-6 py-4"> 
                                    {item.correo}
                                  </td>
                                  <td className="px-6 py-4"> 
                                    {item.rol}
                                  </td>

                                  {showButton[item.userId] && 
                                    (<td className="px-6 py-4 text-left">
                                        
                                    <button  key={item.userId} className="btn bg-green-500 text-white w-fit"
                                    onClick={() => {
                                      ActualizarEstado(item.userId);
                                    }}>
                                      Activo
                                    </button>
                                  
                                  </td>
                                  )}
                                    {!showButton[item.userId] && (<td className="px-6 py-4 text-left">
                                  
                                    <button  key={item.userId} className="btn bg-red-500 text-white w-fit"
                                    onClick={() => {
                                      ActualizarEstado(item.userId);
                                    }}>
                                      Inactivo
                                    </button>
                                  
                                  </td>)}
                                  <td className="px-6 py-4 text-left">
                                        
                                    <button className="font-medium text-blue-800 dark:text-blue-500 hover:underline"
                                    onClick={() => {EditarUsuario(item.userId,item.nombres,item.apellidos,item.correo,item.rolId);}}>
                                      Editar
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 text-left">
                                        
                                    <button className="font-medium  dark:text-blue-400 hover:underline"
                                    onClick={() => {RestablecerPass(item.userId);}}>
                                      Restablecer
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 text-left">
                                        
                                    <button className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                    onClick={() => {EliminarUsuario(item.userId);}}>
                                      Eliminar
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

export default AdminUsuario;

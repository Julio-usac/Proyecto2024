import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import ModalCrearUsuario from "../../components/ModalCrearUsuario";
import ModalEditarUsuario from "../../components/ModalEditarUsuario";
import useUsuario from '../../store/usuarioStore';

import useAuth from "../../auth/authStore";

function AdminUsuario() {

//--------------------------------------------Declaracion de estados-----------------------------------------


  const [usuario, setUsuario] = useState([]);
  const [showButton, setShowButton] = useState([]);
  const [actualizar, setactualizar] = useState("");
  const [ed,seted] = useState(null);

  //-----------------------------Funcion para guardar la informacion del usuario a editar------------------------

  const seteditar = useUsuario((state) => state.setEditarUser);

  //-----------------------------------------Retornar informacion del usuario-----------------------------------------


  const  userid  = useAuth((state) => state.id);
  const { token,logout} = useAuth((state) => state);

//-------------------------------------------Funciones utilizadas----------------------------------------


  //Funcion para obtener la lista de usuarios al entrar al modulo
  useEffect(() => {
    
      axios.get('http://localhost:9095/listaUsuarios')
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
      setactualizar('');
      })
      .catch((error) => {

        console.error('Hubo un error al retornar los bienes: ', error);

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
    

    axios.put("http://localhost:9095/ActualizarEstado", {
      
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
      axios.delete('http://localhost:9095/EliminarUsuario/'+e,{ headers: {
        'Authorization': token
      },})
      .then( async response => {
        try {
          const resp = await axios({
            url: "http://localhost:9095/IngresarBitacora",
            method: "post",
            data: {
              usuario:  userid,
              usuarioaf: e,
              bienaf: null,
              tipo: 3,
              afectado:false,
            },
          });
        } catch (error) {
          console.log("Error en la Bitacora")
        }
        toast.success(response.data.message);
        setactualizar('a');
        //setTimeout(function(){ window.location.reload(); }, 1000);
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


   //Funcion para mostrar el formulario para crear usuarios
  const CrearUsuario= (e) => {
    window.my_modal_3.showModal();
    
  }

 //Funcion para mostrar el formulario para editar usuarios
  useEffect(() => {
    if(ed!=null){
        window.my_modal_4.showModal();
        seted(null);
    }
  }, [ed]);

  //Funcion para guardar los datos del usuario a editar

  const EditarUsuario= (id,nombre,apellido,correo,usuario) => {
    seteditar(id,nombre,apellido,correo,usuario);
    seted("e");

    
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
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-900">
                  <thead className="text-xm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                      <tr>
                          <th scope="col" className="px-6 py-3">
                              Nombre
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Correo
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Rol
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Estado
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Editar
                          </th>
                          <th scope="col" className="px-6 py-3">
                              <span className="sr-only">Eliminar</span>
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
                                        
                                    <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    onClick={() => {EditarUsuario(item.userId,item.nombres,item.apellidos,item.correo,item.rolId);}}>
                                      Editar
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

import { useAsync, useMountEffect } from "@react-hookz/web";
import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { useState } from "react";
import useAuth from "../../auth/authStore";

function Perfil() {

  const correo = useAuth((state) => state.correo);

  const { token,logout} = useAuth((state) => state);
  const url = useAuth((state) => state.url);

  const [Pass, setPass] = useState('');
  const [Visible, setVisible] = useState(true);
  const [Titulo, seTitulo] = useState('Verificar contraseña');


  const { register, handleSubmit,reset } = useForm({
    defaultValues: {
      nueva: null,
      confirmar: null,
    },
  });


  const handleChange = (event) => {
    setPass(event.target.value);
  };

  const InPass = (e) => {
    
    if (Pass) {
      axios.post(url+"/VerificarPass", {
        
          correo: correo,
          pass: Pass,
        
      },{headers: {
        'Authorization': token
      },})
        .then((resp) => {
          if (resp.data.success === true) {
            toast.success("verificado")
            seTitulo("Actualizar contraseña");
            setVisible(false);
          }else{
            toast.error(resp.data.message)
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message)
        });
    
    }else{
      toast.error("Debe llenar los campos")
    }
  };

  const onSubmit = async (data) => {
  
    if(data.confirmar === data.nueva){
    try {
      const resp = await axios({
        url: url+"/ActualizarPass",
        method: "put",
        data: {
          nueva: data.nueva,
          correo: correo,
        },
        
        headers: {
          'Authorization': token
        },
      });
      
      if (resp.data.success === true) {
        toast.success("Actualizacion exitosa")
        setTimeout(function(){ window.location.reload(); }, 1000);
      }else{
        toast.error(resp.data.message);
      }
    } catch (error) {
      
      if ('token' in error.response.data){
        logout();
      }else{
        toast.error(error.message);
      }
    }
  }else{
    toast.error("Las contraseñas no coinciden");
    reset();
  }
  };

  return (
    <AppLayout>
   
   <div className="bg-base-300 w-full h-[90vh] flex justify-center items-center">
        <div className="card w-[500px] bg-base-100 shadow-xl  lg:h-fit">
          
          <div className="card-body  p-20 w-full flex flex-col justify-right">
            <div>
              <h2 className="card-title font-bold text-4xl text-black justify-center">
          
                Editar Contraseña
              </h2>
              <div className="divider my-1 mt-2"></div>
            </div>
            <div className="container mx-auto">
            <h2 className="card-title text-3xl text-black justify-center mt-4">
          
            {Titulo}
            </h2>
             
                
                <div className="flex items-center justify-center">
                  
                  
                    <div className="flex flex-col -mx-1 mb-11">
                      
                    { Visible && <div>
                        <h3 className=" mt-12 ">Ingresar contraseña actual</h3>
                       
                        <input className="appearance-none block w-72 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                         type="password"  value={Pass}  onChange={handleChange}/>
                        <div className="flex justify-center">
                          <button className="btn bg-blue-500 text-white w-fit "
                          onClick={InPass}>
                            Verificar
                          </button>
                        </div>
                        
                      </div>}
                    { !Visible && <form onSubmit={handleSubmit(onSubmit)}>
                      
                      <div className="w-fit mt-6">
                        <h3>Ingresar nueva contraseña</h3>
                        <input className="appearance-none block w-72 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        type="password" placeholder="Nueva contraseña" required {...register("nueva", { required: true })}/>

                        <h3>Confirmar contraseña</h3>
                        <input className="appearance-none block w-72 bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                        type="password" placeholder="Confirmar contraseña" required {...register("confirmar", { required: true })}/>
                      </div>
                      <div className="flex justify-center">
                      <button className="btn bg-blue-500 text-white w-fit mt-6 "  type="submit">
                        Actualizar
                      </button>
                      </div>
                </form> }
                    </div>
                  
                </div>
              
              
            </div>
        </div>
      </div>
    </div>
    <Toaster />
    </AppLayout>
  );
}

export default Perfil;

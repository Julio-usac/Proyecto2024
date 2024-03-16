import { FiEye, FiEyeOff} from "react-icons/fi";
import { MdStorage} from "react-icons/md";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import useAuth from "../auth/authStore";
import { Link, Navigate, useNavigate } from "react-router-dom";
import imagen from '../assets/login-side.jpg';
import imagen2 from '../assets/garan.jpg';


const Login = () => {


  //------------------------------- Retornar funciones del Storage -----------------------------------------

  const [showPassword,setShowPassword] = useState(false);
  const login = useAuth((state) => state.login);
  const url = useAuth((state) => state.url);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);


 //----------------------------------Declaracion de datos a enviar en el formulario-----------------------------------------
 

  const { register, handleSubmit } = useForm({
    defaultValues: {
      tipoCuenta: false,
      email: "",
      password: "",
    },
  });

//-------------------------------------- Funciones utilizadas ---------------------------------------------

//Funcion para navegar a otros modulos
  const navigate = useNavigate();

 //Condicion para verificar si el usuario ya se encuentra logeado

  if (isAuthenticated) {
    console.log("isAuthenticated", isAuthenticated);
    return <Navigate to="/" />;
  }


  //Funcion para enviar los datos del formulario

  const onSubmit = async (data) => {
    
    try {
      const resp = await axios({
        url: url+"/Login",
        method: "post",
        data: {
          correo: data.email,
          pass: data.password,
        },
      });
      
      if (resp.data.success == true) {
        login(resp.data.token);
        navigate("/");
      }
    } catch (error) {
      toast.error("Error en las credenciales");
      
    }
  };
  
//----------------------------------------------HTML-----------------------------------------------------

  return (
    <div className="bg-base-300 w-full h-[100vh] flex justify-center items-center">
      <div className="card lg:card-side bg-base-100 shadow-xl max-w-screen-lg lg:h-fit">
        <div style={{ backgroundImage: `url(${imagen})` }} className={`lg:max-w-xs  w-96 h-32 lg:h-auto bg-origin-border bg-center bg-cover rounded-t-xl lg:rounded-tr-none lg:rounded-l-xl`}></div>
        <div className="card-body p-6 w-96 flex flex-col justify-between">
          <div>
          <h2 className="card-title justify-center bg-origin-border">
            <figure >
            <img src={imagen2}  style={{ width: '260px', height: '80px' }}/>
          </figure>
          <div style={{ height: '120px' }} />
          </h2>
          
            <h2 className="card-title font-semibold text-3xl text-blue-500 ">
              
              Inicio de Sesion
            </h2>
            <div className="divider my-1 mt-2"></div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 flex-1"
          >
            <div className="form-control w-full max-w-xs">
              <label className="label pl-0">
                <span className="text-xl">Usuario</span>
              </label>
              <input
                type="text"
                required
                className="input input-primary w-full max-w-xs "
                {...register("email", { required: true })}
              />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label pl-0">
                <span className="text-xl">Contraseña</span>
              </label>
              <div className="flex gap-1">
                <input
                  type={showPassword? 'text' : 'password'}
                  required
                  className="input input-primary w-full max-w-xs join-item focus:ring-0 focus"
                  {...register("password", { required: true })}
                />
                <label className="btn swap swap-rotate">
                  <input type="checkbox" onClick={()=> setShowPassword(!showPassword)} />
                  
                  <FiEye className="swap-on"/>
                  <FiEyeOff className="swap-off" />
                </label>
              </div>
            </div>
             
          <div style={{ height: '100px' }} />
            <div className="card-actions items-center justify-center">
              <button className="btn bg-blue-500 text-white"  type="submit">
                Iniciar sesión
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
    
  );
};

export default Login;

import { FiEye, FiEyeOff} from "react-icons/fi";
import { MdStorage} from "react-icons/md";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios";
import useAuth from "../auth/authStore";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Login = () => {


  //------------------------------- Retornar funciones del Storage -----------------------------------------


  const login = useAuth((state) => state.login);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);


 //----------------------------------Declaracion de datos a enviar en el formulario-----------------------------------------
 

  const { register, handleSubmit } = useForm({
    defaultValues: {
      tipoCuenta: false,
      email: "",
      password: "",
      url: "http://localhost:9095/Login",
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
        url: "http://localhost:9095/Login",
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
      console.log(error);
      toast.error("Error en las credenciales");
      
    }
  };
  
//----------------------------------------------HTML-----------------------------------------------------

  return (
    <div className="bg-base-300 w-full h-[100vh] flex justify-center items-center">
      <div className="card lg:card-side bg-base-100 shadow-xl max-w-screen-lg lg:h-fit">
        <div className="lg:max-w-xs bg-[url('./src/assets/login-side.jpg')]  w-96 h-32 lg:h-auto bg-origin-border bg-center bg-cover rounded-t-xl lg:rounded-tr-none lg:rounded-l-xl "></div>
        <div className="card-body p-6 w-96 flex flex-col justify-between">
          <div>
          <h2 className="card-title justify-center bg-origin-border">
            <figure >
            <img src='./src/assets/garan.jpg'  style={{ width: '260px', height: '80px' }}/>
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
                  type="password"
                  required
                  className="input input-primary w-full max-w-xs join-item focus:ring-0 focus"
                  {...register("password", { required: true })}
                />
                <label className="btn swap swap-rotate">
                  <input type="checkbox" />
                  <FiEye className="swap-off" />
                  <FiEyeOff className="swap-on" />
                </label>
              </div>
            </div>
             {/*
            <div className="form-control">
              <label className="label cursor-pointer flex gap-4 flex-col w-full justify-start items-start">
                <span className="label-text">Conexión a grupo:</span>
                <select
                  className="select select-bordered w-full max-w-xs"
                  {...register("url")}
                  defaultValue={data.g6}
                >
                  <option value={data.g1}>Grupo 1</option>
                  <option value={data.g2}>Grupo 2</option>
                  <option value={data.g3}>Grupo 3</option>
                  <option value={data.g4}>Grupo 4</option>
                  <option value={data.g5}>Grupo 5</option>
                  <option value={data.g6}>
                    Grupo 6
                  </option>
                  <option value={data.g7}>Grupo 7</option>
                  <option value={data.g8}>Grupo 8</option>
                  <option value={data.g9}>Grupo 9</option>
                  <option value={data.g10}>Grupo 10</option>
                  <option value={data.g11}>Grupo 11</option>
                  <option value={data.g12}>Grupo 12</option>
                  <option value={data.g13}>Grupo 13</option>
                </select>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer flex w-fit gap-4">
                <span className="label-text">Proveedor</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  {...register("tipoCuenta")}
                />
              </label>
            </div>
          */}
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

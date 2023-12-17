import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import useEditar from '../store/editarStore';
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import useAuth from "../auth/authStore";


const ModelEditar = () => {

  //--------------------------------------------Declaracion de estados-----------------------------------------

  const [tipo, setTipo] = useState([]);
  const [ub, setUb] = useState([]);
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);


//--------------------------------------------Retornar datos del bien a editar-----------------------------------------
 
    const mid = useEditar((state) => state.id);
    const mfecha = useEditar((state) => state.fecha);
    const mcodigo = useEditar((state) => state.codigo);
    const mcuenta = useEditar((state) => state.cuenta);
    const mmarca = useEditar((state) => state.marca);
    const mmodelo = useEditar((state) => state.modelo);
    const mserie = useEditar((state) => state.serie);
    const mprecio = useEditar((state) => state.precio);
    const mcantidad= useEditar((state) => state.cantidad);
    const mubicacion= useEditar((state) => state.ubicacion);
    const mcategoria= useEditar((state) => state.tipo);
    const mimage= useEditar((state) => state.imagen);
    const mdescripcion = useEditar((state) => state.descripcion);

//--------------------------------------------Retornar ID y token del usuario que realiza el cambio-----------------------------------------
 
    const { id } = useAuth((state) => state);
    const { token,logout} = useAuth((state) => state);

    const {borrarDatos}= useEditar((state) => state);


   
//--------------------------------------------Declaracion de datos a enviar en el formulario-----------------------------------------
 
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      fechaco: null,
      cuenta: "",
      codigo: "",
      marca: "",
      cantidad: null,
      modelo: "",
      serie: "",
      imagen: "",
      precio: null,
      descripcion: "",
      categoria: null,
      ubicacion: null,
      url: "http://localhost:9095/EditarBien",
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
      let result = await fetch("http://localhost:9095/ubicacion");
      result = await result.json();
      setUb(result.message)
    };
    load();
  },[]);

  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setImageData(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {

    if(data.fechaco || data.cuenta || data.codigo || data.marca || data.cantidad || data.modelo || data.serie || data.precio || imageData || data.descripcion || data.categoria || data.ubicacion){
      try {
        const resp = await axios({
          url: "http://localhost:9095/EditarBien",
          method: "post",
          data: {
            id: mid,
            fechaco: (data.fechaco)?data.fechaco:mfecha,
            cuenta:  (data.cuenta)?data.cuenta:mcuenta,
            codigo: (data.codigo)? data.codigo:mcodigo,
            marca:  (data.marca)? data.marca:mmarca,
            cantidad: (data.cantidad)? data.cantidad:mcantidad,
            modelo:  (data.modelo)? data.modelo:mmodelo,
            serie:  (data.serie!="")? data.serie:mserie,
            imagen:   (imageData)? imageData:mimage,
            precio:  (data.precio)? data.precio:mprecio,
            descripcion:  (data.descripcion!="")? data.descripcion:mdescripcion,
            categoria:  (data.categoria && data.categoria!="Seleccionar")? data.categoria:mcategoria,
            ubicacion:  (data.ubicacion && data.ubicacion!="Seleccionar")? data.ubicacion:mubicacion,
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
                usuario: id,
                usuarioaf: null,
                bienaf: mid,
                tipo: 2,
                afectado:true,
              },
            });
          } catch (error) {
            console.log(error)
          }
          window.my_modal_2.close();
          setTimeout(function(){ window.location.reload(); }, 1000);
        }else{
          toast.error(resp.data.message)
        }
      } catch (error) {
        console.log(error)
        if ('token' in error.response.data){
          logout();
        }else{
          
          toast.error(error.response.data.message);
        }
      }
    }else{
      toast.error("No se han ingresado nuevos datos")
    }
    
  };
    
    return (
        <dialog id="my_modal_2" className="modal">
             <div className="card  bg-base-100 shadow-xl max-w-screen-2xl lg:h-fit">
             <div className="flex justify-end mt-3 px-3">
          <button
                        className="flex bg-red-500 text-white px-4 py-2 rounded w-fit"
                        onClick={(e) => {
                            e.preventDefault();
                            reset();
                            borrarDatos();
                            window.my_modal_2.close();
                        }}
                    >
                        X
                    </button>
        </div>
             <div className="card-body p-6 w-full flex flex-col justify-between">
            <div>
              <h2 className="card-title font-semibold text-4xl text-blue-600 justify-center">
          
                Editar bienes
              </h2>
              <div className="divider my-1 mt-2"></div>
            </div>
            <div className="container mx-auto">
              <div className="flex justify-center space-x-4"></div>
              <form onSubmit={handleSubmit(onSubmit)}>
                
                <div className="flex items-center justify-center">

                  <div className="flex flex-wrap -mx-3 mb-11">
                    
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Codigo de inventario</h3>
                      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      type="text" {...register("codigo", { required: false })} placeholder={mcodigo}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>No.cuenta</h3>
                      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      type="text" {...register("cuenta", { required: false })} placeholder={mcuenta}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Fecha de compra</h3>
                      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      type="date"  {...register("fechaco", { required: false })}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Marca</h3>
                      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" 
                       placeholder={mmarca} {...register("marca", { required: false })}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Modelo</h3>
                      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" 
                      placeholder={mmodelo}  {...register("modelo", { required: false })}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Serie</h3>
                      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" 
                      placeholder={mserie} {...register("serie", { required: false })}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Precio</h3>
                      <input type="number" step="0.01" className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      placeholder={mprecio} {...register("precio", { required: false })}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Ubicacion</h3>
                      <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      defaultValue={null} {...register("ubicacion", { required: false })}>
                        <option value={null} >Seleccionar</option>
                        {
                          ub.map((item)=>
                            
                            <option key={item.id} value={item.id}>{item.nombre}</option>
                          )
                        }
                        </select>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Tipo</h3>
                      <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       defaultValue={mcategoria} {...register("categoria", { required: false })}>
                         <option value={null} >Seleccionar</option>
                        {
                          tipo.map((item)=>
                            <option key={item.catId} value={item.catId}>{item.nombre}</option>
                          )
                        }
                        </select>  
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Cantidad</h3>
                      <input  type="number" className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      placeholder={mcantidad} {...register("cantidad", { required: false })}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Descripcion</h3>
                      <textarea  className="resize border w-full rounded-md focus:outline-none focus:shadow-outline py-2 px-3 text-gray-700 leading-tight" id="textarea" rows="4"
                       placeholder={mdescripcion} {...register("descripcion", { required: false })}></textarea>
                    </div>
                  </div>
    
                  <div className="border-r-2 border-gray-400 px-4 h-80 "></div>
                  <div className="px-4"></div>
                  <div className="flex flex-col items-center justify-center bg-grey-lighter ">
      {image && <img src={image} alt="Selected"  style={{ width: '300px', height: '270px' }} />}
      <label className="w-64 flex flex-col items-center px-4 py-6 bg-red-600 text-white rounded-lg shadow-lg tracking-wide uppercase border border-red-600 cursor-pointer hover:bg-red-200 hover:text-red-600">
       <span className="mt-2 text-base leading-normal">Seleccionar imagen</span>
        <input type='file' id="imageInput" accept="image/*" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
                </div>
  
                <button
                    className="btn bg-blue-500 text-white w-fit"  type="submit"
                    >
                    Ingresar activo
                </button>
                
              </form>
            </div>

        </div>
        </div>
        <Toaster />
        </dialog>
    );
};

export default ModelEditar;

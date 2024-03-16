import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import useAuth from "../../auth/authStore";


function InBien() {

//-----------------------------------------Retornar informacion del usuario-----------------------------------------

  const { id } = useAuth((state) => state);
  const { token,logout} = useAuth((state) => state);
  const url = useAuth((state) => state.url);

//--------------------------------------------Declaracion de estados-----------------------------------------

  const [tipo, setTipo] = useState([]);
  const [ub, setUb] = useState([]);
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState('');

  //--------------------------------------------Declaracion de datos a enviar en el formulario-----------------------------------------
 
  const { register, handleSubmit } = useForm({
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
      tarjeta: null,
      ubicacion: null,
    },
  });

//Funcion para retornar las categorias de los bienes al cargar el modulo

  useEffect(() => {
    const load = async () => {
      let result = await fetch(url+"/tipo");
      result = await result.json();
      setTipo(result.message)
    };
    load();
  },[]);

//Funcion para retornar las ubicaciones de los bienes al cargar el modulo

  useEffect(() => {
    const load = async () => {
      let result = await fetch(url+"/ubicacion");
      result = await result.json();
      setUb(result.message)
    };
    load();
  },[]);
  
  //Funcion para obtener la imagen

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

  //Funcion para enviar los datos del formulario

  const onSubmit = async (data) => {
    
    if(imageData.length<1000000){
      if (data.categoria!=null){
        try {
          const resp = await axios({
            url: url+"/InBien",
            method: "post",
            data: {
              fechaco: data.fechaco,
              cuenta:  data.cuenta,
              codigo:  data.codigo,
              marca:  data.marca,
              cantidad:  data.cantidad,
              modelo:  data.modelo,
              serie:  data.serie,
              imagen:  imageData,
              precio:  data.precio,
              descripcion:  data.descripcion,
              categoria:  data.categoria,
              tarjeta:  data.tarjeta,
              ubicacion:  data.ubicacion,
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
                  usuario: id,
                  empleado: null,
                  bienaf: null,
                  tipo: 1,
                  afectado:true,
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
          console.log(error)
          if ('token' in error.response.data){
            logout();
          }else{
            
            toast.error(error.response.data.message);
          }
        }
      }else{
        toast.error("Debe seleccionar un tipo de bien");
      }
    }else{
      toast.error("La imagen a ingresar debe ser menor o igual a 700 KB");
    }
  };

//----------------------------------------------HTML-----------------------------------------------------

  return (
    <AppLayout>
      
      <div className="bg-base-300 w-full h-[100vh] flex justify-center items-center">
        <div className="flex card bg-base-100 shadow-xl max-w-screen-2xl lg:h-fit">
          
          <div className="card-body p-6 w-full flex flex-col justify-between">
            <div>
              <h2 className="card-title font-semibold text-4xl text-blue-600 justify-center">
          
                Ingresar Bienes
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
                      type="text" {...register("codigo", { required: false })}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>No.cuenta</h3>
                      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      type="text" {...register("cuenta", { required: false })}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Fecha de compra</h3>
                      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                      type="date" placeholder="dd/mm/yyyy" {...register("fechaco", { required: false })}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Marca</h3>
                      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder=""
                      {...register("marca", { required: false })}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Modelo</h3>
                      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder=""
                      {...register("modelo", { required: false })}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Serie</h3>
                      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" type="text" placeholder=""
                      {...register("serie", { required: false })}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Precio</h3>
                      <input type="number" step="0.01" className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" placeholder=""
                      {...register("precio", { required: false })}/>
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
                      <select required id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       defaultValue={null} {...register("categoria", { required: false })}>
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
                      <input required type="number" className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white"  placeholder=""
                      {...register("cantidad", { required: true })}/>
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-9 md:mb-0">
                      <h3>Descripcion</h3>
                      <textarea required className="border-2 border-blue-500  bg-gray-100 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-300  py-2 px-3 text-gray-700  w-[770px]" id="textarea" rows="4" placeholder="Descripcion..."
                       {...register("descripcion", { required: true })}></textarea>
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
    </div>
    <Toaster />
    </AppLayout>
  );
}

export default InBien;

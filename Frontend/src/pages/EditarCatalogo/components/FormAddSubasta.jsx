import axios from "axios";
import { useForm } from "react-hook-form";
import useAuth from "../../../auth/authStore";

const FormAddSubasta = () => {
  const token = useAuth((state) => state.token);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      nombre: "",
      imagen: "",
      precio: "",
      categoria: "",
      fecha: "",
      idprov: "",
    },
  });

  // const [, actions] = useAsync(() => {
  //     return axios.post('https://jsonplaceholder.typicode.com/todos/1', {
  //         nombre: nombres,
  //         apellido: apellidos,
  //         correo: email,
  //         pass: password,
  //         celular: telefono,
  //         foto: url,
  //         admin: 0,
  //     });
  // }, 'post');

  const onSubmit = async (data) => {
    console.log(data);
    let { nombre, imagen, precio, categoria, fecha } = data;
    // post data with axios
    const resp = await axios({
      url: "http://127.0.0.1:9099/subasta/agregarproducto",
      method: "post",
      data: {
        nombre,
        imagen,
        precio,
        cat: categoria,
        fecha,
        token,
      },
    });
    if (resp.status === 200) {
      alert("Se ha registrado correctamente");
    } else {
      alert("Ha ocurrido un error");
    }
  };

  return (
    <dialog id="modalSubasta" className="modal">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-semibold">Agregar subasta</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4 flex-1"
          >
            <div className="form-control w-full col-span-2">
              <label className="label pl-0">
                <span className="label-text">Nombre</span>
              </label>
              <input
                type="text"
                required
                className="input input-secondary w-full "
                {...register("nombre", { required: true })}
              />
            </div>
            <div className="form-control w-full col-span-2">
              <label className="label pl-0">
                <span className="label-text">Imagen</span>
              </label>
              <input
                type="text"
                required
                className="input input-secondary w-full join-item"
                {...register("imagen", { required: true })}
              />
            </div>
            <div className="form-control w-full  col-span-2">
              <label className="label pl-0">
                <span className="label-text">Precio</span>
              </label>
              <input
                type="number"
                required
                className="input input-secondary w-full join-item"
                {...register("precio", { required: true })}
              />
            </div>
            <div className="form-control w-full  col-span-2">
              <label className="label pl-0">
                <span className="label-text">Categoria</span>
              </label>
              <input
                type="text"
                required
                className="input input-secondary w-full join-item"
                {...register("categoria", { required: true })}
              />
            </div>

            <div className="form-control w-full col-span-2">
              <label className="label pl-0">
                <span className="label-text">Fecha</span>
              </label>
              <input
                type="date"
                required
                className="input input-secondary w-full join-item focus:ring-0 focus"
                {...register("fecha", { required: true })}
              />
            </div>
            <div className="card-actions mt-4 col-span-2 justify-between">
              <button className="btn btn-secondary btn-md" type="submit">
                Guardar subasta
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default FormAddSubasta;

import axios from "axios";
import { useForm } from "react-hook-form";
import useAuth from "../../auth/authStore";

const ModalAgregarTarjeta = () => {
  const id = useAuth((state) => state.id);
  const url = useAuth((state) => state.url);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      numero: "",
      nombre: "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    const { numero, nombre } = data;
    const resp = await axios({
      url: url + "/Tarjeta/Crear",
      method: "post",
      data: {
        notarjeta: numero,
        nombre: nombre,
        id: id,
      },
    });
    if (resp.status === 200) {
      alert("Se ha registrado correctamente");
    } else {
      alert("Ha ocurrido un error");
    }
  };

  return (
    <dialog id="modal_tarjeta" className="modal">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-semibold">Agregar nueva tarjeta</h1>
          <div className="divider my-0"></div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4 flex-1"
          >
            <div className="form-control w-full col-span-2">
              <label className="label pl-0">
                <span className="label-text">Numero de tarjeta</span>
              </label>
              <input
                type="text"
                required
                className="input input-primary w-full "
                {...register("numero", { required: true })}
              />
            </div>

            <div className="form-control w-full col-span-2">
              <label className="label pl-0">
                <span className="label-text"> Nombre </span>
              </label>
              <input
                type="text"
                required
                className="input input-primary w-full "
                {...register("nombre", { required: true })}
              />
            </div>

            <div className="card-actions mt-4 col-span-2 justify-between">
              <button className="btn btn-secondary btn-md" type="submit">
                Agregar tarjeta
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalAgregarTarjeta;

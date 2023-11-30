import axios from "axios";
import { useForm } from "react-hook-form";
import useAuth from "../../auth/authStore";
import useSubasta from "../../store/subastaStore";
const ModalSubasta = () => {
  const token = useAuth((state) => state.token);
  const idsub= useSubasta((state) => state.subastaid);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      oferta: "",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    const {oferta} = data;
    const resp = await axios({
      url: "http://127.0.0.1:9099/subasta/setOferta",
      method: "post",
      data: {
        oferta: oferta,
        subasta: idsub,
        token: token,
      },
    });
    if (resp.status === 200) {
      alert("Se ha registrado correctamente");
    } else {
      alert("Ha ocurrido un error");
    }
  };

  return (
    <dialog id="modal_subasta" className="modal">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-semibold">Hacer una oferta</h1>
          <div className="divider my-0"></div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4 flex-1"
          >
            <div className="form-control w-full col-span-2">
              <label className="label pl-0">
                <span className="label-text">Agregar cantidad (Q)</span>
              </label>
              <input
                type="text"
                required
                className="input input-primary w-full "
                {...register("oferta", { required: true })}
              />
            </div>
           

            <div className="card-actions mt-4 col-span-2 justify-between">
              <button className="btn btn-secondary btn-md" type="submit" 
                        onClick={() => {
                            window.modal_subasta.close();
                        }}>
                Enviar oferta
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ModalSubasta;

import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import data from "../../../ips.json";
const Proveedor = () => {
  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      empresa: "",
      direccion: "",
      email: "",
      password: "",
      confirmPassword: "",
      url: data.g6,
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    const { empresa, direccion, email, password } = getValues();
    // post data with axios
    const resp = await axios({
      url: data.url + "/Proveedor/Registrar",
      method: "post",
      data: {
        Nombre_Empresa: empresa,
        Direccion: direccion,
        correo: email,
        pass: password,
      },
    });
    if (resp.data.success === true) {
      alert("Se ha registrado correctamente");
    } else {
      alert("Ha ocurrido un error");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-4 flex-1"
      >
        <div className="form-control w-full col-span-2">
          <label className="label pl-0">
            <span className="label-text">Nombre de la empresa</span>
          </label>
          <input
            type="text"
            required
            className="input input-primary w-full "
            {...register("empresa", { required: true })}
          />
        </div>
        <div className="form-control w-full col-span-2">
          <label className="label pl-0">
            <span className="label-text">Dirección física</span>
          </label>
          <input
            type="text"
            required
            className="input input-primary w-full join-item"
            {...register("direccion", { required: true })}
          />
        </div>
        <div className="form-control w-full  col-span-2">
          <label className="label pl-0">
            <span className="label-text">Correo electrónico</span>
          </label>

          <input
            type="text"
            required
            className="input input-primary w-full join-item"
            {...register("email", { required: true })}
          />
        </div>

        <div className="form-control w-full">
          <label className="label pl-0">
            <span className="label-text">Contraseña</span>
          </label>
          <input
            type="password"
            required
            className="input input-primary w-full join-item focus:ring-0 focus"
            {...register("password", { required: true })}
          />
        </div>
        <div className="form-control w-full">
          <label className="label pl-0">
            <span className="label-text">Confirmar contraseña</span>
          </label>
          <input
            type="password"
            required
            className="input input-primary w-full join-item focus:ring-0 focus"
            {...register("confirmPassword", { required: true })}
          />
        </div>
        <div className="form-control w-full col-span-2">
          <label className="label cursor-pointer flex gap-4 flex-col w-full justify-start items-start">
            <span className="label-text">Conexión a grupo:</span>
            <select
              className="select select-bordered w-full"
              {...register("url")}
              defaultValue={data.g6}
            >
              <option value={data.g1}>Grupo 1</option>
              <option value={data.g2}>Grupo 2</option>
              <option value={data.g3}>Grupo 3</option>
              <option value={data.g4}>Grupo 4</option>
              <option value={data.g5}>Grupo 5</option>
              <option value={data.g6}>Grupo 6</option>
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
        <div className="card-actions mt-4 col-span-2 flex justify-between">
          <Link to="/login" className="link">
            Iniciar sesión
          </Link>
          <button className="btn btn-primary btn-md" type="submit">
            Registrarse
          </button>
        </div>
      </form>
    </>
  );
};

export default Proveedor;

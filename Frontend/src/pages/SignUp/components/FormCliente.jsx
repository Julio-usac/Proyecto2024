import axios from "axios";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";
import data from "../../../ips.json";
const Cliente = () => {
  const [imageData, setImageData] = useState("");

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      nombres: "",
      apellidos: "",
      email: "",
      password: "",
      confirmPassword: "",
      telefono: "",
      url: data.g6,
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setImageData(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

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
    const { nombres, apellidos, email, password, telefono } = getValues();

    console.log(imageData);
    // post data with axios

    const resp = await axios({
      url: data.url + "/Cliente/Registrar",
      method: "post",
      data: {
        nombre: nombres,
        apellido: apellidos,
        correo: email,
        pass: password,
        cel: telefono,
        imagen: imageData,
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
        <div className="form-control w-full col-span-1">
          <label className="label pl-0">
            <span className="label-text">Nombres</span>
          </label>
          <input
            type="text"
            required
            className="input input-primary w-full "
            {...register("nombres", { required: true })}
          />
        </div>
        <div className="form-control w-full col-span-1">
          <label className="label pl-0">
            <span className="label-text">Apellidos</span>
          </label>
          <input
            type="text"
            required
            className="input input-primary w-full join-item"
            {...register("apellidos", { required: true })}
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
        <div className="form-control w-full  col-span-2">
          <label className="label pl-0">
            <span className="label-text">Fotografia</span>
          </label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input w-full max-w-xs"
          />
        </div>

        <div className="form-control w-full col-span-2">
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

        <div className="form-control w-full col-span-2">
          <label className="label pl-0">
            <span className="label-text">Número de teléfono</span>
          </label>

          <input
            type="text"
            required
            className="input input-primary w-full join-item"
            {...register("telefono", { required: true })}
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
        <div className="card-actions mt-4 col-span-2 justify-between">
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

export default Cliente;

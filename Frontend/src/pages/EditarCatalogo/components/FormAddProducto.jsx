import axios from "axios";
import { useForm } from "react-hook-form";
import useAuth from "../../../auth/authStore";
import { useState } from "react";

const FormAddProducto = () => {
  const id = useAuth((state) => state.id);
  const [imageData, setImageData] = useState("");
  const url = useAuth((state) => state.url);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      nombre: "",
      precio: "",
      stock: "",
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

  const onSubmit = async (data) => {
    console.log(data);

    const { nombre, precio, stock, idproducto } = data;
    // post data with axios
    const resp = await axios({
      url: url + "/Proveedor/CrearProducto",
      method: "post",
      data: {
        Nombre_Producto: nombre,
        Precio: precio,
        Cantidad_Producto: stock,
        Imagen: imageData,
        id: id,
        IdCategoria: 1,
      },
    });
    if (resp.data.success === true) {
      alert("Se ha registrado correctamente");
    } else {
      alert("Ha ocurrido un error");
    }
  };

  return (
    <dialog id="modalladdproducto" className="modal">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-semibold">Agregar producto</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4 flex-1"
          >
            <div className="form-control w-full col-span-2">
              <label className="label pl-0">
                <span className="label-text">Nombre del producto</span>
              </label>
              <input
                type="text"
                required
                className="input input-primary w-full "
                {...register("nombre", { required: true })}
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
                <span className="label-text">Precio</span>
              </label>
              <input
                type="number"
                required
                className="input input-primary w-full join-item"
                {...register("precio", { required: true })}
              />
            </div>
            <div className="form-control w-full  col-span-2">
              <label className="label pl-0">
                <span className="label-text">Cantidad en stock</span>
              </label>

              <input
                type="number"
                required
                className="input input-primary w-full join-item"
                {...register("stock", { required: true })}
              />
            </div>
            <div className="card-actions mt-4 col-span-2 justify-between">
              <button className="btn btn-primary btn-md" type="submit">
                Guardar producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default FormAddProducto;

import { useAsync, useMountEffect } from "@react-hookz/web";
import useAuth from "../../auth/authStore";
import AppLayout from "../../layout/AppLayout";
import useCarrito from "../../store/carritoStore";
import axios from "axios";
import ModalAgregarTarjeta from "./ModalAgregarTarjeta";
import { useForm } from "react-hook-form";
import { useNavigation } from "react-router-dom";

const Pago = () => {
  const id = useAuth((state) => state.id);
  const { carrito, vaciar } = useCarrito((state) => state);
  const url = useAuth((state) => state.url);
  const navigation = useNavigation();

  const { register, getValues } = useForm({
    defaultValues: {
      tarjeta: "",
    },
  });

  const [state, actions] = useAsync(() => {
    return axios({
      url: url + "/Tarjeta/Listado",
      method: "post",
      data: {
        idCliente: id,
      },
    });
  });

  const handleCompra = async () => {
    let tarjeta = getValues().tarjeta;
    console.log(tarjeta);
    if (tarjeta === "") {
      alert("Debe seleccionar una tarjeta");
      return;
    }
    console.log("carrito", carrito);
    const resp = await axios({
      url: url + "/Cliente/Comprar",
      method: "post",
      data: {
        id: id,
        codTarjeta: parseInt(tarjeta),
        productos: carrito.map((item) => {
          return {
            idProducto: item.producto.IdProducto,
            Cantidad: item.cantidad,
          };
        }),
        total: carrito.reduce((a, b) => a + b.producto.Precio * b.cantidad, 0),
      },
    });
    if (resp.status === 200) {
      alert("Compra realizada correctamente");
      vaciar();
      navigation("/");
    } else {
      alert("Error al realizar la compra");
    }
  };

  useMountEffect(actions.execute);

  if (state.status === "success") {
    console.log(state.result);
  }

  return (
    <AppLayout>
      <ModalAgregarTarjeta />
      <div className="h-screen flex flex-col items-center justify-center w-full md:max-w-md p-8 md:p-0 gap-8 py-12">
        <div className="w-full md:max-w-md">
          <p className="font-semibold text-2xl base-content text-center mb-4">
            Seleccionar tarjeta
          </p>
          <div className="flex items-center gap-2 w-full">
            <select
              className="select select-secondary flex-1"
              {...register("tarjeta", { required: true })}
            >
              <option disabled selected>
                Seleccionar tarjeta
              </option>
              {state.status === "success" &&
                state.result.data.message.map((item, index) => {
                  return (
                    <option key={index} value={item.idTarjeta}>
                      {item.notarjeta}
                    </option>
                  );
                })}
            </select>
            <button
              className="btn btn-primary text-2xl"
              onClick={() => {
                window.modal_tarjeta.showModal();
              }}
            >
              +
            </button>
          </div>
        </div>
        <div className="divider m-0"></div>
        <h1 className="text-xl font-semibold badge badge-secondary py-4 p-6">
          Confirmar compra
        </h1>
        <div className="w-full md:max-w-md">
          <div>
            {carrito.map((item, index) => {
              return (
                <div key={index}>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      Producto: {item.producto.Nombre_Producto} - Cantidad:{" "}
                      {item.Cantidad} - Precio: Q{item.producto.Precio}
                    </p>
                  </div>
                  <div className="divider my-0"></div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-2xl base-content">
                Total: Q
                {carrito.reduce(
                  (a, b) => a + b.producto.Precio * b.cantidad,
                  0
                )}
              </p>
            </div>
          </div>
          <div>
            <button
              className="btn btn-primary w-full mt-4"
              onClick={handleCompra}
            >
              Pagar
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Pago;

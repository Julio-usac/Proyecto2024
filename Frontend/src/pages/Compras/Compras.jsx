import { useAsync, useMountEffect } from "@react-hookz/web";
import useAuth from "../../auth/authStore";
import AppLayout from "../../layout/AppLayout";
import axios from "axios";

const Reportes = () => {
  const token = useAuth((state) => state.token);
  const usuario = useAuth((state) => state.usuario);
  const [state, actions] = useAsync(() => {
    return axios({
      url: "http://127.0.0.1:9096/contabilidad/getcompras",
      method: "post",
      data: {
        token: token,
      },
    });
  });
  useMountEffect(actions.execute);

  if (state.status === "not-executed" || state.status === "loading")
    return (
      <AppLayout>
        <p>Cargando...</p>
      </AppLayout>
    );
  return (
    <AppLayout>
      <div className="flex flex-col gap-4 justify-center card bg-base-100 p-4 w-full max-w-screen-xl mt-8">
        <h1 className="text-2xl font-semibold">Compras realizadas</h1>
        <p className="badge badge-ghost py-3 px-2">Usuario: {usuario.nombre}</p>
        <p className="badge badge-success py-3 px-2">Cantidad de compras: {state.result.data.cantidad}</p>
        <p className="badge badge-info py-3 px-2">Total en ventas: {state.result.data.total}</p>
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>No.</th>
                <th>Fecha</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {state.result &&
                state.result.data.compras.map((item) => (
                  <tr key={item.No}>
                    <td>{item.No}</td>
                    <td>{new Date(item.fecha).toLocaleDateString()}</td>
                    <td>Q{item.total}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reportes;

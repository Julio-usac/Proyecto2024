import { useAsync, useMountEffect } from "@react-hookz/web";
import AppLayout from "../../layout/AppLayout";
import axios from "axios";
import ModalAgregar from "../../components/ModalAgregar";
import useCarrito from "../../store/carritoStore";
import useFav from "../../store/favStore";
import { useState } from "react";
import { useEffect } from "react";
import useAuth from "../../auth/authStore";

function Bitacora() {
  const setProductoSeleccionado = useCarrito(
    (state) => state.setProductoSeleccionado
  );
  const url = useAuth((state) => state.url);

  const agregarFav = useFav((state) => state.agregar);
  const setFav = useFav((state) => state.setProductoSeleccionado);

  const [showButton, setShowButton] = useState(Array(9999).fill(true));

  const toggleButton = (id) => {
    const updatedVisibility = [...showButton];
    updatedVisibility[id] = false;
    setShowButton(updatedVisibility);
  };

  const [state, actions] = useAsync(() => {
    return axios({
      url: "http://localhost:9095/BienUsuario/Tabla",
      method: "get",
    });
  });

  useMountEffect(actions.execute);

  const [Page, setPage] = useState(1);
  const [PageData, setPageData] = useState([]);

  // set the page data when the number of page changes, from the state.result
  useEffect(() => {
    if (state.status === "success") {
      setPageData(state.result.data.mensaje.slice((Page - 1) * 7, Page * 7));
    }
  }, [Page, state.result, state.status]);

  const Cambio = async (data) => {
    
    try {
      const resp = await axios({
        url: "http://localhost:9095/BienUsuario/Tabla",
        method: "post",
        data: {
          inicio: Page,
        },
      });
      console.log(data.mensaje);
      
      if (resp.data.success === true) {
        setPageData(resp.data.mensaje);
      }
    } catch (error) {
      console.log(error);

      alert("Ha ocurrido un error");
    }
  };



  return (
    <AppLayout>

      <h1 class="text-5xl mt-6">Bienes por usuario</h1>

      <div className="w-full max-w-screen-xl px-4 xl:p-0 flex flex-col justify-center">

        <div>
        <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 text-xl dark:text-black">Seleccione un empleado</label>
        <div className="py-4 pt-2 flex justify-between items-center">
          <select id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-60 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        
          <option selected value="US">Julio Roberto Garcia Escalante</option>
          <option value="CA">Canada</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="FR">France</option>
          <option value="DE">Germany</option>
          </select>

          <button
                className="btn btn-success w-fit"
                onClick={() => window.modalSubasta.showModal()}
              >
                Descargar reporte
              </button>
          </div>
          <div style={{ height: '30px' }} />

          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table class="w-full text-sm text-left text-gray-500 dark:text-gray-900">
                  <thead class="text-xm text-gray-700 uppercase bg-gray-50 dark:bg-gray-400 dark:text-gray-800">
                      <tr>
                          <th scope="col" class="px-6 py-3">
                              Fecha compra
                          </th>
                          <th scope="col" class="px-6 py-3">
                              No.cuenta
                          </th>
                          <th scope="col" class="px-6 py-3">
                              Codigo
                          </th>
                          <th scope="col" class="px-6 py-3">
                              Cantidad
                          </th>
                          <th scope="col" class="px-6 py-3">
                              Descripcion
                          </th>
                          <th scope="col" class="px-6 py-3">
                              Ubicacion
                          </th>
                          <th scope="col" class="px-6 py-3">
                              saldo
                          </th>
                          <th scope="col" class="px-6 py-3">
                              <span class="sr-only">Edit</span>
                          </th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                          PageData.map((item)=>
                              <tr class="bg-white border-b dark:bg-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-400">
                                  <th scope="row" class="px-6 py-4 font-medium text-xm text-gray-900 whitespace-nowrap dark:text-black">
                                      {item.fecha_mod}
                                  </th>
                                  <td class="px-6 py-4"> {item.nombres}</td>
                                  <td class="px-6 py-4"> {item.apellidos}</td>
                                  <td class="px-6 py-4"> {item.correo}</td>
                                  <td class="px-6 py-4"> {item.pass}</td>
                                  <td class="px-6 py-4"> {item.estado}</td>
                                  <td class="px-6 py-4"> {item.rol}</td>
                                  <td class="px-6 py-4 text-right">
                                      <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                                  </td>
                              </tr>
                          )
                      }
                  </tbody>
              </table>
              
          </div>
          <button
              className="join-item btn"
              onClick={() => {
                if (Page > 1) {
                  setPage(Page - 1);
                }
              }}
            >
              «
            </button>
            <button className="join-item btn">Pagina {Page}</button>
            <button
              className="join-item btn"
              onClick={() => {
                if (Page >= 1 && Page < state.result.data.mensaje.length / 7) {
                  setPage(Page + 1);
                }
              }}
            >
              »
            </button>
        </div>
      </div>
    </AppLayout>
  );
}

export default Bitacora;

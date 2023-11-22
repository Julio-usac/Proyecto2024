import useFav from "../store/favStore";
import { FiTrash2 } from "react-icons/fi";
import ModelAgregar2 from "./ModelAgregar2";
import useCarrito from "../store/carritoStore";

const Favorito = () => {
  const favorito = useFav((state) => state.favorito);
  const eliminar = useFav((state) => state.eliminar);
  const setProductoSeleccionado = useCarrito(
    (state) => state.setProductoSeleccionado
  );
  return (
    <>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            <span className="badge badge-sm badge-accent indicator-item">
              {favorito.length}
            </span>
          </div>
        </label>
        <div
          tabIndex={0}
          className="mt-3 card card-compact dropdown-content w-96 bg-base-100 shadow z-40"
        >
          <div className="card-body">
            {favorito.map((item, index) => {
              return (
                <div key={index}>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      Producto: {item.producto.Nombre_Producto}
                    </p>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        setProductoSeleccionado(item.producto);
                        eliminar(index);
                        window.my_modal_2.showModal();
                      }}
                    >
                      Agregar
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => eliminar(index)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="divider my-0"></div>
                </div>
              );
            })}
            <span className="text-primary text-xl"></span>
            <div className="card-actions"></div>
          </div>
        </div>
      </div>
      <ModelAgregar2 />
    </>
  );
};

export default Favorito;

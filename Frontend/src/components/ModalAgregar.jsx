import { useState } from 'react';
import useCarrito from '../store/carritoStore';

const ModelAgregar = () => {
    const [cantidad, setCantidad] = useState(0);
    const producto = useCarrito((state) => state.productoSeleccionado);
    const agregar = useCarrito((state) => state.agregar);
    if (!producto) return null;
    return (
        <dialog id="my_modal_1" className="modal">
            <form method="dialog" className="modal-box">
                <h3 className="font-bold text-lg">{producto.Nombre_Producto}</h3>
                <div className="py-4 flex gap-2 ">
                    <div className="badge badge-warning p-3 font-semibold">
                        Stock: {producto.Cantidad}
                    </div>
                    <div className="badge badge-ghost p-3 font-semibold">
                        Precio: {producto.Precio}
                    </div>
                    <div className="badge badge-ghost p-3 font-semibold">
                        Categoria: {producto.Nombre_Categoria}
                    </div>
                </div>
                <div className="join">
                    <p
                        className="join-item btn"
                        onClick={() => {
                            if (cantidad > 0) setCantidad(cantidad - 1);
                        }}
                    >
                        -
                    </p>
                    <p className="join-item btn">{cantidad}</p>
                    <p
                        className="join-item btn"
                        type="radio"
                        name="options"
                        aria-label="Radio 3"
                        onClick={() => {
                            if (cantidad < producto.Cantidad)
                                setCantidad(cantidad + 1);
                        }}
                    >
                        +
                    </p>
                </div>
                <div className="modal-action mt-0">
                    {/* if there is a button in form, it will close the modal */}
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            agregar(producto, cantidad);
                            window.my_modal_1.close();
                        }}
                    >
                        Agregar al carrito
                    </button>
                </div>
            </form>
        </dialog>
    );
};

export default ModelAgregar;

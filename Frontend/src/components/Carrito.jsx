import { Link } from 'react-router-dom';
import useCarrito from '../store/carritoStore';
import { FiTrash2 } from 'react-icons/fi';
const Carrito = () => {
    const carrito = useCarrito((state) => state.carrito);
    const eliminar = useCarrito((state) => state.eliminar);
    return (
        <div className="dropdown dropdown-end z-50">
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
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <span className="badge badge-sm badge-accent indicator-item">
                        {carrito.length}
                    </span>
                </div>
            </label>
            <div
                tabIndex={0}
                className="mt-3 card card-compact dropdown-content w-96 bg-base-100 shadow z-50"
            >
                <div className="card-body z-50">
                    {carrito.map((item, index) => {
                        return (
                            <div key={index}>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold">
                                        Producto: {item.producto.Nombre_Producto} -
                                        Cantidad:
                                        {item.cantidad}
                                    </p>
                                    <a
                                        className="btn btn-error btn-sm"
                                        onClick={() => eliminar(index)}
                                    >
                                        <FiTrash2 />
                                    </a>
                                </div>
                                <div className="divider my-0"></div>
                            </div>
                        );
                    })}
                    <span className="text-primary text-xl">
                        Subtotal: Q
                        {carrito.reduce(
                            (acc, item) =>
                                acc + item.producto.Precio * item.cantidad,
                            0
                        )}
                    </span>
                    <div className="card-actions">
                        <Link
                            className="btn btn-success btn-block"
                            disabled={carrito.length === 0}
                            to="/pago"
                        >
                            Proceder a pago
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carrito;

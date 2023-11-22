import { FiClock, FiPlus } from "react-icons/fi";
import AppLayout from "../../layout/AppLayout";
import useAuth from "../../auth/authStore";
import FormAddProducto from "./components/FormAddProducto";
import FormAddSubasta from "./components/FormAddSubasta";

const EditarCatalogo = () => {
  const tipo = useAuth((state) => state.tipo);
  return (
    <AppLayout>
      <div className="w-full max-w-screen-xl px-4 xl:p-0 flex flex-col justify-center">
        <div className="py-4 pt-8 flex justify-between items-center">
          <h2 className="text-3xl font-semibold">Mis productos</h2>
          <div className="flex gap-2">
            {
              // si el usuario es proveedor, mostrar los botones de agregar producto y agregar subasta
            }

            {tipo === 2 && (
              <button
                className="btn btn-success w-fit"
                onClick={() => window.modalladdproducto.showModal()}
              >
                <FiPlus />
                Agregar producto
              </button>
            )}
            <button
              className="btn btn-secondary w-fit"
              onClick={() => window.modalSubasta.showModal()}
            >
              <FiClock />
              Agregar subasta
            </button>
          </div>
        </div>
        {tipo === "2" && (
          <>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold">
                Productos de compra ahora
              </h2>
              <div className="divider my-0"></div>
            </div>
            <div className="grid grid-cols-4 py-3">
              <div className="card w-96 bg-white">
                <div className="card-body">
                  <h2 className="card-title">Card title!</h2>
                  <p>If a dog chews shoes whose shoes does he choose?</p>
                  <div className="card-actions justify-end">
                    <button className="btn">Buy Now</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="mt-8">
          {/* agregar un titulo de productos de compra ahora y un divider */}
          <h2 className="text-2xl font-semibold">Productos de subasta</h2>
          <div className="divider my-0"></div>
        </div>
        <div className="grid grid-cols-4 py-3">
          <div className="card w-96 bg-white">
            <div className="card-body">
              <h2 className="card-title">Card title!</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
              <div className="card-actions justify-end">
                <button className="btn">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FormAddProducto />
      <FormAddSubasta />
    </AppLayout>
  );
};

export default EditarCatalogo;

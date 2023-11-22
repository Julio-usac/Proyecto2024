import { useAsync, useMountEffect } from "@react-hookz/web";
import AppLayout from "../../layout/AppLayout";
import useAuth from "../../auth/authStore";
import axios from "axios";
import ModalSubasta from "./ModalSubasta";
import useSubasta from "../../store/subastaStore";
import { useState } from "react";
import { useEffect } from "react";

const Subastas = () => {
  const token = useAuth((state) => state.token);
  const setSubastaid = useSubasta(
    (state) => state.setSubastaid
  );


  const [state, actions] = useAsync(() => {
    return axios({
      url: "http://127.0.0.1:9099/subasta/getSubastas",
      method: "post",
      data: {
        token: token,
      },
    });
  });

  useMountEffect(actions.execute);

  const [Page, setPage] = useState(1);
  const [PageData, setPageData] = useState([]);

  // set the page data when the number of page changes, from the state.result
  useEffect(() => {
    if (state.status === "success") {
      setPageData(state.result.data.slice((Page - 1) * 10, Page * 10));
    }
  }, [Page, state.result, state.status]);

  return (
    <AppLayout>
      <div className="h-full">
        <div className="w-full max-w-screen-2xl grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-6 ">
          {state.status === "pending" && <div>loading...</div>}
          {state.status === "rejected" && (
            <div>error: {state.error.message}</div>
          )}
          {state.result &&
            PageData.map((item) => (
              <div className="card w-full bg-base-100 shadow-xl" key={item.id}>
                <figure className="w-full">
                  <img src={item.imagen} />
                </figure>
                <div className="card-body flex justify-between">
                  <h2 className="card-title">{item.nombre} </h2>
                  <div className="flex gap-2 flex-wrap">
                    <div className="badge badge-warning p-3 font-semibold">
                      Fecha limite: {item.fecha.substr(0, 10)}
                    </div>
                    <div className="badge badge-ghost p-3 font-semibold">
                      Precio inicial: {item.precio}
                    </div>
                    <div className="badge badge-ghost p-3 font-semibold">
                      Categoria: {item.categoria}
                    </div>
                    
                  </div>
                  <div className="card-actions justify-end mt-4 grid grid-cols-1">
                    <button
                      className="btn btn-primary "
                      disabled={item.stock == 0}
                      onClick={() => {
                        setSubastaid(item.id);
                        window.modal_subasta.showModal();
                      }}
                    >
                      Ofertar
                    </button>

                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="join w-full h-40 flex pt-5 justify-center">
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
          <button className="join-item btn">Page {Page}</button>
          <button
            className="join-item btn"
            onClick={() => {
              if (Page >= 1 && Page < state.result.data.length / 10) {
                setPage(Page + 1);
              }
            }}
          >
            »
          </button>
        </div>
        <ModalSubasta />
      </div>
    </AppLayout>
  );
};

export default Subastas;

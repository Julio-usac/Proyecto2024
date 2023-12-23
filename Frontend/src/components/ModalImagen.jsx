import { useState } from 'react';
import useImagen from '../store/imgStore';

const ModelImagen = () => {

    //--------------------------------------------Retornar datos de la imagen a mostrar-----------------------------------------
    const imag = useImagen((state) => state.imagen);
    
    //-------------------------------------------------------HTML---------------------------------------------------------
 
    return (
        <dialog id="my_modal_1" className="modal">
            <form  method="dialog" className="modal-box ">
            
   
                <div className="modal-action mt-0 flex flex-col items-center">
                <img src={imag} alt="imagen" />
                    {/* if there is a button in form, it will close the modal */}
                    <button
                        className="btn btn-primary w-fit"
                        onClick={() => {
                            window.my_modal_1.close();
                        }}
                    >
                        Salir
                    </button>
                </div>
                </form>
        </dialog>
    );
};

export default ModelImagen;

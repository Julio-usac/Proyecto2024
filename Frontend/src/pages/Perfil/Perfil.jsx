import useAuth from '../../auth/authStore';
import AppLayout from '../../layout/AppLayout';
import FormCliente from './components/FormCliente';
import FormProveedor from './components/FormProveedor';
const Perfil = () => {
    const usuario = useAuth((state) => state.usuario);
    return (
        <AppLayout>
            <div className="h-screen flex flex-col justify-center items-center w-full">
                <h1 className='text-xl font-semibold'>Editar perfil - {usuario.tipo}</h1>
                <div className='w-full max-w-md'>
                    {usuario.tipo === 'cliente' && <FormCliente />}
                    {usuario.tipo === 'proveedor' && <FormProveedor />}
                </div>
            </div>
        </AppLayout>
    );
};

export default Perfil;

import { useAsync, useMountEffect } from '@react-hookz/web';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import useAuth from '../../../auth/authStore';

const Proveedor = () => {

    const token = useAuth((state) => state.token);

    const [state, actions] = useAsync(() => {
        return axios({
            url: 'http://127.0.0.1:9092/proveedor/readProveedor',
            method: 'post',
            data: {
                token: token,
            },
        });
    });

    useMountEffect(actions.execute);

    const { register, handleSubmit, getValues, setValue } = useForm({
        defaultValues: {
            empresa: 'state.result.',
            direccion: '',
            email: '',
            url: '',
            password: '',
            confirmPassword: '',
            telefono: '',
        },
    });


    if (state.status === 'success') {
        console.log('perfil usuario', state.result);
        setValue('empresa', state.result.data[0].nombre);
        setValue('direccion', state.result.data[0].direccion);
        setValue('email', state.result.data[0].correo);
        setValue('url', state.result.data[0].foto);
    }

    const onSubmit = async (data) => {
        console.log(data);
        const { empresa, direccion, email, password, telefono, url } =
            getValues();
        // post data with axios
        const resp = await axios({
            url: 'http://127.0.0.1:8000/usuario/crearproveedor',
            method: 'put',
            data: {
                nombre: empresa,
                direccion: direccion,
                correo: email,
                pass: password,
                celular: telefono,
                foto: url,
                admin: 0,
            },
        });
        if (resp.status === 200) {
            alert('Se ha registrado correctamente');
        } else {
            alert('Ha ocurrido un error');
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-4 flex-1 w-full"
            >
                <div className="form-control w-full col-span-2">
                    <label className="label pl-0">
                        <span className="label-text">Nombre de la empresa</span>
                    </label>
                    <input
                        type="text"
                        required
                        className="input input-primary w-full "
                        {...register('empresa', { required: true })}
                    />
                </div>
                <div className="form-control w-full col-span-2">
                    <label className="label pl-0">
                        <span className="label-text">Dirección física</span>
                    </label>
                    <input
                        type="text"
                        required
                        className="input input-primary w-full join-item"
                        {...register('direccion', { required: true })}
                    />
                </div>
                <div className="form-control w-full  col-span-2">
                    <label className="label pl-0">
                        <span className="label-text">Correo electrónico</span>
                    </label>

                    <input
                        type="text"
                        required
                        className="input input-primary w-full join-item"
                        {...register('email', { required: true })}
                    />
                </div>
                <div className="form-control w-full  col-span-2">
                    <label className="label pl-0">
                        <span className="label-text">Url fotografia</span>
                    </label>
                    <input
                        type="text"
                        required
                        className="input input-primary w-full join-item"
                        {...register('url', { required: true })}
                    />
                </div>
                <div className="form-control w-full col-span-2">
                    <label className="label pl-0">
                        <span className="label-text">Contraseña</span>
                    </label>
                    <input
                        type="password"
                        required
                        className="input input-primary w-full join-item focus:ring-0 focus"
                        {...register('password', { required: true })}
                    />
                </div>
                
                <div className="card-actions mt-4 col-span-2 flex justify-between">
                    <button className="btn btn-primary btn-md" type="submit">
                        Actualizar
                    </button>
                </div>
            </form>
        </>
    );
};

export default Proveedor;

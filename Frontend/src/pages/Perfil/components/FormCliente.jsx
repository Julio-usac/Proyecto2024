import axios from 'axios';
import { useForm } from 'react-hook-form';
import useAuth from '../../../auth/authStore';
import { useAsync, useMountEffect } from '@react-hookz/web';

const Cliente = () => {
    const token = useAuth((state) => state.token);

    const [state, actions] = useAsync(() => {
        return axios({
            url: 'http://127.0.0.1:9092/usuario/readUsuario',
            method: 'post',
            data: {
                token: token,
            },
        });
    });

    useMountEffect(actions.execute);
    const { register, handleSubmit, getValues, setValue } = useForm({
        defaultValues: {
            nombres: '',
            apellidos: '',
            email: '',
            url: '',
            password: '',
            telefono: '',
        },
    });
    if (state.status === 'success') {
        console.log('perfil usuario', state.result);
        setValue('nombres', state.result.data[0].nombre);
        setValue('apellidos', state.result.data[0].apellido);
        setValue('email', state.result.data[0].correo);
        setValue('url', state.result.data[0].foto);
        setValue('telefono', state.result.data[0].celular);
    }

    const onSubmit = async (data) => {
        console.log(data);
        const { nombres, apellidos, email, url, password, telefono } =
            getValues();
        // post data with axios
        const resp = await axios({
            url: 'http://127.0.0.1:9092/usuario/editUsuario',
            method: 'put',
            data: {
                nuevoNombre: nombres,
                nuevoApellido: apellidos,
                nuevoCorreo: email,
                nuevaPass: password,
                nuevoCelular: telefono,
                nuevaFoto: url,
                token,
            },
        });
        console.log(resp)
        if (resp.status === 201) {
            alert('Se ha actualizado correctamente');
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
                        <span className="label-text">Nombres</span>
                    </label>
                    <input
                        type="text"
                        required
                        className="input input-primary w-full "
                        {...register('nombres', { required: true })}
                    />
                </div>
                <div className="form-control w-full col-span-2">
                    <label className="label pl-0">
                        <span className="label-text">Apellidos</span>
                    </label>
                    <input
                        type="text"
                        required
                        className="input input-primary w-full join-item"
                        {...register('apellidos', { required: true })}
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
                <div className="form-control w-full col-span-2">
                    <label className="label pl-0">
                        <span className="label-text">Número de teléfono</span>
                    </label>

                    <input
                        type="text"
                        required
                        className="input input-primary w-full join-item"
                        {...register('telefono', { required: true })}
                    />
                </div>
                <div className="card-actions mt-4 col-span-2 justify-between">
                    <button className="btn btn-primary btn-md" type="submit">
                        Actualizar
                    </button>
                </div>
            </form>
        </>
    );
};

export default Cliente;

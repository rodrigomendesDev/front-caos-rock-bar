import './styles.css';
import CloseIcon from '../../assets/close-icon.svg';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { getItem, setItem } from '../../utils/storage';

const defaultForm = {
    name: '',
    userName: '',
    password: '',
    confirmPassword: ''
}

function ProfilerModal({ open, handleClose }) {
    const token = getItem('token');
    const [form, setForm] = useState({ ...defaultForm });

    function handleChangeForm({ target }) {
        setForm({ ...form, [target.name]: target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            if (!form.name || !form.userName) {
                return;
            }

            if (!form.password && !form.confirmPassword) {
                const response = await api.put('/usuario',
                    {
                        nome: form.name,
                        nome_usuario: form.userName,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
            } else if (form.name && form.userName && form.password && form.confirmPassword) {
                if (form.password !== form.confirmPassword) {
                    return;
                }

                const response = await api.put('/usuario',
                    {
                        nome: form.name,
                        nome_usuario: form.userName,
                        senha: form.password
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
            }



            setItem('userName', form.name);
            handleClose();
            handleClearForm()
        } catch (error) {
            console.log(error.response);
        }
    }

    function handleClearForm() {
        setForm({ ...defaultForm });
    }

    useEffect(() => {
        async function loadUserProfiler() {
            try {
                const response = await api.get('/usuario', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                const { nome, nome_usuario } = response.data
                setForm({
                    ...form,
                    name: nome,
                    userName: nome_usuario,
                });

            } catch (error) {
                console.log(error.response);
            }
        }

        if (open) {
            loadUserProfiler();
        }
    }, [open]);

    return (
        <>
            {open &&
                <div className="backdrop">
                    <div className="modal">
                        <img
                            src={CloseIcon}
                            alt="close-button"
                            className="close-button"
                            onClick={handleClose}
                        ></img>
                        <span>Editar usuário</span>

                        <form onSubmit={handleSubmit}>
                            <div className="container-inputs">
                                <label>Nome</label>
                                <input
                                    name='name'
                                    type="text"
                                    value={form.name}
                                    onChange={handleChangeForm}
                                    required
                                />
                            </div>
                            <div className="container-inputs">
                                <label>Nome de usuário</label>
                                <input
                                    name='userName'
                                    type="text"
                                    value={form.userName}
                                    onChange={handleChangeForm}
                                    required
                                />
                            </div>
                            <div className="container-inputs">
                                <label>Senha</label>
                                <input
                                    name='password'
                                    type="password"
                                    value={form.password}
                                    onChange={handleChangeForm}

                                />
                            </div>
                            <div className="container-inputs">
                                <label>Confirmar senha</label>
                                <input
                                    name='confirmPassword'
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={handleChangeForm}

                                />
                            </div>

                            <button className="btn-big btn-confirmed">Confirmar alterações</button>
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default ProfilerModal;
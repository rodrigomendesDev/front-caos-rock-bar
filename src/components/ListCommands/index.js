import './styles.css'
import Edit from '../../assets/edit.svg'
import { useEffect, useState } from 'react';
import { getItem } from '../../utils/storage';
import { formatToMoney } from '../../utils/formaters'
import api from '../../services/api';

function ListCommands({ handleUpdateCommands }) {
    const [commands, setCommands] = useState([]);
    const token = getItem('token');

    async function loadCommands() {
        try {
            const response = await api.get('/comanda', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setCommands([...response.data]);
            // console.log(response.data);
        } catch (error) {
            console.log(error.response);
        }
    }

    useEffect(() => {
        loadCommands();
    }, [handleUpdateCommands]);


    return (
        <div className="container-list-commands">
            <div className='table-head'>
                <strong className='table-column-middle'>Nº da Comanda</strong>
                <strong className='table-column-middle'>Nome do Cliente</strong>
                <strong className='table-column-middle'>Valor pago</strong>
                <strong className='table-column-middle'>Ações</strong>
            </div>
            <div className='table-body'>
                {commands.map((command) => (
                    <div key={command.id} className='table-row'>
                        <strong className='table-column-middle'>{command.numero_comanda}</strong>
                        <span className='table-column-middle'>{command.nome_cliente}</span>
                        <strong className='table-column-middle'>{formatToMoney(command.preco_final)}</strong>
                        <div className='table-column-middle'>
                            <img src={Edit} alt='edit-command' />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ListCommands;
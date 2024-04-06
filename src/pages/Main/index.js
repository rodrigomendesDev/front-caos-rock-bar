import './styles.css'
import Header from '../../components/Header';
import RegisterCommands from '../../components/RegisterCommands';
import ProfilerModal from '../../components/ProfilerModal';
import AddCommand from '../../components/AddCommandModal';
import ListCommands from '../../components/ListCommands';
import { useState } from 'react';
import api from '../../services/api';
import { getItem } from '../../utils/storage';

function Main() {
    const [openModalProfiler, setOpenModalProfiler] = useState(false);
    const [openModalCommand, setOpenModalCommand] = useState(false);
    const [commands, setCommands] = useState([])
    const token = getItem('token');

    async function handleUpdateCommands() {
        try {
            const response = await api.get('/comanda', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setCommands([...response.data]);
        } catch (error) {
            console.log(error.response);
        }
    }

    return (
        <div className='main-page'>
            <Header
                handleEditProfiler={() => setOpenModalProfiler(true)}
            />

            <section>
                <RegisterCommands
                    handleAddCommand={() => setOpenModalCommand(true)}
                />

                <ListCommands handleUpdateCommands={handleUpdateCommands} />
            </section>

            <ProfilerModal
                open={openModalProfiler}
                handleClose={() => setOpenModalProfiler(false)}
            />

            <AddCommand
                open={openModalCommand}
                handleClose={() => setOpenModalCommand(false)}
            />
        </div>
    )
}

export default Main;
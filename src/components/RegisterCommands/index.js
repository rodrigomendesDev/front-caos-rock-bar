import './styles.css';

function RegisterCommands({ handleAddCommand }) {
    return (
        <button onClick={handleAddCommand} className="btn-register">Registrar Comanda</button>
    )
}

export default RegisterCommands;
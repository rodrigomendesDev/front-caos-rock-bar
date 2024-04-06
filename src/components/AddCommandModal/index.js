import './styles.css';
import CloseIcon from '../../assets/close-icon.svg';
import { useState, useEffect } from 'react';
import { getItem } from '../../utils/storage';
import { formatToMoney } from '../../utils/formaters';
import api from '../../services/api';

const defaultForm = {
    name_client: '',
    number_command: '',
    quantities_products: [],
    other_values: '',
    value_entry: '',
    value_tip: false
}

function AddCommandModal({ open, handleClose, handleUpdateCommands }) {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ ...defaultForm });
    const [registerCommand, setRegisterCommand] = useState(false);
    const [initialValues, setInitialValues] = useState({
        outros_valores: '',
        valor_entrada: ''
    });
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalExtras, setTotalExtras] = useState(0);

    const token = getItem('token');

    async function loadCategories() {
        try {
            const response = await api.get('/categorias', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setCategories([...response.data]);

        } catch (error) {
            console.log(error.response);
        }
    }

    async function loadProducts() {
        try {
            const response = await api.get('/produtos', {
                headers: {
                    Authorization: `Bearer  ${token}`
                }
            });

            setProducts([...response.data]);

        } catch (error) {
            console.log(error.response);
        }
    }

    function handleChangeForm(e, productId) {
        const { name, value, type, checked } = e.target

        let valueEntry;

        if (type === 'checkbox') {
            if (name === 'value_tip') {
                const tip = checked ? (totalProducts * 0.1) : 0
                setTotalExtras(form.other_values + valueEntry + tip);
            }
            valueEntry = checked;
        } else if (name === 'value_entry' || name === 'other_values') {
            valueEntry = (parseFloat(value.replace(/(?!^),/g, '').replace(/\D/g, '')) / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
        } else {
            valueEntry = value;
        }

        let updateForm = { ...form };

        if (name.startsWith('quantities_products')) {
            if (!value.trim()) {
                delete updateForm.quantities_products[productId];
            } else {
                updateForm.quantities_products[productId] = {
                    produto_id: productId,
                    quantidade_produto: value,
                    preco: products.find((prod => productId === prod.id)).preco
                };
            }

            const quantidadeProdutosArray = Object.values(updateForm.quantities_products)

            updateForm = {
                ...updateForm,
                products_consumed: quantidadeProdutosArray
            };
        } else {
            updateForm = {
                ...updateForm,
                [name]: valueEntry
            }
        }

        setForm(updateForm);

        calculateTotalProducts();
        calculateTotalExtras();
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const otherValuesInCents = parseInt(form.other_values.replace(/\D/g, ''));
            const valueEntryInCents = parseInt(form.value_entry.replace(/\D/g, ''));

            const formInCents = {
                ...form,
                otherValuesFormated: otherValuesInCents || 0,
                valueEntryFormated: valueEntryInCents || 0
            };

            const response = await api.post('/comanda',
                {
                    nome_cliente: formInCents.name_client,
                    numero_comanda: formInCents.number_command,
                    produtos: formInCents.products_consumed.map(prod => ({
                        produto_id: prod.produto_id,
                        quantidade_produto: prod.quantidade_produto
                    }))
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

            setInitialValues({
                outros_valores: formInCents.otherValuesFormated,
                valor_entrada: formInCents.valueEntryFormated
            })

            setRegisterCommand(true);
        } catch (error) {
            console.log(error.message);
        }
    }

    async function handleSubmitExtraData(e) {
        e.preventDefault();
        console.log(initialValues);
        try {
            const response = await api.post('/comandaFinal',
                {
                    numero_comanda: form.number_command,
                    nome_cliente: form.name_client,
                    outros_valores: initialValues.outros_valores,
                    valor_entrada: initialValues.valor_entrada,
                    gorgeta: form.value_tip
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            console.log(response.data);
            setForm({ ...defaultForm });
            handleClose();
            handleUpdateCommands();
        } catch (error) {
            console.log(error.response);
        }
    }

    function calculateTotalProducts() {
        let total = 0;
        for (const productId in form.quantities_products) {
            const product = form.quantities_products[productId];
            total += product.quantidade_produto * product.preco;
        }
        setTotalProducts(total);
    }

    function calculateTotalExtras() {
        let otherValues = parseFloat(form.other_values.replace(/\D/g, '')) || 0;
        let valueEntry = parseFloat(form.value_entry.replace(/\D/g, '')) || 0;
        let tip = form.value_tip ? ((totalProducts + otherValues) * 0.1) : 0;


        console.log(tip);
        setTotalExtras(otherValues + valueEntry + tip);
    }

    useEffect(() => {
        loadCategories();
        loadProducts();

        calculateTotalProducts();
        calculateTotalExtras();

        setRegisterCommand(false);
    }, [form]);

    return (
        <>
            {open &&
                <div className="backdrop">
                    <form className="modal-command">
                        <img
                            src={CloseIcon}
                            alt="close-button"
                            className="close-button"
                            onClick={handleClose}
                        ></img>
                        <span>Cardápio</span>
                        <div className="separator"></div>

                        <div className="command-owner">
                            <div>
                                <label>Nome cliente: </label>
                                <input
                                    name='name_client'
                                    type="text"
                                    value={form.name_client}
                                    onChange={handleChangeForm}
                                ></input>
                            </div>

                            <div>
                                <label>Número comanda: </label>
                                <input
                                    name='number_command'
                                    type='text'
                                    value={form.number_command}
                                    onChange={handleChangeForm}
                                ></input>
                            </div>
                        </div>
                        <div className="separator"></div>

                        <div className="container-itens-command">

                            {categories.map((category) => (
                                <div className="categorie-items" key={category.id}>
                                    <span>{category.nome}</span>

                                    <div className="item-list">
                                        {products.filter((product) => product.categoria_id === category.id).map((prod) => (
                                            <div key={prod.id}>
                                                <div className="item">
                                                    <label>{prod.nome} - <strong>{formatToMoney(prod.preco)} </strong></label>
                                                    <input
                                                        type="text"
                                                        name={`quantities_products_${prod.id}`}
                                                        value={form.quantities_products[prod.id] ? form.quantities_products[prod.id].qtd : ''}
                                                        onChange={(e) => handleChangeForm(e, prod.id)}
                                                    ></input>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="separator"></div>
                                </div>
                            ))}
                            <div className="container-itens-command">
                                <div className="extra-item">
                                    <label>Outros Valores - </label>
                                    <input
                                        type="text"
                                        name='other_values'
                                        value={form.other_values}
                                        onChange={(e) => handleChangeForm(e)}
                                    ></input>
                                </div>
                                <div className="extra-item">
                                    <label>Valor entrada - </label>
                                    <input
                                        type="text"
                                        name='value_entry'
                                        value={form.value_entry}
                                        onChange={(e) => handleChangeForm(e)}
                                    ></input>
                                </div>
                                <div className="tip">
                                    <label>Gorgeta (10%) <input
                                        type="checkbox"
                                        name='value_tip'
                                        checked={form.value_tip}
                                        onChange={handleChangeForm}>
                                    </input>
                                    </label>
                                </div>
                                <div className="separator"></div>

                                <div className="extra-item">
                                    <strong>VALOR A PAGAR - {formatToMoney(totalProducts + totalExtras)}</strong>
                                </div>
                                {!registerCommand ? (
                                    <div className="btn-end-command">
                                        <button className="btn-big btn-confirmed" onClick={handleSubmit}>Registrar Comanda</button>
                                    </div>
                                ) : (
                                    <div className="btn-end-command">
                                        <button className="btn-big btn-confirmed" onClick={handleSubmitExtraData}>Finalizar Comanda</button>
                                    </div>
                                )
                                }
                            </div>
                        </div>
                    </form >
                </div >
            }
        </>
    )
}

export default AddCommandModal;
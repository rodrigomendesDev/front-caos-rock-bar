import { format } from 'date-fns';

export function formatToMoney(value) {
    const valueInReal = value / 100;
    return valueInReal.toLocaleString('pt-br',
        {
            style: 'currency', currency: 'BRL'
        });
}
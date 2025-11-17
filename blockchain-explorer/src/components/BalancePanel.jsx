import React from 'react';

const BalancePanel = ({ balances = [] }) => {
    if (!balances.length) {
        return (
            <div className="rounded-lg bg-white p-4 shadow">
                <h2 className="text-lg font-semibold text-gray-900">Saldos por endereço</h2>
                <p className="pt-2 text-sm text-gray-500">
                    Ainda não há saldos registrados. Minere um bloco para gerar recompensas ou registre transações.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Saldos por endereço</h2>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    {balances.length} carteiras
                </span>
            </div>
            <div className="mt-4 overflow-auto">
                <table className="w-full text-left text-sm text-gray-700">
                    <thead>
                        <tr className="text-xs uppercase tracking-wide text-gray-500">
                            <th className="pb-2">Endereço</th>
                            <th className="pb-2 text-right">Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {balances.map((item) => (
                            <tr key={item.address} className="border-t border-gray-100">
                                <td className="py-2 font-mono text-xs text-gray-900">{item.address}</td>
                                <td className="py-2 text-right font-semibold">
                                    {item.balance.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 8,
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BalancePanel;

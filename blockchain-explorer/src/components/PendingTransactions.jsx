import React from 'react';

const PendingTransactions = ({ transactions = [] }) => {
    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Mempool</h2>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    {transactions.length} pendentes
                </span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
                {transactions.length ? (
                    transactions.map((tx, index) => (
                        <div key={`${tx.from}-${tx.to}-${index}`} className="rounded border border-gray-100 bg-gray-50 p-3">
                            <p><span className="font-semibold">De:</span> {tx.from}</p>
                            <p><span className="font-semibold">Para:</span> {tx.to}</p>
                            <p><span className="font-semibold">Valor:</span> {tx.amount}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Nenhuma transação aguardando mineração.</p>
                )}
            </div>
        </div>
    );
};

export default PendingTransactions;
import React from 'react';

const BlockCard = ({ block, isSelected = false, onSelect }) => {
    if (!block) return null;

    const previousHash = block.previous_hash || block.previousHash || '';
    const timestamp = block.timestamp || block.mined_at || block.minedAt;
    const txCount = block.transactions?.length || 0;

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`text-left rounded-lg border bg-white p-4 shadow transition hover:-translate-y-0.5 hover:shadow-lg ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
            }`}
        >
            <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Bloco #{block.index}</span>
                <span>Nonce: {block.nonce}</span>
            </div>
            <p className="mt-2 text-sm font-mono text-gray-800">Hash: {block.hash}</p>
            {previousHash && (
                <p className="mt-1 text-xs font-mono text-gray-500">Prev: {previousHash}</p>
            )}
            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <span>{txCount} transações</span>
                {timestamp && (
                    <span>{new Date(Number(timestamp) * 1000).toLocaleString()}</span>
                )}
            </div>
        </button>
    );
};

export default BlockCard;
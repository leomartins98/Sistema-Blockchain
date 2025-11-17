import hashlib
import json
import time
from typing import Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator


class Block:
    def __init__(self, index: int, transactions: List[dict], timestamp: float,
                 previous_hash: str, nonce: int = 0):
        self.index = index
        self.transactions = transactions
        self.timestamp = timestamp
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        block_string = json.dumps({
            "index": self.index,
            "transactions": self.transactions,
            "timestamp": self.timestamp,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce,
        }, sort_keys=True).encode()

        return hashlib.sha256(block_string).hexdigest()

    def to_dict(self) -> dict:
        return {
            "index": self.index,
            "transactions": self.transactions,
            "timestamp": self.timestamp,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce,
            "hash": self.hash,
        }


class Blockchain:
    def __init__(self, difficulty: int = 4):
        self.chain: List[Block] = []
        self.difficulty = difficulty
        self.pending_transactions: List[dict] = []
        self.mining_reward = 10

        self.chain.append(self.create_genesis_block())

    def create_genesis_block(self) -> Block:
        return Block(
            index=0,
            transactions=[{"from": "system", "to": "genesis", "amount": 0}],
            timestamp=time.time(),
            previous_hash="0",
        )

    @property
    def latest_block(self) -> Block:
        return self.chain[-1]

    def add_transaction(self, from_address: str, to_address: str, amount: float):
        self.pending_transactions.append({
            "from": from_address,
            "to": to_address,
            "amount": amount,
        })

    def proof_of_work(self, block: Block) -> str:
        while True:
            calculated_hash = block.calculate_hash()
            if calculated_hash.startswith("0" * self.difficulty):
                return calculated_hash
            block.nonce += 1

    def mine_pending_transactions(self, miner_address: str) -> Block:
        reward_tx = {
            "from": "system",
            "to": miner_address,
            "amount": self.mining_reward,
        }
        self.pending_transactions.append(reward_tx)

        new_block = Block(
            index=len(self.chain),
            transactions=self.pending_transactions,
            timestamp=time.time(),
            previous_hash=self.latest_block.hash,
        )

        new_block.hash = self.proof_of_work(new_block)
        self.chain.append(new_block)
        self.pending_transactions = []
        return new_block

    def get_balance_of_address(self, address: str) -> float:
        return self.get_all_balances().get(address, 0.0)

    def get_all_balances(self) -> Dict[str, float]:
        balances: Dict[str, float] = {}
        for block in self.chain:
            for tx in block.transactions:
                amount = float(tx.get("amount", 0) or 0)
                from_addr = tx.get("from")
                to_addr = tx.get("to")

                if from_addr:
                    balances[from_addr] = balances.get(from_addr, 0.0) - amount
                if to_addr:
                    balances[to_addr] = balances.get(to_addr, 0.0) + amount
        return balances

    def is_chain_valid(self) -> bool:
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            if current_block.hash != current_block.calculate_hash():
                return False

            if current_block.previous_hash != previous_block.hash:
                return False

        return True

    def chain_to_list(self) -> List[dict]:
        return [block.to_dict() for block in self.chain]

    def pending_transactions_copy(self) -> List[dict]:
        return [dict(tx) for tx in self.pending_transactions]

app = FastAPI(
    title="Mini Blockchain API",
    description="API REST para interagir com o blockchain educacional",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

blockchain = Blockchain(difficulty=4)


class TransactionPayload(BaseModel):
    from_address: str = Field(..., alias="from", min_length=1)
    to_address: str = Field(..., alias="to", min_length=1)
    amount: float

    @validator("amount")
    def amount_must_be_positive(cls, value: float) -> float:
        if value <= 0:
            raise ValueError("Amount must be greater than zero")
        return value


class MinePayload(BaseModel):
    miner: str = Field("Miner1", min_length=1)


@app.get("/api/blocks")
def list_blocks():
    return {"blocks": blockchain.chain_to_list(), "length": len(blockchain.chain)}


@app.get("/api/pending-transactions")
def list_pending_transactions():
    transactions = blockchain.pending_transactions_copy()
    return {"transactions": transactions, "count": len(transactions)}


@app.get("/api/balances")
def list_balances():
    balances_dict = blockchain.get_all_balances()
    balances = [
        {"address": address, "balance": balance}
        for address, balance in balances_dict.items()
    ]
    balances.sort(key=lambda item: item["balance"], reverse=True)
    return {"balances": balances, "count": len(balances)}


@app.post("/api/transactions", status_code=201)
def create_transaction(payload: TransactionPayload):
    blockchain.add_transaction(payload.from_address, payload.to_address, payload.amount)
    count = len(blockchain.pending_transactions)
    return {
        "message": "Transaction added to mempool",
        "pending_count": count,
    }


@app.post("/api/mine")
def mine_block(payload: MinePayload):
    if not blockchain.pending_transactions:
        raise HTTPException(status_code=400, detail="No pending transactions to mine")

    new_block = blockchain.mine_pending_transactions(payload.miner)
    return {
        "message": "Block mined",
        "hash": new_block.hash,
        "block": new_block.to_dict(),
        "isValid": blockchain.is_chain_valid(),
    }


@app.get("/api/validate-chain")
def validate_chain():
    is_valid = blockchain.is_chain_valid()
    return {"isValid": is_valid, "length": len(blockchain.chain)}


@app.get("/api/balance/{address}")
def get_balance(address: str):
    balance = blockchain.get_balance_of_address(address)
    return {"address": address, "balance": balance}


@app.get("/api/health")
def healthcheck():
    return {"status": "ok", "chain_length": len(blockchain.chain)}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api_server:app", host="0.0.0.0", port=5000, reload=True)

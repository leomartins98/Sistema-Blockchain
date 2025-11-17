# Mini Blockchain Educacional

Implementação educacional de blockchain com proof-of-work, sistema de transações e interface web para visualização.

## 📋 Pré-requisitos

- **Python 3.8+** instalado
- **Node.js 14+** e npm instalados
- Git (opcional, para clonar o repositório)

## 🚀 Instalação e Execução

### 1. Clone o repositório (ou baixe o código)

```bash
git clone https://github.com/leomartins98/Sistema-Blockchain.git
cd Sistema-Blockchain
```

### 2. Configurar e executar o Backend (Python/FastAPI)

#### No Windows (PowerShell):

```powershell
# Criar ambiente virtual
python -m venv .venv

# Ativar ambiente virtual
.venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Executar o servidor backend
python -m uvicorn api_server:app --reload --port 5000
```

#### No Linux/Mac:

```bash
# Criar ambiente virtual
python3 -m venv .venv

# Ativar ambiente virtual
source .venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Executar o servidor backend
python -m uvicorn api_server:app --reload --port 5000
```

O backend estará rodando em: **http://localhost:5000**

### 3. Configurar e executar o Frontend (React/Vite)

Abra **outro terminal** (mantenha o backend rodando) e execute:

```bash
# Entrar na pasta do frontend
cd blockchain-explorer

# Instalar dependências
npm install

# Executar o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: **http://localhost:3000**

## 🎯 Como usar

1. Acesse **http://localhost:3000** no navegador
2. **Adicionar transações**: preencha o formulário com remetente, destinatário e valor
3. **Visualizar mempool**: veja as transações pendentes aguardando mineração
4. **Minerar bloco**: informe o endereço do minerador e clique em "Minerar pendentes"
5. **Visualizar blocos**: veja todos os blocos minerados com suas transações
6. **Consultar saldos**: veja o saldo de cada endereço na lateral direita

## 🔧 Configurações

### Alterar porta do backend

Edite o arquivo `api_server.py` na última linha:

```python
uvicorn.run("api_server:app", host="0.0.0.0", port=5000, reload=True)
```

### Alterar URL do backend no frontend

Crie um arquivo `.env` dentro de `blockchain-explorer/`:

```
VITE_API_BASE_URL=http://localhost:5000
```

### Ajustar dificuldade de mineração

Edite o arquivo `api_server.py`, linha que instancia o blockchain:

```python
blockchain = Blockchain(difficulty=4)  # Aumentar = mais difícil
```

## 📁 Estrutura do Projeto

```
Sistema-Blockchain/
├── api_server.py           # Backend FastAPI com blockchain
├── requirements.txt        # Dependências Python
├── README.md              # Este arquivo
└── blockchain-explorer/   # Frontend React
    ├── src/
    │   ├── components/    # Componentes React
    │   ├── hooks/         # Custom hooks
    │   ├── api/          # Cliente HTTP
    │   └── App.jsx       # Componente principal
    ├── package.json      # Dependências Node
    └── vite.config.js    # Configuração Vite
```

## 🛠️ Build para produção

### Backend

O backend pode ser executado diretamente com:

```bash
uvicorn api_server:app --host 0.0.0.0 --port 5000
```

### Frontend

```bash
cd blockchain-explorer
npm run build
```

Os arquivos otimizados estarão em `blockchain-explorer/dist/`

## ⚙️ Endpoints da API

- `GET /api/blocks` - Lista todos os blocos
- `GET /api/pending-transactions` - Lista transações pendentes
- `GET /api/balances` - Retorna saldos de todos os endereços
- `POST /api/transactions` - Adiciona nova transação
- `POST /api/mine` - Minera bloco com transações pendentes
- `GET /api/validate-chain` - Valida integridade da blockchain
- `GET /api/balance/{address}` - Consulta saldo de um endereço
- `GET /api/health` - Health check do servidor

## 📝 Características

- ✅ Proof-of-Work com dificuldade configurável (4 zeros por padrão)
- ✅ Sistema de transações com mempool
- ✅ Recompensa de mineração (10 por bloco)
- ✅ Validação de integridade da cadeia
- ✅ Interface web responsiva com Tailwind CSS
- ✅ Cálculo automático de saldos
- ✅ Visualização detalhada de blocos e transações

## 🐛 Troubleshooting

### Backend não inicia

- Verifique se Python 3.8+ está instalado: `python --version`
- Certifique-se de ativar o ambiente virtual
- Reinstale as dependências: `pip install -r requirements.txt`

### Frontend não conecta ao backend

- Verifique se o backend está rodando em `http://localhost:5000`
- Verifique erros no console do navegador (F12)
- Confirme que não há firewall bloqueando as portas

### Erro ao minerar

- Certifique-se de que há transações pendentes antes de minerar
- O botão estará desabilitado se não houver transações no mempool

## 📄 Licença

Projeto educacional para fins de aprendizado sobre blockchain e tecnologias web.

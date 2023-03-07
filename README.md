# generic_erc721_smart_contract
Deploy an ERC-721 (Non Fungible Token) smart contract along with tokens data.

# I) Development mode

## 1) Install ansible

**Ansible version requirement: >2.0.0 & <2.10.7**

### a) recommended way: with virtualenv
- Install [pyenv](https://github.com/pyenv/pyenv)
  along with [pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv)
- Using 3.10.6 for python version is highly recommended
```shell
pyenv gloval 3.10.6
```
- Create a virtual env
```shell
pyenv virtualenv ansible
```
- Activate the just created virtual env
```shell
pyenv activate ansible
```
- Install ansible
```shell
pip install ansible==2.10.7
```

### b) non recommended way: installing globally
```shell
sudo pip install ansible==2.10.7
```

## 2) Install nodejs right version
**This project relies on truffle which does not support node
version greater than v16.**

### a) recommended way: with nvm
- Install [nvm](https://github.com/nvm-sh/nvm)
- Install nodejs version v16
```shell
nvm install 16.14.0
```
- Use node version v16
```shell
nvm use v16.14.0
```

### b) non recommended way: installing globally

## 3) Create an [nft.storage](https://nft.storage/) account
This project relies on [nft.storage](https://nft.storage/) to
upload nft jsons and images on IPFS.
You need to register on their website and generate an api key.


## 4) Create a vault file
Ansible needs to access some sensitive variables, these are defined
in a vault file.

- Create a vault file on directory `ansible/vars/dev/`:
```shell
touch <PATH_TO_REPOSITORY>/ansible/vars/dev/vault
```

- Edit `vault` file with the following parameters (you need to
  provide your own values by replacing `...`):
```
---
# database
vault_db_host: "localhost"
vault_db_user: "..."
vault_db_database: "..."
vault_db_port: 5433
vault_db_port_inside_container: 5432
vault_db_password: "..."

# nft upload api
vault_nft_storage_api_key: "..."

# smart contract
vault_smart_contract_owner_key_mnemonic: "..."
vault_smart_contract_owner_address: "..."
vault_smart_contract_withdraw_address: "..."
vault_smart_contract_fee_recipient_address: "..."
vault_smart_contract_admin_key_mnemonic: "..."
vault_smart_contract_admin_accounts: "..."
vault_smart_contract_mint_signer_key_mnemonic: "..."
vault_smart_contract_mint_signer_accounts: "..."
vault_smart_contract_pauser_key_mnemonic: "..."
vault_smart_contract_pauser_accounts: "..."

# ganache settings (development only)
vault_blockchain_network: "ganache"
vault_blockchain_host: "localhost"
vault_blockchain_chain_id: 1337
vault_blockchain_network_id: 5777
vault_blockchain_port: 8545
vault_blockchain_inside_container_port: 8545
```


## 5) Run local blockchain and database
To deploy the NFT smart contract you need a blockchain.
In development mode you can use the local blockchain ganache.
Deploying the smart contract also requires to store information
about it (contract address, tokens jsons uris, signatures, ...)
into a database.

### 5.1) Generate .env file
Once all fields are provided in the vault file you can generate an
`.env` file with `ansible/dev_generate_env_file.yml`:
```shell
ansible-playbook ansible/dev_generate_env_file.yml --ask-vault-pass
```
This should produce an `.env` at the root of the project.

### 5.2) Run docker-compose
To instantiate and run both a postgres server and a local blockchain,
use the following command:
```shell
docker-compose --profile deploy-local-chain up --build
```

**Remark**: To only run the database `docker-compose --profile deploy up --build`
and to only run the local ganache blockchain `docker-compose --profile local-chain up --build`.


## 6) Deploy smart contract and upload data on IPFS

**Remark**: if you followed previous steps you should launch a `docker-compose`
command. You need to maintain docker-compose running and open a new terminal.
You should activate the virtualenv again (`pyenv activate ansible`)
if you took this approach and activate nodejs version v16 again (`nvm use v16.14.0`).

### 6.1) Provide data
You need to provide the following data:
- the json attributes and image of the smart contract
- the json attributes and image of the token when it is unrevealed
- the jsons of attributes and images of the tokens of the nft smart contract

Create a directory `data`
```shell
mkdir <PATH_TO_REPOSITORY>/data
```
You should provision the `data` folder with your data with following tree
structure and naming:
```
.
└── data/
    └── dev/
        ├── smart_contract/
        │   ├── attributes.json
        │   └── image.jpeg
        ├── unrevealed_token/
        │   ├── attributes.json
        │   └── image.jpeg
        └── tokens/
            ├── images/
            │   ├── image_0.jpeg
            │   ├── image_1.jpeg
            │   └── ....
            └── jsons/
                ├── attributes_0.json
                ├── attributes_1.json
                └── ....
```

6.2) (Optional) Edit the `vars` file with your own values

You can edit the `ansible/vars/dev/vars.yml` file with your own values
```yaml
# smart contract
nb_tokens: 9336
nb_tokens_pre_saved: 100
smart_contract_external_url: "https://<link_to_your_project>.io"
smart_contract_domain_name: "Generic NFT Project"
smart_contract_domain_version: "v4"
smart_contract_name: "NFT Smart contract"
smart_contract_symbol: "Smt"
```

6.3) Deploy the smart contract
```shell
ansible-playbook ansible/deploy.yml --ask-vault-pass
```

## 7) Generate synthetic values for testing purpose
It is recommended to generate values for tables `pre_selected_non_fungible_tokens`
and `pre_selected_users`.

- Copy `insert_data_into_db.sql.template` into `insert_data_into_db.sql`
```shell
cp insert_data_into_db.sql.template insert_data_into_db.sql
```

- Edit the `insert_data_into_db.sql` script with your own values
```sql
INSERT INTO pre_selected_users(address) VALUES
('<first_address>'),
('<second_address>');

INSERT INTO pre_selected_non_fungible_tokens(price, pre_selected_user_id) VALUES
(0, 1),
(0, 1),
(0, 1),
(0, 2),
(10000, 1);
```

- Load data into database
```shell
cat insert_data_into_db.sql | docker exec -i generic_erc721_smart_contract_postgres psql -U <USER_IN_VAULT_FILE> -d <DATABASE_IN_VAULT_FILE>
```

## 8) Populate table `vouchers`
```shell
ansible-playbook ansible/populate_vouchers_db.yml --ask-vault-pass
```
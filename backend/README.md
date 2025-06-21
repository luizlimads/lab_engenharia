# Backend

Desenvolvido com [Django](https://www.djangoproject.com/).

## Requisitos

- Python 3

## Configuração do ambiente

### Crie um ambiente virtual

#### Windows (PowerShell)

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

> Para desativar o ambiente virtual, execute `deactivate` no terminal.

#### macOS ou Linux

```bash
python -m venv venv
source venv/bin/activate
```

### Instale as dependências

```bash
pip install -r requirements.txt
```

## Executando o projeto

### 1. Execute as migrações do banco de dados

```bash
python manage.py migrate
```

### 2. Crie um superusuário (opcional, para acessar o admin)

```bash
python manage.py createsuperuser
```

### 3. Rode o servidor de desenvolvimento

```bash
python manage.py runserver
```

O projeto estará disponível em [http://localhost:8000](http://localhost:8000)

## Outros comandos úteis

### Aplicar novas migrações (caso altere modelos)

```bash
python manage.py makemigrations
python manage.py migrate
```

### Acessar o shell interativo do Django

```bash
python manage.py shell
```

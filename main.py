import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bs4 import BeautifulSoup
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get("/")
def home():
    return {"status": "ok"}

@app.get("/fetch_projects")
def get_github_projects():
    username = '505kurt'
    exclude = ['FelipeBarcelosPortfolio', '505kurt']
    max_projects = 5

    page_url = f'https://github.com/{username}?tab=repositories'
    page_response = requests.get(page_url)
    if page_response.status_code != 200:
        print(f"Erro ao acessar GitHub:{page_response.status_code}")
        raise Exception(f"Erro ao acessar o GitHub: {page_response.status_code}")

    soup = BeautifulSoup(page_response.text, 'html.parser')
    repos = soup.find_all('li', class_='public')
    projetos = []

    for repo in repos:

        title_tag = repo.find('a', itemprop='name codeRepository')
        desc_tag = repo.find('p', itemprop='description')
        mes_ano = repo.find('relative-time')
        mes_ano = mes_ano.text.strip()

        if title_tag:
            name = title_tag.text.strip()
            if name in exclude:
                continue

            description = desc_tag.text.strip() if desc_tag else "Sem descrição"
            mes_ano = mes_ano.replace('Jan', 'Jan').replace('Feb', 'Fev').replace('Mar', 'Mar').replace('Apr', 'Abr').replace('May', 'Mai').replace('Jun', 'Jun').replace('Jul', 'Jul').replace('Aug', 'Ago').replace('Sep', 'Set').replace('Oct', 'Out').replace('Nov', 'Nov').replace('Dec', 'Dez')
            mes_ano = mes_ano.split()
            mes_ano = f"{mes_ano[0]}, {mes_ano[2]}"

            projetos.append({
                'name': name,
                'description': description,
                'created': mes_ano,
                'link': f"https://github.com/{username}/{name}"
            })

        if len(projetos) >= max_projects:
            break

    print(f"[✔] {len(projetos)} projetos exportados com sucesso.")
    return projetos

get_github_projects()
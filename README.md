# 💰 Ionic - Minhas Finanças

## 📌 Introdução

Este é um aplicativo móvel desenvolvido com **Ionic** e **Angular** para **gestão de finanças pessoais**. Com ele, é possível registrar e acompanhar movimentações financeiras por categoria, adicionar cartões de crédito e débito, registrar suas transações e visualizar o quanto do limite do cartão está comprometido.

O foco principal do app é fornecer uma visão clara e organizada das suas finanças de forma intuitiva e prática.

---

## 📂 Estrutura do Projeto

```bash
.
├── resources/               # Recursos como splash e ícones
├── src/
│   ├── assets/              # Imagens, fontes e outros recursos estáticos
│   ├── environments/        # Configurações de ambiente (dev, prod)
│   ├── theme/               # Temas e variáveis de estilo
│   ├── index.html           # Página principal
│   └── app/
│       ├── components/      # Componentes reutilizáveis
│       ├── models/          # Interfaces e tipos de dados
│       │   └── enums/       # Enums usados nos modelos
│       ├── pages/           # Páginas principais da aplicação
│       ├── services/        # Serviços para lógica de negócio e integração
│       └── shared/          # Recursos compartilhados como pipes, directives, etc.
```

---

## ▶️ Como rodar o Projeto

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-usuario/seu-repo.git
   cd seu-repo
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Execute o app em ambiente de desenvolvimento:**

   ```bash
   ionic serve
   ```

4. **(Opcional) Execute no Android ou iOS com Capacitor:**

   ```bash
   ionic build
   npx cap add android
   npx cap open android
   ```

---

## 🛠️ Tecnologias Utilizadas

* [Ionic](https://ionicframework.com/) – Framework para desenvolvimento de apps híbridos
* [Angular](https://angular.io/) – Framework web para construção da arquitetura e lógica do app
* [Capacitor](https://capacitorjs.com/) – Ferramenta de execução nativa para apps móveis
* [Swiper](https://swiperjs.com/) – Biblioteca de slides/carrosséis usada para navegação interativa

---

## 📱 Funcionalidades

* ✅ Registro de movimentações financeiras por categoria
* ✅ Cadastro e gerenciamento de cartões de crédito e débito
* ✅ Visualização do limite comprometido de cada cartão
* ✅ Barra de pesquisa (Search Bar) para busca rápida de transações
* ✅ **Filtro avançado**, com as seguintes opções:

  * 🔍 **Ano**
  * 🔍 **Mês**
  * 🔍 **Categoria**
  * 🔍 **Tipo de transação** (Entrada ou Saída)
  * 🔍 **Método de Pagamento da transação (Pix, Dinheiro, Cartão de Crédito, Cartão de Débito)**
  * 🔍 **Preço mínimo**
  * 🔍 **Preço máximo**
* ✅ Interface moderna, responsiva e fácil de usar

---

## 🚀 Futuras Implementações

* Autenticação de Usuarios
* Exportação de relatórios em PDF/CSV
* Alertas de vencimento de faturas e metas de gastos
* Tema escuro (Dark Mode)

## **Licença**

Este projeto está licenciado sob a **[Licença MIT](./LICENSE)**.

## **Autor**

Este projeto foi desenvolvido por **Lucas Santos Silva**, Desenvolvedor Full Stack, graduado pela **Escola Técnica do Estado de São Paulo (ETEC)** nos cursos de **Informática (Suporte)** e **Informática para Internet**.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/bylucasss/)

# Tracktiv

Aplicativo acadêmico para registrar atividades e consultar o histórico em um calendário. Desenvolvido em grupo para a disciplina de Programação Mobile, com React Native e Expo.

## O que está implementado

- Apresentação inicial e seleção de atividades.
- Cronômetro com início, pausa e reinício.
- Registro de atividades por dia e consulta no calendário.
- Feed demonstrativo com curtidas e comentários mantidos durante a sessão.
- Perfil de demonstração e alternância entre temas claro e escuro.

Os registros usam AsyncStorage no dispositivo. O código possui um fallback em memória quando esse armazenamento não está disponível; nesse caso, os dados não persistem após encerrar a execução.

O feed usa dados locais definidos em `data.js`. O projeto não implementa servidor, autenticação ou uma rede social conectada.

## Tecnologias

JavaScript, React 19.1, React Native 0.81 e Expo SDK 54. A interface utiliza Animated API, React Native Paper, Expo Blur, Expo Linear Gradient e ícones do Expo; os registros utilizam AsyncStorage.

## Executar

Com Node.js e npm instalados, execute na raiz:

```sh
npm install
npx expo start
```

Abra em um dispositivo ou emulador compatível com o Expo SDK 54. Os scripts `npm run android` e `npm run ios` iniciam o Expo para essas plataformas; o ambiente de desenvolvimento correspondente precisa estar configurado.

As imagens externas das atividades dependem de conexão com a internet.

## Estrutura

```text
App.js          Estado da aplicação e navegação entre telas
screens.js      Telas e fluxos de interação
components.js   Componentes compartilhados
data.js         Usuários, atividades e posts de demonstração
storage.js      Registros locais e fallback em memória
theme.js        Temas claro e escuro
assets/         Recursos visuais do projeto
app.json        Configuração do Expo
```

## Autoria

Projeto coletivo de Anthony Durval Oliveira Silva, Gustavo Evangelista Lima Acioli, Nicolas Matheus da Silva Melo, Reginaldo Brenno da Silva Guerra, Ricardo Araújo Ferreira Neto e Ryan Cavalcanti Silva dos Santos.

O registro original do trabalho atribui ao grupo a concepção e a organização, e a Nicolas Melo a implementação técnica e a integração das funcionalidades. A proposta de interface partiu de um protótipo acadêmico desenvolvido no Adobe XD.

## Estado do projeto

Entregue como trabalho acadêmico, conforme a documentação original. Este repositório preserva essa implementação. Não há suíte de testes nem arquivo de lock de dependências versionados; uma execução atual no dispositivo ainda precisa ser validada antes de uma nova entrega.

Os retratos dos integrantes e as imagens externas devem conservar os respectivos créditos e autorizações de uso. O campo `license` existente em `package.json` não foi alterado.

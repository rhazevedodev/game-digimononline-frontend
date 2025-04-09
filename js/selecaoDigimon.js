const digimons = [
    { id: 1, nome: "Agumon", img: "../assets/digimons/rookies/agumon.jpg", descricao: "Um pequeno dinossauro com habilidades de fogo." },
    { id: 2, nome: "Gabumon", img: "../assets/digimons/rookies/gabumon.jpg", descricao: "Um Digimon reptiliano coberto por uma pele de lobo azul." },
    { id: 3, nome: "Gomamon", img: "../assets/digimons/rookies/gomamon.jpg", descricao: "Um Digimon marinho com garras afiadas e espírito brincalhão." },
    { id: 4, nome: "Palmon", img: "../assets/digimons/rookies/palmon.jpg", descricao: "Um Digimon planta que usa seus tentáculos como chicotes." },
    { id: 5, nome: "Patamon", img: "../assets/digimons/rookies/patamon.jpg", descricao: "Um Digimon alado com orelhas grandes que permitem que ele voe." },
    { id: 6, nome: "Piyomon", img: "../assets/digimons/rookies/piyomon.jpg", descricao: "Um Digimon pássaro corajoso com penas cor-de-rosa." },
    { id: 7, nome: "Tentomon", img: "../assets/digimons/rookies/tentomon.jpg", descricao: "Um Digimon inseto com uma carapaça resistente e inteligência avançada." }
];

const apiURL = 'http://localhost:8080/digimon/selecionar';


document.addEventListener("DOMContentLoaded", function () {

    //validarSlotsDigimon(); // Chama a função ao carregar a página

    const container = document.getElementById("digimon-container");
    const nomeContainer = document.getElementById("nome-container");
    const nomeInput = document.getElementById("digimon-nome");
    const confirmarBtn = document.getElementById("confirmar");
    const detalhesContainer = document.getElementById("detalhes-container");
    const detalhesNome = document.getElementById("detalhes-nome");
    const detalhesDescricao = document.getElementById("detalhes-descricao");

    let digimonSelecionado = null;

    // Criar os cards dinamicamente
    digimons.forEach(digimon => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `<img src="${digimon.img}" alt="${digimon.nome}"> <p>${digimon.nome}</p>`;
        card.onclick = () => selecionarDigimon(digimon, card);
        container.appendChild(card);
    });

    function selecionarDigimon(digimon, card) {
        document.querySelectorAll(".card").forEach(el => el.classList.remove("selected"));
        card.classList.add("selected");

        digimonSelecionado = digimon;
        nomeContainer.style.display = "block";

        // Exibir detalhes do Digimon
        detalhesNome.textContent = `Nome: ${digimon.nome}`;
        detalhesDescricao.textContent = digimon.descricao;
        detalhesContainer.style.display = "block";
        
        localStorage.setItem('chosenDigimon', digimon.nome);
    }


    confirmarBtn.addEventListener('click', async function () {
        if (digimonSelecionado && nomeInput.value.trim()) {
            localStorage.setItem('nickname', nomeInput.value);
            const nickname = nomeInput.value.trim();

            const sucesso = await efetivarEscolhaDigimon(); // Aguarda o retorno da função

            if (sucesso) {
                showCustomAlert(`Você escolheu ${localStorage.getItem('chosenDigimon')} e o apelidou de ${nickname}!`);
                localStorage.removeItem('chosenDigimon');
                localStorage.removeItem('nickname');
                // Aguarda 2 segundos antes de redirecionar para dar tempo de ver a mensagem
                setTimeout(() => {
                    window.location.href = 'continuarJornada.html';
                }, 2000); // 2000 milissegundos (2 segundos)
            }
        } else {
            showCustomAlert('Por favor, insira um apelido para seu Digimon.');
            return;
        }
    });

    function showCustomAlert(message) {
        const customAlertModal = document.createElement('div');
        customAlertModal.classList.add('custom-alert-modal');
        customAlertModal.innerHTML = `
            <div class="custom-alert-content">
                <span class="custom-alert-message">${message}</span><br><br>
                <button class="custom-alert-button">OK</button>
            </div>
        `;

        document.body.appendChild(customAlertModal);

        const alertButton = customAlertModal.querySelector('.custom-alert-button');
        alertButton.addEventListener('click', function () {
            customAlertModal.remove();
        });
    }
    
    async function efetivarEscolhaDigimon() {
        try {
            const jwtToken = localStorage.getItem('token');
            const nomeDigimon = localStorage.getItem('chosenDigimon');
            const apelidoDigimon = localStorage.getItem('nickname');
    
            if (!jwtToken || !nomeDigimon || !apelidoDigimon) {
                throw new Error("Dados do Digimon ou usuário não encontrados no localStorage.");
            }
    
            const requestBody = { jwtToken, nomeDigimon, apelidoDigimon };
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Caso use autenticação
                },
                body: JSON.stringify(requestBody)
            };
    
            const response = await fetch(apiURL, requestOptions);
            const responseData = await response.json(); // Converte a resposta para JSON
    
            if (!response.ok) {
                // Captura a mensagem de erro vinda do backend
                const errorMessage = responseData.errorMessage || `Erro na rede, status: ${response.status}`;
                throw new Error(errorMessage);
            }
    
            // Cadastro bem-sucedido
    
            /*console.log("DIGIMON CADASTRADO COM SUCESSO");*/

            return true;

        } catch (error) {
            // Exibe a mensagem de erro na tela
            displayError('Erro ao selecionar Digimon', error.message);
        }
    }

    function displayError(title, message) {
        Swal.fire({
            title: title,
            text: message,
            icon: 'error',
            confirmButtonText: 'Tentar novamente'
        });
    }

    function validarSlotsDigimon() {
        const nomeUsuario = localStorage.getItem('usuario');
    
        if (!nomeUsuario) {
            throw new Error("Dados do usuário não encontrados no localStorage.");
        }
    
        fetch(`http://localhost:8080/api/jogador/validarSlotsDigimon/${nomeUsuario}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(async response => {
            const contentType = response.headers.get("content-type");
    
            if (!response.ok) {
                const errorMessage = contentType && contentType.includes("application/json")
                    ? await response.json()  // Se for JSON, extrai o erro corretamente
                    : await response.text(); // Se for texto, pega a mensagem direto
    
                throw new Error(`Erro ${response.status}: ${errorMessage}`);
            }
    
            return response.json(); // Como a API retorna um número, tratamos como JSON
        })
        .then(slotsDisponiveis => {
            /*console.log("Número de slots disponíveis:", slotsDisponiveis);*/
    
            if (slotsDisponiveis <= 0) {
                Swal.fire({
                    icon: "error",
                    title: "Sem slots disponíveis",
                    text: "Você não possui slots suficientes para adicionar um novo Digimon.",
                    confirmButtonText: "OK"
                }).then(() => {
                    window.location.href = "status.html"; // Redireciona após fechar o alerta
                });
            }
        })
        .catch(error => {
            console.error("Erro ao validar slots:", error);
        });
    }

    });

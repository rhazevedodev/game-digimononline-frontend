document.addEventListener('DOMContentLoaded', function() {

    const carregarImagemURL = 'http://localhost:8080/usuarios/carregarColunaEsquerdaFixa/'+localStorage.getItem('idDigimon');
    const jwtToken = localStorage.getItem('token');
    
    let dataImagemDigimon = {};
    function carregarImagemDigimon() {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` 
            }
        };
    
        fetch(carregarImagemURL, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na rede, status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                dataImagemDigimon = data;
                atualizarImagemDigimon();
                atualizarNomeDigimon();
                manipularTier(dataImagemDigimon.tierDigimon);
                
            })
            .catch(error => {
                console.error('Erro ao fazer requisição:', error);
            });
        
    }

    async function atualizarImagemDigimon() {

        // Obtém o contêiner onde a imagem será adicionada
        const imageContainer = document.getElementById('image-container');

        // Remove qualquer imagem existente no contêiner
        while (imageContainer.firstChild) {
            imageContainer.removeChild(imageContainer.firstChild);
        }

        // Verifica se a URL da imagem está disponível
        if (dataImagemDigimon.urlImagemDigimon) {
            const imgElement = document.createElement('img');
            imgElement.src = dataImagemDigimon.urlImagemDigimon;
            imgElement.alt = "Imagem do Digimon";
            imgElement.width = 163;
            imgElement.height = 174;
            imgElement.className = "img-bordered";

            imageContainer.appendChild(imgElement);
        } else {
            console.error('URL da imagem não encontrada.');
        }

    }

    async function atualizarNomeDigimon() {
        // Obtém o contêiner onde o nome do Digimon será adicionado
        const digimonNameContainer = document.getElementById('digimon-name');

        // Remove qualquer texto existente no contêiner
        while (digimonNameContainer.firstChild) {
            digimonNameContainer.removeChild(digimonNameContainer.firstChild);
        }

        // Verifica se o nome do Digimon está disponível
        if (dataImagemDigimon && dataImagemDigimon.nomeDigimon) {
            // Cria um novo nó de texto para o nome do Digimon
            const digimonName = document.createElement('span');
            digimonName.textContent = dataImagemDigimon.nomeDigimon;

            // Adiciona o nome do Digimon ao contêiner
            digimonNameContainer.appendChild(digimonName);
        } else {
            console.error('Nome do Digimon não encontrado.');
        }
    }

    function manipularTier(numeroTier){
        tier1a5(numeroTier);
        let novoNumeroTier = numeroTier - 5;
        if(novoNumeroTier > 0){
            tier6a10(novoNumeroTier);
            novoNumeroTier = novoNumeroTier - 5;
            if(novoNumeroTier > 0){
                tier11a15(novoNumeroTier);
                novoNumeroTier = novoNumeroTier - 5;
                if(novoNumeroTier > 0){
                    tier16a20(novoNumeroTier);
                }
            }
        }

    }

    function tier1a5(numeroTier) {
        document.querySelectorAll('.estrela').forEach(estrela => {
            const posicao = parseInt(estrela.getAttribute('data-posicao'));
            if (posicao <= numeroTier) {
                estrela.classList.add('ativa-1-5'); // Estrela dourada
            } else {
                estrela.classList.remove('ativa'); // Estrela desativada
            }
        });
    }

    function tier6a10(numeroTier) {
        document.querySelectorAll('.estrela').forEach(estrela => {
            const posicao = parseInt(estrela.getAttribute('data-posicao'));
            if (posicao <= numeroTier) {
                estrela.classList.add('ativa-6-10'); // Estrela dourada
            } else {
                estrela.classList.remove('ativa'); // Estrela desativada
            }
        });
    }

    function tier11a15(numeroTier) {
        document.querySelectorAll('.estrela').forEach(estrela => {
            const posicao = parseInt(estrela.getAttribute('data-posicao'));
            if (posicao <= numeroTier) {
                estrela.classList.add('ativa-11-15'); // Estrela dourada
            } else {
                estrela.classList.remove('ativa'); // Estrela desativada
            }
        });
    }

    function tier16a20(numeroTier) {
        document.querySelectorAll('.estrela').forEach(estrela => {
            const posicao = parseInt(estrela.getAttribute('data-posicao'));
            if (posicao <= numeroTier) {
                estrela.classList.add('ativa-16-20'); // Estrela dourada
            } else {
                estrela.classList.remove('ativa'); // Estrela desativada
            }
        });
    }

    carregarImagemDigimon();

});
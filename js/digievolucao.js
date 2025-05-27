document.addEventListener('DOMContentLoaded', function () {
    const apiListarEvolucoes = 'http://localhost:8080/api/digievolucao/' + localStorage.getItem("idDigimon");
    const apiDigievoluir = 'http://localhost:8080/api/digievolucao/digievoluir'
    const jwtToken = localStorage.getItem('token');

    let evolucoes = []; // Armazena as evoluções recebidas da API
    /*let currentDigimon = null; // Armazena o digimon atual*/
    // Função para carregar os dados da API
    function carregarEvolucoes() {
        // Configurações da requisição
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` // Adiciona o token JWT no cabeçalho
            }
        };

        // Faz a requisição à API
        fetch(apiListarEvolucoes, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na rede, status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    const digimonName = 'este Digimon';
                    document.getElementById('evolucoes-container').innerHTML = `
                        <div class="no-evolution">
                            <p>Infelizmente, ${digimonName} ainda não possui nenhuma evolução disponível no momento.</p>
                        </div>
                    `;
                    return;
                }
                // Armazenar as evoluções recebidas
                evolucoes = data;
                /*currentDigimon = evolucoes[0].digimonOrigem; // Exemplo de pegar o nome do Digimon atual*/
                atualizarInterface();
            })
            .catch(error => {
                console.error('Erro ao fazer requisição:', error);
            });
    }

    // Função para atualizar a interface com as opções de evolução
    function atualizarInterface() {
        const evolucoesContainer = document.getElementById('evolucoes-container');

        // Limpa as opções de evolução
        evolucoesContainer.innerHTML = '';

        // Itera sobre as evoluções e cria os elementos para cada uma
        evolucoes.forEach((evolucao, index) => {
            const evolutionDiv = document.createElement('div');
            evolutionDiv.classList.add('evolution-card'); // Classe para estilização

            // Nome do Digimon
            const digimonName = document.createElement('h1');
            digimonName.textContent = evolucao.digimonDestino;

            // Imagem do Digimon
            const digimonImage = document.createElement('img');
            digimonImage.src = evolucao.pathImagemDigimonDestino;
            digimonImage.alt = evolucao.digimonDestino;
            digimonImage.id = `digimon-image`;

            // Tabela para exibir os requisitos de evolução
            const table = document.createElement('table');
            table.classList.add('evolution-table');

            // Função auxiliar para criar uma linha na tabela
            table.innerHTML = `
            <thead>
                <tr>
                    <th>Requisito</th>
                    <th>Disponível</th>
                    <th>Necessário</th>
                </tr>
            </thead>
            <tbody>
                <tr class="${evolucao.fragmentosDisponiveis >= evolucao.fragmentosNecessarios ? 'linha-verde' : ''}">
                    <td>Fragmentos</td>
                    <td class="coluna-centralizada">${evolucao.fragmentosDisponiveis}</td>
                    <td class="coluna-centralizada">${evolucao.fragmentosNecessarios}</td>
                </tr>
                <tr class="${evolucao.emblemasDisponiveis >= evolucao.emblemasNecessarios ? 'linha-verde' : ''}">
                    <td>Emblemas</td>
                    <td class="coluna-centralizada">${evolucao.emblemasDisponiveis}</td>
                    <td class="coluna-centralizada">${evolucao.emblemasNecessarios}</td>
                </tr>
                <tr class="${evolucao.nivelAtual >= evolucao.nivelMinimo ? 'linha-verde' : ''}">
                    <td>Nível</td>
                    <td class="coluna-centralizada">${evolucao.nivelAtual}</td>
                    <td class="coluna-centralizada">${evolucao.nivelMinimo}</td>
                </tr>
                ${evolucao.itemEspecialNecessario ? `
                <tr>
                    <td>Item Especial</td>
                    <td colspan="2" class="coluna-centralizada">${evolucao.itemEspecial} (Necessário)</td>
                </tr>` : ''}
            </tbody>
            `;

            // Botão de evolução
            const evolutionButton = document.createElement('button');
            evolutionButton.textContent = `Evoluir para ${evolucao.digimonDestino}`;
            evolutionButton.className = 'button-digievoluir';
            evolutionButton.disabled = !(evolucao.fragmentosDisponiveis >= evolucao.fragmentosNecessarios &&
                evolucao.emblemasDisponiveis >= evolucao.emblemasNecessarios &&
                evolucao.nivelAtual >= evolucao.nivelMinimo);

            evolutionButton.addEventListener('click', () => digivolve(index));

            // Montando a interface
            evolutionDiv.appendChild(digimonName);
            evolutionDiv.appendChild(digimonImage);
            evolutionDiv.appendChild(table);
            evolutionDiv.appendChild(evolutionButton);

            // Adiciona a div ao container principal
            evolucoesContainer.appendChild(evolutionDiv);
        });
    }

    // Função chamada ao clicar no botão de evolução
    function digivolve(index) {
        const evolucaoEscolhida = evolucoes[index];
        digievoluir(evolucaoEscolhida);

    }

    function digievoluir(evolucaoEscolhida) {
        // Dados que serão enviados no corpo da requisição
        const requestBody = {
            idDigimon: localStorage.getItem('idDigimon'),
            evolucaoEscolhida: evolucaoEscolhida.digimonDestino,
            fragmentosNecessarios: evolucaoEscolhida.fragmentosNecessarios,
            nivelMinimo: evolucaoEscolhida.nivelMinimo
        };
        // Configurações da requisição
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };

        fetch(apiDigievoluir, requestOptions)
            .then(response => {
                if (response.status === 200) {
                    // Se o status da resposta for 200, redireciona para a página de status
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso',
                        text: 'Parabéns! ' + evolucaoEscolhida.digimonOrigem + ' evoluiu para ' + evolucaoEscolhida.digimonDestino + '!',
                        confirmButtonText: 'Ok'
                    });
                    setTimeout(function () {
                        const redirectPage = 'status.html';
                        window.location.href = redirectPage;
                    }, 2000);
                } else {
                    // Se o status não for 200, lança um erro
                    return response.text().then(errorMessage => {
                        throw new Error(errorMessage);
                    });
                }
            })
            .catch(error => {
                console.error(error.message); // Exibe o erro no console
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: error.message, // Exibe a mensagem de erro com SweetAlert
                    confirmButtonText: 'Ok'
                });
            });
    }

    // Evento para carregar os dados ao iniciar a página
    window.onload = carregarEvolucoes;

});

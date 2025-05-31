document.addEventListener('DOMContentLoaded', function () {
    const apiURL = 'http://localhost:8080/api/telaCacada/carregar';
    const apiResgateCacadaURL = 'http://localhost:8080/api/telaCacada/resgatarRecompensa';
    const apiIniciarCacadaURL = 'http://localhost:8080/api/telaCacada/iniciarCacada';


    
    let dataCacadas = {};
    function carregarTelaCacadas() {
        // Dados que serão enviados no corpo da requisição
        const requestBody = {
            idDigimon: localStorage.getItem('idDigimon')
        };
        // Configurações da requisição
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };

        fetch(apiURL, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na rede, status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                // Armazenar os dados recebidos da API
                dataCacadas = {
                    tempoDisponivel: data.tempoDisponivel,
                    emAndamento: data.emAndamento,
                    horaResgate: data.horaResgate,
                    resgateDisponivel: data.resgateDisponivel,
                    nivel: data.nivel,
                    vida: data.vida,
                    energia: data.energia
                    // Adicionar mais atributos conforme necessário
                };
                // Atualizar a interface com os dados recebidos
                carregarCaixaCacadaPorTempo(dataCacadas);
            })
            .catch(error => {
                console.error('Erro ao fazer requisição:', error);
            });
    }

    let dataRecompensaCacada = {};
    function resgatarRecompensa(idDigimon) {
        // Dados que serão enviados no corpo da requisição
        const requestBody = localStorage.getItem('idDigimon');
        // Configurações da requisição
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };

        fetch(apiResgateCacadaURL, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na rede, status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                // Armazenar os dados recebidos da API
                dataRecompensaCacada = {
                    digimon: data.digimon,
                    recompensaBits: data.recompensaBits,
                    recompensaExp: data.recompensaExp,
                    recompensaFragmento: data.recompensaFragmento,
                    quantidadeFragmentos: data.quantidadeFragmentos
                    // Adicionar mais atributos conforme necessário
                };

                // Exibir os dados no modal
                const resultadoContent = document.getElementById('resultadoCacadaContent');
                resultadoContent.innerHTML = `
                            <hr class="separador">    
                            <p>Bits: ${dataRecompensaCacada.recompensaBits}</p>
                            <p>Experiência: ${dataRecompensaCacada.recompensaExp}</p>
                            <p>Fragmento: ${dataRecompensaCacada.recompensaFragmento}</p>
                            <p>Quantidade de Fragmentos: ${dataRecompensaCacada.quantidadeFragmentos}</p>
                            <hr class="separador">
                            `;

                // Abrir o modal
                const modal = document.getElementById('resultadoModal');
                modal.style.display = 'block';

            })
            .catch(error => {
                console.error('Erro ao fazer requisição:', error);
            });
    }

    let dataIniciarCacada = {};
    function iniciarCacada(tempoMinutos) {
        // Dados que serão enviados no corpo da requisição
        const requestBody = {
            idDigimon: localStorage.getItem('idDigimon'),
            minutos: tempoMinutos
        };
    
        // Configurações da requisição
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };

        console.log("Corpo da requisicao: "+JSON.stringify(requestBody));
    
        fetch(apiIniciarCacadaURL, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na rede, status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                // Armazenar os dados recebidos da API
                dataIniciarCacada = {
                    id: data.id,
                    idDigimon: data.idDigimon,
                    data: data.data,
                    minutos: data.minutos,
                    horaResgateDisponivel: data.horaResgateDisponivel,
                    recompensaResgatada: data.recompensaResgatada,
                    ultimaAlteracao: data.ultimaAlteracao
                };
    
                // Recarrega a página após iniciar a caçada
                location.reload();
            })
            .catch(error => {
                console.log('xxxxRafael - Erro ao fazer requisição:', error);
                console.error('xxxxErro ao fazer requisição:', error);
            });
    }

    function carregarCaixaCacadaPorTempo(dataCacadas) {
        const container = document.getElementById('caixa-cacada-tempo');
        container.innerHTML = ''; // Limpa o conteúdo existente

        if (dataCacadas.emAndamento === true) {
            container.innerHTML = `
                        <div id="caixa_informacoes_bloq">
                            <p style="text-align: center;"><strong>Já existe uma caçada em andamento. 
                                <br>
                                Ela será encerrada em ${dataCacadas.horaResgate}</strong></p>
                        </div>
                        `;
            if (dataCacadas.resgateDisponivel === true) {
                container.innerHTML += `
                <hr class="separador">
                            <div align="center" style="margin-right: 10px; margin-top: 10px;">
                                <button type="button" class="button-confirmar" id="button-resgatar-recompensa-cacada">
                                    Resgatar
                                </button>
                            </div>
                            `;
            }

        } else {
            if (dataCacadas.tempoDisponivel === 0) {
                container.innerHTML = `
                            <div id="caixa_informacoes_bloq">
                                <p style="text-align: center;">
                                    Você já não tem mais tempo disponível hoje. Volte outro dia.</p>
                            </div>
                            `;
            } else {
                container.innerHTML = `
                            <p style="text-align: justify;">Aqui você poderá caçar digimons inimigos durante um período
                                máximo de 60 minutos por dia e poderá ganhar bits e experiência (jogadores premium tem
                                120
                                minutos por dia).</p>

                            <br>
                            <p style="text-align: justify;"></p><strong>Dica</strong>: Procure fazer suas caçadas de 10
                            em
                            10 minutos para aumentar sua renda em bits e
                            experiência!</p>

                            <hr class="separador">
                            <table border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                    <fieldset>
                                        <legend>&nbsp;Caçar por Tempo</legend>
                                        <div class="cacada-box">
                                            Tempo em Minutos
                                            <br>
                                            <br>
                                            <select name="tempoCacada" id="tempoCacada" class="select-cacada">
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                                <option value="30">30</option>
                                                <option value="40">40</option>
                                                <option value="50">50</option>
                                                <option value="60">60</option>
                                            </select>

                                            <span class="descricao-campos">
                                                <br>
                                                <br>
                                                Selecione a quantidade de minutos que deseja usar para caçar!
                                            </span>
                                            </div>  
                                    </fieldset>
                                </tbody>
                            </table>
                            <hr class="separador">
                            <div align="center" style="margin-right: 10px; margin-top: 10px;">
                                <button type="button" class="button-confirmar" id="button-iniciar-cacada">
                                    Iniciar
                                </button>
                            </div>
                                `;
            }
        }
    }

    // Event listener para o botão de iniciar caçada
    document.addEventListener('click', function (event) {
        if (event.target && event.target.id === 'button-iniciar-cacada') {
            if (dataCacadas.tempoDisponivel < parseInt(document.querySelector("#tempoCacada").value)) {
                // Exibir os dados no modal
                const erroModalContent = document.getElementById('erroModalContent');
                erroModalContent.innerHTML = `
                            <hr class="separador">    
                            <p>Você não tem tempo disponível suficiente para o tempo de caçada escolhido.</p>
                            <p>Seu tempo disponível é de <strong>${dataCacadas.tempoDisponivel}</strong> minutos.</p>
                            <hr class="separador">
                            `;

                // Abrir o modal
                const modal = document.getElementById('erroModal');
                modal.style.display = 'block';

            } else {
                const tempoMinutos = parseInt(document.querySelector("#tempoCacada").value)
                // Captura o valor atual da barra de energia
                const energyText = document.getElementById('energy-bar-text').textContent; // Exemplo: "0/100"
                
                // Extrai o valor atual de energia usando split para separar "0" e "100"
                const currentEnergy = parseInt(energyText.split('/')[0]);
            
                // Verifica se o jogador tem energia suficiente (maior que 0)
                if (currentEnergy === 0) {
                    // Exibe um alerta informando que o jogador está sem energia
                    Swal.fire({
                        icon: 'error',
                        title: 'Sem Energia!',
                        text: 'Você não tem energia suficiente para iniciar uma caçada.',
                        confirmButtonText: 'Entendi'
                    });
                    return; // Interrompe a execução da função se não houver energia
                } else {
                    // Caso tenha energia, prossegue com a caçada
                    iniciarCacada(tempoMinutos);
                    //location.reload();
                }
            }
        }
        if (event.target && event.target.id === 'button-resgatar-recompensa-cacada') {
            const idDigimon = '3';
            resgatarRecompensa(idDigimon);
        }
        if (event.target && event.target.className === 'close' || event.target.id === 'fecharModal') {
            const modal = document.getElementById('resultadoModal');
            const erroModal = document.getElementById('erroModal');
            modal.style.display = 'none';
            erroModal.style.display = 'none';

            location.reload();  // Recarregar a página depois que o modal for fechado

        }
    });

    carregarTelaCacadas();

});


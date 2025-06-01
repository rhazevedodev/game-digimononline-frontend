document.addEventListener('DOMContentLoaded', () => {

    const obterCacadasURL = 'http://localhost:8080/cacada/carregar/' + localStorage.getItem('idDigimon');
    const iniciarCacadaURL = 'http://localhost:8080/cacada/iniciarCacada';
    const finalizarCacadaURL = 'http://localhost:8080/cacada/resgatarRecompensa';
    const jwtToken = localStorage.getItem('token');

    /*
    const duracaoCaçada = 1; // 10 minutos em segundos
    */

    async function fetchIniciarCacada(url, cacada) {
        // Exemplo de lógica ao iniciar a caçada
        console.log("Iniciando caçada...");
        console.log("Caçada:", cacada);

        const body = {
            idDigimon: localStorage.getItem('idDigimon'),
            cacadaSelecionada: cacada // Usa o objeto cacada diretamente
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (response.status === 200) {
                console.log("Caçada iniciada com sucesso!");
            } else {
                console.log("Entrou na exceção");
                throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error("Erro ao enviar a caçada:", error);
            throw error;
        }
    }


    let dataCacadas = {};
    function fetchCacadas() {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        };
        fetch(obterCacadasURL, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                dataCacadas = data; // Agora sim, data é o array de caçadas
                console.log('Caçadas carregadas com sucesso:', dataCacadas);
                renderizarCacadas(); // renderiza só depois de carregar
            })
            .catch(error => {
                console.error('Erro ao carregar os Digimons:', error);
            });
    }

    async function fetchRecompensaCacada(caçada) {
        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            }
        };
        try {
            const response = await fetch(finalizarCacadaURL + '/' + caçada.id + '/' + localStorage.getItem('idDigimon'), requestOptions);
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Recompensa da caçada resgatada com sucesso:', data);
            return data;  // <-- Retorna os dados da recompensa
        } catch (error) {
            console.error('Erro ao resgatar recompensa:', error);
            throw error;
        }
    }

    function formatarTempo(segundos) {
        const min = String(Math.floor(segundos / 60)).padStart(2, '0');
        const sec = String(segundos % 60).padStart(2, '0');
        return `${min}:${sec}`;
    }

    function bloquearBotoes(status) {
        const botoes = document.querySelectorAll(".hunt-card button");
        botoes.forEach(btn => {
            btn.disabled = status;
            btn.style.opacity = status ? "0.5" : "1";
            btn.style.cursor = status ? "not-allowed" : "pointer";
        });
    }

    function criarCardCaçada(caçada) {
        const card = document.createElement("div");
        card.className = "hunt-card";
        card.id = `caçada-${caçada.id}`;

        const info = document.createElement("div");
        info.className = "hunt-info";
        info.innerHTML = `
          <h3>${caçada.nome}</h3>
          <p>Tier: ${caçada.tier} | Poder necessário: ${caçada.requisitos.poder_total}</p>
        `;

        const btn = document.createElement("button");
        btn.textContent = "Iniciar Caçada";

        // Adicionando uma ID ao botão
        btn.id = "btn-iniciar-cacada";

        // Adicionando uma ou mais classes ao botão
        btn.classList.add("btn", "btn-iniciar");

        btn.onclick = () => iniciarCaçada(card, caçada, false);

        card.appendChild(info);
        card.appendChild(btn);

        if (caçada.cacadaAtiva && typeof caçada.cacadaAtiva.segundosRestantes === "number") {
            // Se a caçada já está ativa, iniciar o temporizador
            let cacadaAtiva = true;
            iniciarCaçada(card, caçada, cacadaAtiva);
        }

        return card;
    }

    function iniciarCaçada(card, caçada, cacadaAtiva) {
        //bloquearBotoes(true);

        let tempoRestante = 0;
        if (!cacadaAtiva) {
            fetchIniciarCacada(iniciarCacadaURL, caçada)
            tempoRestante = caçada.duracao_segundos;
        } else {
            // Se a caçada já está ativa, usar o tempo restante da caçada ativa
            tempoRestante = caçada.cacadaAtiva.segundosRestantes;
            console.log("Tempo restante da caçada ativa:", tempoRestante);
        }
        const fim = new Date(Date.now() + tempoRestante * 1000);

        card.innerHTML = `
          <div class="hunt-info">
            <h3>${caçada.nome}</h3>
            <p>Tier: ${caçada.tier} | Poder necessário: ${caçada.requisitos.poder_total}</p>
          </div>
          <div class="status-container">
            <p>Tempo restante: ${formatarTempo(tempoRestante)}</p>
          </div>
        `;

        const intervalId = setInterval(() => {
            const agora = new Date();
            const diff = Math.max(0, Math.floor((fim - agora) / 1000));

            const statusP = card.querySelector('.status-container p');
            if (statusP) {
                statusP.textContent = `Tempo restante: ${formatarTempo(diff)}`;
            }

            if (diff <= 0) {
                clearInterval(intervalId);
                finalizarCaçada(card, caçada);
            }
        }, 1000);
    }

    function finalizarCaçada(card, caçada) {
        card.innerHTML = `
          <div class="hunt-info">
            <h3>${caçada.nome}</h3>
          </div>
          <div class="status-container">
            <button>Resgatar Recompensa</button>
          </div>
        `;

        const btn = card.querySelector('button');
        btn.onclick = () => abrirModalRecompensa(caçada, card);
    }

    async function abrirModalRecompensa(caçada, card) {
        const modalOverlay = document.getElementById("modal-overlay");
        const textoRecompensa = document.getElementById("modal-reward-text");

        try {
            const recompensa = await fetchRecompensaCacada(caçada); // agora retorna a recompensa
            if (!recompensa) {
                textoRecompensa.innerHTML = "<p>Erro ao obter recompensa.</p>";
            } else {
                let html = "";

                if (recompensa.itens && recompensa.itens.length > 0) {
                    html += "<strong>Itens:</strong><ul>";
                    recompensa.itens.forEach(item => {
                        html += `<li>${item.nome} x${item.quantidade}</li>`;
                    });
                    html += "</ul>";
                }

                if (recompensa.exp) {
                    html += `<p><strong>EXP:</strong> +${recompensa.exp}</p>`;
                }

                if (recompensa.bits) {
                    html += `<p><strong>Bits:</strong> +${recompensa.bits}</p>`;
                }

                textoRecompensa.innerHTML = html;
                textoRecompensa.style.textAlign = "left";
            }
        } catch (error) {
            textoRecompensa.innerHTML = "<p>Erro ao processar a recompensa.</p>";
        }

        modalOverlay.style.display = "flex";

        const btnFechar = document.getElementById("modal-close-btn");
        btnFechar.onclick = () => {
            modalOverlay.style.display = "none";

            const novoCard = criarCardCaçada(caçada);
            card.replaceWith(novoCard);
            bloquearBotoes(false);
            location.reload(); // Adiciona o comando para recarregar a página

        };
    }

    fetchCacadas();

    function renderizarCacadas() {
        const lista = document.getElementById("hunt-list");
        lista.innerHTML = ""; // Limpa caçadas antigas, se houver

        dataCacadas.forEach(cacada => {
            const card = criarCardCaçada(cacada);
            lista.appendChild(card);
        });
    }

    // Renderizar todas as caçadas
    /*
    const lista = document.getElementById("hunt-list");
    dataCacadas.forEach(dataCacada => {
        const card = criarCardCaçada(dataCacada);
        lista.appendChild(card);
    });
    */
});
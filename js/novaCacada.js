document.addEventListener('DOMContentLoaded', () => {
    const caçadas = [
        {
            id: 1, nome: "Floresta Sombria", tier: "S", poder: 3200,
            recompensa: {
                itens: [
                    { nome: "Item Raro", quantidade: 2 },
                    { nome: "Poção Curativa", quantidade: 5 }
                ],
                exp: 500,
                bits: 1200
            }
        },
        {
            id: 2, nome: "Ruínas Digitais", tier: "A", poder: 2800,
            recompensa: {
                itens: [
                    { nome: "Fragmento Digital", quantidade: 1 }
                ],
                exp: 300,
                bits: 800
            }
        },
        {
            id: 3, nome: "Caverna Subterrânea", tier: "B", poder: 2100,
            recompensa: {
                itens: [
                    { nome: "Poção", quantidade: 3 }
                ],
                exp: 150,
                bits: 400
            }
        }
    ];

    const duracaoCaçada = 1; // 10 minutos em segundos

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
          <p>Tier: ${caçada.tier} | Poder necessário: ${caçada.poder}</p>
        `;

        const btn = document.createElement("button");
        btn.textContent = "Iniciar Caçada";
        btn.onclick = () => iniciarCaçada(card, caçada);

        card.appendChild(info);
        card.appendChild(btn);

        return card;
    }

    function iniciarCaçada(card, caçada) {
        bloquearBotoes(true);

        let tempoRestante = duracaoCaçada;
        const fim = new Date(Date.now() + tempoRestante * 1000);

        card.innerHTML = `
          <div class="hunt-info">
            <h3>${caçada.nome}</h3>
            <p>Tier: ${caçada.tier} | Poder necessário: ${caçada.poder}</p>
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
            <p>Caçada concluída!</p>
            <button>Resgatar Recompensa</button>
          </div>
        `;

        const btn = card.querySelector('button');
        btn.onclick = () => abrirModalRecompensa(caçada, card);
    }

    function abrirModalRecompensa(caçada, card) {
        const modalOverlay = document.getElementById("modal-overlay");
        const textoRecompensa = document.getElementById("modal-reward-text");

        let html = "";

        if (caçada.recompensa.itens && caçada.recompensa.itens.length > 0) {
            html += "<strong>Itens:</strong><ul>";
            caçada.recompensa.itens.forEach(item => {
                html += `<li>${item.nome} x${item.quantidade}</li>`;
            });
            html += "</ul>";
        }

        if (caçada.recompensa.exp) {
            html += `<p><strong>EXP:</strong> +${caçada.recompensa.exp}</p>`;
        }

        if (caçada.recompensa.bits) {
            html += `<p><strong>Bits:</strong> +${caçada.recompensa.bits}</p>`;
        }

        textoRecompensa.innerHTML = html;
        textoRecompensa.style.textAlign = "left";

        modalOverlay.style.display = "flex";

        const btnFechar = document.getElementById("modal-close-btn");
        btnFechar.onclick = () => {
            modalOverlay.style.display = "none";

            const novoCard = criarCardCaçada(caçada);
            card.replaceWith(novoCard);
            bloquearBotoes(false);
        };
    }

    // Renderizar todas as caçadas
    const lista = document.getElementById("hunt-list");
    caçadas.forEach(caçada => {
        const card = criarCardCaçada(caçada);
        lista.appendChild(card);
    });
});

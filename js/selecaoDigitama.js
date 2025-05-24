document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token"); // ou sessionStorage.getItem("token")

    let digitamas = [];
    let atual = 0;

    async function carregarDigitamas() {
        try {
            const response = await fetch('http://localhost:8080/digimon/carregarDigitamas', {
                method: 'GET', // Método da requisição
                headers: {
                    'Content-Type': "application/json", // Define o tipo de conteúdo
                    'Authorization': `Bearer ${token}`, // Substitua pelo token real, se necessário
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar os digitamas');
            }

            const data = await response.json();
            digitamas = data.digitamas;
            atualizarCard();
        } catch (error) {
            console.error(error);
            alert('Não foi possível carregar os digitamas. Tente novamente mais tarde.');
        }
    }

    function atualizarCard() {
        if (digitamas.length === 0) return; // Garante que só atualiza se houver dados
        const digitama = digitamas[atual];
        document.getElementById("digitama-img").src = digitama.image;
        document.getElementById("digitama-img").alt = digitama.nome; // Atualiza com o campo "nome"
        document.getElementById("digitama-name").innerText = digitama.nome; // Atualiza com o campo "nome"
    }

    document.getElementById('btn-proximo').addEventListener('click', proximo);

    function proximo() {
        if (digitamas.length === 0) return;
        atual = (atual + 1) % digitamas.length;
        atualizarCard();
    }

    document.getElementById('btn-anterior').addEventListener('click', anterior);

    function anterior() {
        if (digitamas.length === 0) return;
        atual = (atual - 1 + digitamas.length) % digitamas.length;
        atualizarCard();
    }

    document.getElementById('btn-selecionar').addEventListener('click', selecionarDigitama);

    function selecionarDigitama() {
        if (digitamas.length === 0) return;
        const escolhida = digitamas[atual];
        alert(`Você escolheu: ${escolhida.nome}\nID: ${escolhida.idValue}\nPossíveis Bebês: ${escolhida.possibleBaby1.join(', ')}`);
    }

    // Inicializa com a primeira
    carregarDigitamas();
});
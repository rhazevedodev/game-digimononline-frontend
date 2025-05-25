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
            localStorage.setItem("digitamas", JSON.stringify(digitamas)); // Armazena os digitamas no localStorage
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

    async function selecionarDigitama() {
        if (digitamas.length === 0) return;

        // Obtém os valores necessários para o corpo da requisição
        const escolhida = digitamas[atual];
        const idDigitama = escolhida.idValue; // ID do digitama atual
        console.log(`ID Digitama: ${idDigitama}`);
    
        try {
            const response = await fetch('http://localhost:8080/digimon/selecionarDigitama', {
                method: 'POST', // Método da requisição
                headers: {
                    'Content-Type': "application/json", // Define o tipo de conteúdo
                    'Authorization': `Bearer ${token}`, // Substitua pelo token real, se necessário
                },
                body: JSON.stringify({ 
                    idDigitama // Corpo da requisição com o ID do digitama
                 }) // Corpo da requisição com o ID do digitama
            });
    
            if (!response.ok) {
                throw new Error('Erro ao selecionar o digitama');
            }
    
            const data = await response.json();
            console.log('Digitama selecionado com sucesso:', data);
            alert('Digitama selecionado com sucesso!');

            localStorage.setItem("pathDigitama", data.pathDigitama); // Armazena o caminho da imagem do digitama
            localStorage.setItem("idDigitama", idDigitama); // Armazena o ID do digitama selecionado
            
            window.location.href = "chocandoDigitama.html"; // Redireciona para a próxima página
        } catch (error) {
            console.error(error);
            alert('Não foi possível selecionar o digitama. Tente novamente mais tarde.');
        }
    }

    // Inicializa com a primeira
    carregarDigitamas();
});
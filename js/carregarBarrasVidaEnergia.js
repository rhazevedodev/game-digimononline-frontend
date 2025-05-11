document.addEventListener('DOMContentLoaded', function() {

    const carregarBarrasHPEnergiaURL = 'http://localhost:8080/digimon/carregarVidaEnergia/'+localStorage.getItem('idDigimon');
    const token = localStorage.getItem("token"); // ou sessionStorage.getItem("token")

    let dataBarras = {};

    function carregarBarrasHPEnergia() {
    
        const requestOptions = {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`, // <-- Aqui vai o JWT
                'Content-Type': 'application/json'
            }
        };
    
        fetch(carregarBarrasHPEnergiaURL, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na rede, status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                dataBarras = data;
                atualizarBarras();
                console.log(dataBarras);
            })
            .catch(error => {
                console.error('Erro ao fazer requisição:', error);
            });
        
    }

    function atualizarBarras() {
        displayLifeBar();
        displayEnergyBar();
    }

    function displayLifeBar() {
        var vidaTotal = parseInt(dataBarras.baseVida) + parseInt(dataBarras.manipulavelVida)+ parseInt(dataBarras.modificadoresVida);

        //var vidaTotal = 50 * parseInt(dataBarras.nivel);
        const vidaAtual = dataBarras.vida; // Pontos de vida atuais
        const vidaMaxima = vidaTotal; // Pontos de vida máximos

        // Calcula a largura da barra de vida com base na porcentagem
        const lifeBarWidth = (vidaAtual / vidaMaxima) * 100;
        const lifeBar = document.getElementById('life-bar');
        if (lifeBar) { // Verifica se o elemento existe
            lifeBar.style.width = lifeBarWidth + '%';
        } else {
            console.error('Elemento "life-bar" não encontrado');
        }

        const lifeBarText = document.getElementById('life-bar-text');
        if (lifeBarText) {
            lifeBarText.textContent = `${vidaAtual}/${vidaMaxima}`;
        } else {
            console.error('Elemento "life-bar-text" não encontrado');
        }

    }

    function displayEnergyBar() {
        var energiaTotal = parseInt(dataBarras.baseEnergia) + parseInt(dataBarras.manipulavelEnergia)+ parseInt(dataBarras.modificadoresEnergia);
        const energiaAtual = dataBarras.energia; // Pontos de energia atuais
        const energiaMaxima = energiaTotal; // Pontos de energia máximos

        // Calcula a largura da barra de vida com base na porcentagem
        const energyBarWidth = (energiaAtual / energiaMaxima) * 100;
        const energyBar = document.getElementById('energy-bar');
        energyBar.style.width = energyBarWidth + '%';

        const energyBarText = document.getElementById('energy-bar-text');
        energyBarText.textContent = `${energiaAtual}/${energiaMaxima}`;

    }

    carregarBarrasHPEnergia();
    
});
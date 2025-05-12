document.addEventListener('DOMContentLoaded', function() {

const premiumAPIURL = 'http://localhost:8080/api/premium/carregarInformacoesDeTelaPremium/'+localStorage.getItem('idDigimon');
const token = localStorage.getItem("token"); // ou sessionStorage.getItem("token")

let dataInformacoesPremium = {};

function carregarInformacoesPremium() {

    const requestOptions = {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`, // <-- Aqui vai o JWT
            'Content-Type': 'application/json'
        }
    };

    fetch(premiumAPIURL, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na rede, status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            dataInformacoesPremium = data;
            atualizarInterfacePremium();
        })
        .catch(error => {
            console.error('Erro ao fazer requisição:', error);
        });
    
}

function atualizarInterfacePremium(){

    const container = document.getElementById('caixa-premium-fora');
    container.innerHTML = ''; // Limpa o conteúdo existente

    if (dataInformacoesPremium.status === 'Ativo') {
        container.innerHTML = `
            <h3 class="titulo-caixa">Premium</h3>
            <hr class="separador">
            <div id="caixa-premium">
                <p style="padding-left: 10px;">De:</p>
                <p id="premium_inicio" style="padding-left: 10px;">${dataInformacoesPremium.dataInicio}</p>
                <p style="padding-left: 10px;">Até:</p>
                <p id="premium_fim" style="padding-left: 10px;">${dataInformacoesPremium.dataFim}</p>
            </div>
        `;
    } else {
        container.innerHTML = `
            <h3 class="titulo-caixa">Premium</h3>
            <hr class="separador">
            <div id="caixa-premium">
                <p style="padding: 15px; text-align:center;">Sem Premium Ativo</p>
            </div>
        `;
    }

}

carregarInformacoesPremium();

});
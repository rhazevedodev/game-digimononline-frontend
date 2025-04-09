document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById('cardsContainer');
    const validarSlotsDigimonURL = "http://localhost:8080/usuarios/validarSlotsDigimon";
    const carregarPontosDigitaisURL = "http://localhost:8080/usuarios/carregarPontosDigitais";
    const obterDigimonsURL = "http://localhost:8080/usuarios/obterDigimons";
    const jwtToken = localStorage.getItem('token');

    function createDigimonCard(dataContinuarJornada) {
        const card = document.createElement('div');
        card.className = 'card';

        const imgSrc = dataContinuarJornada.urlImagemDigimon;

        card.innerHTML = `
            <img src="${imgSrc}" alt="${dataContinuarJornada.digimon.nome}">
            <div class="card-title">${dataContinuarJornada.digimon.nome}</div>
            <p>Energia: ${dataContinuarJornada.digimon.atributos.pontosEnergia}</p>
            <p>Vida: ${dataContinuarJornada.digimon.atributos.pontosVida}</p>
            <p>Nível: ${dataContinuarJornada.digimon.nivel}</p>
            <p>Bits: ${dataContinuarJornada.digimon.bits}</p>
            <div hidden>${dataContinuarJornada.digimon.id}</div>
            <button class="card-btn" data-id="${dataContinuarJornada.digimon.id}">Continuar</button>
            <button class="card-btn-sacrificar" data-id="${dataContinuarJornada.digimon.id}">Sacrificar</button>
        `;

        // Adiciona evento ao botão "Continuar"
        card.querySelector('.card-btn').addEventListener('click', function () {
            handleContinueButtonClick(dataContinuarJornada);
        });

        // Adiciona evento ao botão "Sacrificar"
        card.querySelector('.card-btn-sacrificar').addEventListener('click', function () {
            handleSacrificeButtonClick(dataContinuarJornada);
        });

        return card;
    }

    function handleContinueButtonClick(dataContinuarJornada) {
        localStorage.setItem('idDigimon', dataContinuarJornada.digimon.id);
        window.location.href = 'status.html';
    }

    // Função para lidar com o botão "Sacrificar"
    function handleSacrificeButtonClick(dataContinuarJornada) {
        Swal.fire({
            title: `Sacrificar ${dataContinuarJornada.digimon.nome}?`,
            text: "Essa ação é irreversível e seu Digimon será perdido para sempre!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, sacrificar!",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                // Adicione aqui a lógica para remover o Digimon do jogo, chamar uma API, etc.
                fetchSacrificarDigimon(dataContinuarJornada.digimon.id);

            }
        });
    }


    let dataContinuarJornada = {};
    function fetchDigimons() {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` 
            }
        };
        fetch(obterDigimonsURL,requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                data.forEach(data => {
                    dataContinuarJornada = data;
                    const card = createDigimonCard(dataContinuarJornada);
                    container.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar os Digimons:', error);
            });
    }

    function carregarPontosDigitais() {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` 
            }
        };

        fetch(carregarPontosDigitaisURL,requestOptions) 
            .then(response => response.json())
            .then(data => {
                /*console.log("Pontos digitais carregados com sucesso:", data);*/
                if (data == null) {
                    document.getElementById("digitalPoints").textContent = 0;
                } else {
                    document.getElementById("digitalPoints").textContent = data;
                }
            })
            .catch(error => {
                console.error("Erro ao carregar pontos digitais:", error);
            });
    }

    function carregarDigimonsAtivosxDigimonsDisponiveis() {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` 
            }
        };
        fetch(validarSlotsDigimonURL,requestOptions) // Substitua pela URL correta da API
            .then(response => response.json())
            .then(data => {
                /*console.log("Pontos digitais carregados com sucesso:", data);*/
                if (data == null) {
                    document.getElementById("digimonStatus").textContent = "0/0";
                } else {
                    document.getElementById("digimonStatus").textContent = `${data.digimonsAtivos}/${data.slotsDigimon}`;

                    // Verifica se há slots disponíveis para mostrar o botão
                    if (data.digimonsAtivos < data.slotsDigimon) {
                        escolherDigimonBtn.style.display = "block";
                    } else {
                        escolherDigimonBtn.style.display = "none";
                    }
                }
            })
            .catch(error => {
                console.error("Erro ao carregar pontos digitais:", error);
            });
    }

    fetchDigimons();
    carregarPontosDigitais();
    carregarDigimonsAtivosxDigimonsDisponiveis();

});
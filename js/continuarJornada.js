document.addEventListener("DOMContentLoaded", function () {

    const carregarPontosDigitaisURL = "http://localhost:8080/usuarios/carregarPontosDigitais";
    const jwtToken = localStorage.getItem('token');
    

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
    carregarPontosDigitais();

});
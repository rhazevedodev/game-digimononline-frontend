document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token"); // ou sessionStorage.getItem("token")
    const eggScreen = document.getElementById("eggImage");
    const pathDigitama = localStorage.getItem("pathDigitama");
    const idDigitama = localStorage.getItem("idDigitama"); // ID do digitama selecionado

    if (pathDigitama) {
      eggScreen.src = pathDigitama; // Atribui o valor do localStorage ao atributo src
    }

    let data = [];
    async function carregarDigimonChocado() {
        try {
            const response = await fetch('http://localhost:8080/digimon/chocarDigitama/'+idDigitama, {
                method: 'GET', // Método da requisição
                headers: {
                    'Content-Type': "application/json", // Define o tipo de conteúdo
                    'Authorization': `Bearer ${token}`, // Substitua pelo token real, se necessário
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar os digitamas');
            }

            data = await response.json();
            console.log(data);
        } catch (error) {
            console.error(error);
            alert('Não foi possível carregar os digitamas. Tente novamente mais tarde.');
        }
    }

    let clickCount = 0;
    const maxClicks = 5;
    const eggImage = document.getElementById("eggImage");
    const statusText = document.getElementById("status");
    const continueBtn = document.getElementById("continueBtn");
    let shakeDirection = true;

    eggImage.addEventListener("click", chocarDigitama);
    function chocarDigitama() {
      if (clickCount >= maxClicks) return;

      eggImage.classList.remove("shake-left", "shake-right");
      eggImage.classList.add(shakeDirection ? "shake-left" : "shake-right");
      shakeDirection = !shakeDirection;

      setTimeout(() => {
        eggImage.classList.remove("shake-left", "shake-right");
      }, 150);

      clickCount++;

      if (clickCount >= maxClicks) {
        carregarDigimonChocado();

        setTimeout(() => {
          eggImage.className = "revealed";
          eggImage.src = data.pathImage;
          eggImage.alt = data.digimonSorteado;
          statusText.textContent = `Nasceu: `+data.digimonSorteado;
          continueBtn.style.display = "inline-block";

          // Ex: salvar no localStorage se quiser
          // localStorage.setItem("digimon_nascido", escolhido);
        }, 300);
      }
    }

    document.getElementById('continueBtn').addEventListener('click', continuar);
    function continuar() {
      // Exemplo: redirecionar para próxima etapa
      window.location.href = "continuarJornada.html";
      //alert("Indo para a próxima etapa...");
      localStorage.removeItem("pathDigitama"); // Limpa o localStorage após continuar
      localStorage.removeItem("idDigitama"); // Limpa o ID do digitama selecionado
      localStorage.removeItem("digitamaSelecionado"); // Limpa o token, se necessário
      localStorage.removeItem("digitamas"); // Limpa o token, se necessário
    }


});
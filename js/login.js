document.addEventListener('DOMContentLoaded', () => {

    const primeiroAcessoURL = 'http://localhost:8080/usuarios/primeiroAcesso/';

    document.getElementById('loginForm').addEventListener('submit', verificarPrimeiroAcesso);

    async function verificarPrimeiroAcesso() {
      event.preventDefault();
        try {
          console.log('iniciado verificarPrimeiroAcesso')
          const usuario = document.getElementById('username').value.trim();
          const response = await fetch(primeiroAcessoURL+usuario);
      
          if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
          }
      
          const primeiroAcesso = await response.json();
      
          if (primeiroAcesso === true) {
            console.log("É o primeiro acesso do usuário.");
            // Aqui você pode chamar alguma função ou exibir um aviso
          } else {
            console.log("Usuário já acessou anteriormente.");
          }
        } catch (erro) {
          console.error("Erro ao verificar primeiro acesso:", erro);
        }
      }

});
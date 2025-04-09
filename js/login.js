document.addEventListener('DOMContentLoaded', () => {
  const primeiroAcessoURL = 'http://localhost:8080/usuarios/primeiroAcesso/';
  const loginURL = 'http://localhost:8080/auth/login';

  document.getElementById('loginForm').addEventListener('submit', autenticarUsuario);

  async function autenticarUsuario(event) {
    event.preventDefault();

    const usuario = document.getElementById('username').value.trim();
    const senha = document.getElementById('password').value.trim();

    try {
      const response = await fetch(loginURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario,
          senha
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na autenticação: ${response.status}`);
      }

      const token = await response.text(); // Se o backend retornar texto, use isso

      console.log("Token JWT recebido:", token);

      localStorage.setItem("token", token);

      const isPrimeiroAcesso = await verificarPrimeiroAcesso(usuario);

      if (isPrimeiroAcesso) {
        console.log("Redirecionando para página de criação de personagem...");
        // window.location.href = "/criar-personagem.html";
        Swal.fire({
          icon: "success",
          title: "Seja bem vindo!",
          text: "Está na hora de escolher seu primeiro companheiro!",
          confirmButtonText: "Beleza!"
        }).then(() => {
          // Redireciona assim que o usuário clicar em "Beleza!"
          window.location.href = "selecaoDigimon.html";
        });
      } else {
        console.log("Redirecionando para o lobby...");
        // window.location.href = "/lobby.html";
        Swal.fire({
          icon: "success",
          title: "Seja bem vindo de volta!",
          text: "É um prazer recebê-lo de volta no mundo digital.",
          confirmButtonText: "Beleza!"
        });
      }

    } catch (erro) {
      console.error("Erro ao autenticar usuário:", erro);
    }
  }

  async function verificarPrimeiroAcesso(usuario) {
    try {
      console.log('Verificando primeiro acesso do usuário...');
      const token = localStorage.getItem("token"); // ou sessionStorage.getItem("token")
      
      const response = await fetch(primeiroAcessoURL + usuario, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // <-- Aqui vai o JWT
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
  
      const resposta = await response.json();
      const isPrimeiroAcesso = resposta.mensagem === "Primeiro acesso confirmado";
  
      return isPrimeiroAcesso;
    } catch (erro) {
      console.error("Erro ao verificar primeiro acesso:", erro);
      return false;
    }
  }
});

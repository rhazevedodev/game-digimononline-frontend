document.addEventListener('DOMContentLoaded', () => {
    const validarTokenURL = 'http://localhost:8080/token/validarToken';
    const jwtToken = localStorage.getItem("token");
  
    async function validarToken(token) {
      if (!token) {
        console.warn("Usuario não autenticado.");
        return;
      }
  
      try {
        const response = await fetch(validarTokenURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // se o backend estiver esperando no header
          },
          body: JSON.stringify(token) // ou só token como string pura, depende do seu backend
        });
  
        if (!response.ok) {
          console.warn("Token inválido ou expirado:", response.status);
          // Redireciona ou remove o token, se necessário
          localStorage.removeItem("token");
          return;
        }
  
        const resultado = await response.text();
        console.log("Resultado da validação do token:", resultado);
  
        // Aqui você pode seguir com a lógica da aplicação
      } catch (error) {
        console.error("Erro ao validar o token:", error);
      }
    }
  
    validarToken(jwtToken);
  });
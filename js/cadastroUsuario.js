document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const nomeUsuario = document.getElementById("usuario").value.trim();
      const email = document.getElementById("email").value.trim();
      const dataNascimento = document.getElementById("dataNascimento").value;
      const senha = document.getElementById("senha").value;
      const confirmarSenha = document.getElementById("confirmarSenha").value;
  
      if (senha !== confirmarSenha) {
        Swal.fire({
          icon: "warning",
          title: "Senhas diferentes!",
          text: "As senhas digitadas não coincidem.",
          confirmButtonText: "Ok"
        });
        return;
      }
  
      const dados = {
        nomeUsuario,
        email,
        dataNascimento,
        senha
      };
  
      try {
        const resposta = await fetch("http://localhost:8080/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dados)
        });
  
        if (resposta.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Cadastro realizado!",
            text: "Seu usuário foi criado com sucesso.",
            confirmButtonText: "Beleza!"
          }).then(() => {
            // Redireciona assim que o usuário clicar em "Beleza!"
            window.location.href = "login.html";
          });
          form.reset();
        } else {
          let mensagem = "Não foi possível realizar o cadastro.";
          try {
            const erroJson = await resposta.json();
            console.log(erroJson);
            if (erroJson?.mensagem || erroJson?.message) {
              mensagem = erroJson.mensagem || erroJson.message;
            }
          } catch (_) {
            // Ignora erros ao tentar extrair mensagem
          }
  
          Swal.fire({
            icon: "error",
            title: "Erro no cadastro",
            text: mensagem,
            confirmButtonText: "Entendi"
          });
        }
      } catch (erro) {
        console.error("Erro na requisição:", erro);
        Swal.fire({
          icon: "error",
          title: "Erro de conexão",
          text: "Não foi possível conectar com o servidor.",
          confirmButtonText: "Fechar"
        });
      }
    });
  });
  
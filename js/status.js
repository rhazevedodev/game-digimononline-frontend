document.addEventListener('DOMContentLoaded', function () {
    const apiURL = 'http://localhost:8080/api/telaStatus/carregarTelaStatus/'+localStorage.getItem('idDigimon');
    const token = localStorage.getItem("token"); // ou sessionStorage.getItem("token")

    let dataInformacoesStatus = {};

    function carregarTelaStatus() {
        // Dados que serão enviados no corpo da requisição
        const requestBody = {
            idDigimon: localStorage.getItem('idDigimon')
        };
        // Configurações da requisição
        const requestOptions = {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`, // <-- Aqui vai o JWT
                "Content-Type": "application/json"
            },
        };

        // Fazer a requisição à API
        fetch(apiURL, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na rede, status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                // Armazenar os dados recebidos da API
                dataInformacoesStatus = {
                    //ATRIBUTOS BASE
                    baseForca: data.baseForca,
                    baseInteligencia: data.baseInteligencia,
                    baseAgilidade: data.baseAgilidade,
                    baseConhecimento: data.baseConhecimento,
                    baseResistencia: data.baseResistencia,
                    //INFORMAÇÕES
                    url_imagem_digimon: data.url_imagem_digimon,
                    jogo_desde: data.dataJogoDesde,
                    indicacao: data.indicacao,
                    reserva_bits: data.reservaBits,
                    reserva_diamantes: data.reservaDiamantes,
                    apelido_digimon: data.apelidoDigimon,
                    digimon_estagio_baby1: data.digimonBaby1,
                    digimon_estagio_baby2: data.digimonBaby2,
                    digimon_estagio_1: data.digimonRookie,
                    digimon_estagio_2: data.digimonChampion,
                    digimon_estagio_3: data.digimonUltimate,
                    digimon_estagio_4: data.digimonMega,
                    tier: data.tierDigimon,
                    nivel: data.nivelDigimon,
                    atributo1_forca: data.forca,
                    atributo2_inteligencia: data.inteligencia,
                    atributo3_conhecimento: data.conhecimento,
                    atributo4_agilidade: data.agilidade,
                    atributo0_vida: data.vida,
                    modificadorForca: data.modificadorForca,
                    modificadorInteligencia: data.modificadorInteligencia,
                    modificadorConhecimento: data.modificadorConhecimento,
                    modificadorAgilidade: data.modificadorAgilidade,
                    experiencia: data.experiencia,
                    experienciaNecessaria: data.experienciaNecessaria,
                    bonus_experiencia: data.bonusExperiencia,
                    bonus_bits: data.bonusBits,
                    bits_obtidos: data.bitsObtidos,
                    exp_obtida: data.experienciaObtida,
                    cacadas_concluidas: data.cacadasConcluidas,
                    missoes_concluidas: data.missoesConcluidas,
                    // Adicionar mais atributos conforme necessário
                };
                atualizarInformacoes();
                atualizarAtributosBase();
                atualizarAtributosTotais();
                /*atualizarAtributos();*/
                /*atualizarEstatisticas();*/
                console.log(dataInformacoesStatus)
            })
            .catch(error => {
                console.error('Erro ao fazer requisição:', error);
            });
    }

    function atualizarInformacoes() {
        document.getElementById('jogo_desde').textContent =  dataInformacoesStatus.jogo_desde;
        document.getElementById('indicacao').textContent =  dataInformacoesStatus.indicacao;
        document.getElementById('reserva_bits').textContent =  dataInformacoesStatus.reserva_bits;
        document.getElementById('reserva_diamantes').textContent =  dataInformacoesStatus.reserva_diamantes;
        document.getElementById('apelido_digimon').textContent =  dataInformacoesStatus.apelido_digimon;
        document.getElementById('digimon_estagio_baby1').textContent =  dataInformacoesStatus.digimon_estagio_baby1;
        document.getElementById('digimon_estagio_baby2').textContent =  dataInformacoesStatus.digimon_estagio_baby2;
        document.getElementById('digimon_estagio_1').textContent =  dataInformacoesStatus.digimon_estagio_1;
        document.getElementById('digimon_estagio_2').textContent =  dataInformacoesStatus.digimon_estagio_2;
        document.getElementById('digimon_estagio_3').textContent =  dataInformacoesStatus.digimon_estagio_3;
        document.getElementById('digimon_estagio_4').textContent =  dataInformacoesStatus.digimon_estagio_4;
        document.getElementById('nivel').textContent =  dataInformacoesStatus.tier + ' - [ ' + dataInformacoesStatus.nivel + ' ] ';
        document.getElementById('experiencia').textContent =  dataInformacoesStatus.experiencia + ' | ' + dataInformacoesStatus.experienciaNecessaria;
        document.getElementById('bonus_experiencia').textContent =  dataInformacoesStatus.bonus_experiencia;
        document.getElementById('bonus_bits').textContent =  dataInformacoesStatus.bonus_bits;

    }

    function atualizarAtributosTotais() {
        const forcaBase = parseInt(document.getElementById('forca-base').textContent);
        const inteligenciaBase = parseInt(document.getElementById('inteligencia-base').textContent);
        const agilidadeBase = parseInt(document.getElementById('agilidade-base').textContent);
        const conhecimentoBase = parseInt(document.getElementById('conhecimento-base').textContent);
        const resistenciaBase = parseInt(document.getElementById('resistencia-base').textContent);

        const forcaManipulavel = parseInt(document.getElementById('forca-manipulavel').textContent);
        const inteligenciaManipulavel = parseInt(document.getElementById('inteligencia-manipulavel').textContent);
        const agilidadeManipulavel = parseInt(document.getElementById('agilidade-manipulavel').textContent);
        const conhecimentoManipulavel = parseInt(document.getElementById('conhecimento-manipulavel').textContent);
        const resistenciaManipulavel = parseInt(document.getElementById('resistencia-manipulavel').textContent);

        const forcaModificadores = parseInt(document.getElementById('forca-modificadores').textContent);
        const inteligenciaModificadores = parseInt(document.getElementById('inteligencia-modificadores').textContent); 
        const agilidadeModificadores = parseInt(document.getElementById('agilidade-modificadores').textContent);
        const conhecimentoModificadores = parseInt(document.getElementById('conhecimento-modificadores').textContent);
        const resistenciaModificadores = parseInt(document.getElementById('resistencia-modificadores').textContent);

        document.getElementById('forca-total').textContent = forcaBase+forcaManipulavel+forcaModificadores;
        document.getElementById('inteligencia-total').textContent = inteligenciaBase+inteligenciaManipulavel+inteligenciaModificadores;
        document.getElementById('agilidade-total').textContent = agilidadeBase+agilidadeManipulavel+agilidadeModificadores;
        document.getElementById('conhecimento-total').textContent = conhecimentoBase+conhecimentoManipulavel+conhecimentoModificadores;
        document.getElementById('resistencia-total').textContent = resistenciaBase+resistenciaManipulavel+resistenciaModificadores;
    }

    function atualizarAtributosBase() {
        document.getElementById('forca-base').textContent = dataInformacoesStatus.baseForca;
        document.getElementById('inteligencia-base').textContent = dataInformacoesStatus.baseInteligencia;
        document.getElementById('agilidade-base').textContent = dataInformacoesStatus.baseAgilidade;
        document.getElementById('conhecimento-base').textContent = dataInformacoesStatus.baseConhecimento;
        document.getElementById('resistencia-base').textContent = dataInformacoesStatus.baseResistencia;
   }

    /*function atualizarAtributos() {
        var vidaTotal = 50 * parseInt(dataInformacoesStatus.nivel);
        document.getElementById('atributo1_forca').textContent = '| [ ' + dataInformacoesStatus.atributo1_forca + ' ] + [ ' + dataInformacoesStatus.modificadorForca + ' ]';
        document.getElementById('atributo2_inteligencia').textContent = '| [ ' + dataInformacoesStatus.atributo2_inteligencia + ' ] + [ ' + dataInformacoesStatus.modificadorInteligencia + ' ]';
        document.getElementById('atributo3_conhecimento').textContent = '| [ ' + dataInformacoesStatus.atributo3_conhecimento + ' ] + [ ' + dataInformacoesStatus.modificadorConhecimento + ' ]';
        document.getElementById('atributo4_agilidade').textContent = '| [ ' + dataInformacoesStatus.atributo4_agilidade + ' ] + [ ' + dataInformacoesStatus.modificadorAgilidade + ' ]';
        document.getElementById('atributo0_vida').textContent = '| [ ' + dataInformacoesStatus.atributo0_vida + ' | ' + vidaTotal + ' ] ';
        document.getElementById('experiencia').textContent = '| [ ' + dataInformacoesStatus.experiencia + ' | ' + dataInformacoesStatus.experienciaNecessaria + ' ] ';
    }*/

    /*function atualizarEstatisticas() {
        document.getElementById('bits_obtidos').textContent = '| ' + dataInformacoesStatus.bits_obtidos;
        document.getElementById('exp_obtida').textContent = '| ' + dataInformacoesStatus.exp_obtida;
        document.getElementById('cacadas_concluidas').textContent = '| ' + dataInformacoesStatus.cacadas_concluidas;
        document.getElementById('missoes_concluidas').textContent = '| ' + dataInformacoesStatus.missoes_concluidas;
    }*/

    carregarTelaStatus();

    document.getElementById('botaoTreinar').addEventListener('click', function () {
        window.location.href = 'atributos.html';
    });


});



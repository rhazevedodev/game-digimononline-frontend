$(document).ready(function() {
    inicializarEventos();
});

function inicializarEventos() {
    $('.plano-btn').click(function() {
        exibirQRCode($(this).data('dias'));
    });
}

function exibirQRCode(dias) {
    var qrCodeUrl;
    if(dias === 7) {
        qrCodeUrl = '../assets/pix/7reais.png';
    }
    if(dias === 14) {
        qrCodeUrl = '../assets/pix/14reais.png';
    }
    if(dias === 30) {
        qrCodeUrl = '../assets/pix/30reais.png';
    }
    // var qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PagamentoPremium' + dias;
    $('#qr-code').attr('src', qrCodeUrl);
    $('#qr-container').removeClass('hidden');
}
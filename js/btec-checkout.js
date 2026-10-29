/* =========================================================
   BTEC GAMES - SCRIPT DO CHECKOUT (hospedado em https://links.btecgames.com/js/btec-checkout.js)
   Entra na Nuvemshop em Configuracoes > Codigos externos > Codigos de tracking > "Para o checkout"
   (precisa de aprovacao da Nuvemshop) como:
     <script src="https://links.btecgames.com/js/btec-checkout.js" defer></script>

   - Selos de confianca logo abaixo do botao de continuar/pagar.
   O checkout (v3) e um app React que redesenha a tela a cada etapa, entao um observador
   recoloca os selos sempre que eles somem.
========================================================= */
(function () {
  var SELOS = [
    { icone: "raio", titulo: "Entrega por e-mail em minutos", texto: "Envio automático assim que o pagamento é aprovado" },
    { icone: "pessoas", titulo: "+97 mil pedidos entregues", texto: "Clientes em todo o Brasil desde 2016" },
    { icone: "cadeado", titulo: "Compra 100% segura", texto: "Seus dados protegidos do início ao fim" }
  ];

  var ICONES = {
    raio: '<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z"/>',
    pessoas: '<circle cx="9" cy="8" r="3.2"/><path d="M3 19.5c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.3c3 .2 5.5 2 5.5 5"/>',
    cadeado: '<rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.4"/>'
  };

  var CSS =
    "#btec-selos{clear:both;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:14px 0 24px;padding:14px;border-radius:10px;" +
    "background:#f4faf7;border:1px solid #d7ece2;font-family:inherit}" +
    "#btec-selos .bs-item{display:flex;align-items:flex-start;gap:10px;min-width:0}" +
    "#btec-selos svg{flex:none;width:30px;height:30px;padding:6px;border-radius:50%;box-sizing:border-box;background:#0a8f5a;" +
    "fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}" +
    "#btec-selos .bs-raio svg{fill:#fff;stroke:none}" +
    "#btec-selos .bs-t{display:block;font-weight:700;font-size:14px;line-height:1.25;color:#111}" +
    "#btec-selos .bs-s{display:block;margin-top:2px;font-size:12.5px;line-height:1.3;color:#5b6b65}" +
    "@media (max-width:767px){#btec-selos{grid-template-columns:1fr;gap:12px}}";

  function selosHtml() {
    var html = "";
    for (var i = 0; i < SELOS.length; i++) {
      var s = SELOS[i];
      html += '<div class="bs-item bs-' + s.icone + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICONES[s.icone] + "</svg>" +
        '<span><span class="bs-t">' + s.titulo + '</span><span class="bs-s">' + s.texto + "</span></span></div>";
    }
    return html;
  }

  function colocarSelos() {
    var coluna = document.getElementById("main-column");
    // so nas etapas com botao de avancar/pagar (fica fora da pagina de pedido concluido)
    if (!coluna || !coluna.querySelector("button[type=submit]")) { return; }
    if (coluna.querySelector("#btec-selos")) { return; }
    var bloco = document.createElement("div");
    bloco.id = "btec-selos";
    bloco.innerHTML = selosHtml();
    coluna.appendChild(bloco);
  }

  function iniciar() {
    if (!document.getElementById("btec-selos-css")) {
      var estilo = document.createElement("style");
      estilo.id = "btec-selos-css";
      estilo.textContent = CSS;
      document.head.appendChild(estilo);
    }
    colocarSelos();
    var pendente = false;
    new MutationObserver(function () {
      if (pendente) { return; }
      pendente = true;
      setTimeout(function () { pendente = false; colocarSelos(); }, 150);
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();

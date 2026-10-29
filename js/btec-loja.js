/* =========================================================
   BTEC GAMES - SCRIPT DA LOJA (hospedado em https://links.btecgames.com/js/btec-loja.js)
   Fica colado UMA vez na Nuvemshop (Configuracoes > Codigos externos) como:
     <script src="https://links.btecgames.com/js/btec-loja.js" defer></script>
   Depois disso, toda mudanca e feita aqui e publicada no GitHub, sem mexer no painel.

   - Faixa vermelha fixa no topo "Promocao esgotando" com contador regressivo.
     O contador vai ate a meia-noite (horario de Brasilia) ou ate a data em FAIXA.fim.
========================================================= */
(function () {
  var FAIXA = {
    ligada: true,
    texto: "PROMOÇÃO ESGOTANDO",
    sub: "Os preços de hoje acabam em",
    link: "https://www.btecgames.com/vendidos-do-site/",
    fim: "" // ex.: "2026-11-30T23:59:59-03:00" para uma promocao com data; vazio = meia-noite de hoje
  };

  var CSS =
    "#btec-faixa{position:fixed;top:0;left:0;right:0;z-index:1100;height:40px;display:flex;align-items:center;justify-content:center;gap:14px;" +
    "padding:0 44px;box-sizing:border-box;overflow:hidden;color:#fff;text-decoration:none !important;" +
    "background:linear-gradient(90deg,#9d0b1b,#e0182d 30%,#ff2d41 50%,#e0182d 70%,#9d0b1b);" +
    "font:700 13px/1 'BC Onest',-apple-system,'Segoe UI',system-ui,sans-serif;letter-spacing:.02em;box-shadow:0 4px 14px -6px rgba(157,11,27,.6)}" +
    "#btec-faixa::before{content:'';position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,255,255,.22) 50%,transparent 70%);" +
    "transform:translateX(-100%);animation:btec-faixa-brilho 3.2s ease-in-out infinite}" +
    "#btec-faixa .bf-fogo{display:inline-block;animation:btec-faixa-pulso 1s ease-in-out infinite alternate}" +
    "#btec-faixa .bf-txt{font-family:'BC Unbounded','Arial Black',system-ui,sans-serif;font-weight:900;font-size:13px;letter-spacing:.06em;white-space:nowrap}" +
    "#btec-faixa .bf-sub{opacity:.9;font-weight:600;white-space:nowrap}" +
    "#btec-faixa .bf-tempo{display:flex;align-items:center;gap:4px;font-variant-numeric:tabular-nums}" +
    "#btec-faixa .bf-num{min-width:30px;padding:5px 0;border-radius:6px;text-align:center;background:rgba(40,0,6,.45);border:1px solid rgba(255,255,255,.25);font:800 14px/1 'BC Onest',system-ui,sans-serif}" +
    "#btec-faixa .bf-dois{font-weight:900;animation:btec-faixa-pisca 1s steps(1) infinite}" +
    "#btec-faixa .bf-x{position:absolute;right:10px;top:50%;width:26px;height:26px;margin-top:-13px;border:0;border-radius:50%;background:rgba(0,0,0,.2);color:#fff;" +
    "font:700 16px/26px system-ui,sans-serif;text-align:center;cursor:pointer;padding:0}" +
    "#btec-faixa .bf-x:hover{background:rgba(0,0,0,.4)}" +
    "body.btec-com-faixa{padding-top:40px !important}" +
    "body.btec-com-faixa .head-fix{top:40px !important}" +
    "@keyframes btec-faixa-brilho{60%,100%{transform:translateX(100%)}}" +
    "@keyframes btec-faixa-pulso{to{transform:scale(1.25)}}" +
    "@keyframes btec-faixa-pisca{50%{opacity:.25}}" +
    "@media (max-width:767px){#btec-faixa{height:36px;gap:8px;padding:0 36px 0 10px;font-size:11px}" +
    "#btec-faixa .bf-txt{font-size:10.5px;letter-spacing:.03em}#btec-faixa .bf-sub{display:none}" +
    "#btec-faixa .bf-num{min-width:24px;padding:4px 0;font-size:12px}#btec-faixa .bf-x{right:6px;width:22px;height:22px;margin-top:-11px;font-size:14px;line-height:22px}" +
    "body.btec-com-faixa{padding-top:36px !important}body.btec-com-faixa .head-fix{top:36px !important}}" +
    "@media (prefers-reduced-motion:reduce){#btec-faixa::before,#btec-faixa .bf-fogo,#btec-faixa .bf-dois{animation:none}}";

  function guardado(chave, valor) {
    try {
      if (valor === undefined) { return sessionStorage.getItem(chave); }
      sessionStorage.setItem(chave, valor);
    } catch (e) { return null; }
  }

  /* fim da promocao: data fixa de FAIXA.fim ou a proxima meia-noite de Brasilia (UTC-3) */
  function fimDaPromocao() {
    if (FAIXA.fim) { return new Date(FAIXA.fim).getTime(); }
    var agoraBr = new Date(Date.now() - 3 * 3600e3);
    return Date.UTC(agoraBr.getUTCFullYear(), agoraBr.getUTCMonth(), agoraBr.getUTCDate() + 1) + 3 * 3600e3;
  }

  function doisDigitos(n) { return (n < 10 ? "0" : "") + n; }

  function montarFaixa() {
    if (!FAIXA.ligada || document.getElementById("btec-faixa") || guardado("btecFaixaFechada")) { return; }
    var fim = fimDaPromocao();
    if (!(fim > Date.now())) { return; }

    var estilo = document.createElement("style");
    estilo.textContent = CSS;
    document.head.appendChild(estilo);

    var faixa = document.createElement("a");
    faixa.id = "btec-faixa";
    faixa.href = FAIXA.link;
    faixa.innerHTML =
      '<span class="bf-fogo">🔥</span><span class="bf-txt">' + FAIXA.texto + '</span>' +
      '<span class="bf-sub">' + FAIXA.sub + '</span>' +
      '<span class="bf-tempo"><span class="bf-num" data-p="h">00</span><span class="bf-dois">:</span>' +
      '<span class="bf-num" data-p="m">00</span><span class="bf-dois">:</span><span class="bf-num" data-p="s">00</span></span>' +
      '<button type="button" class="bf-x" aria-label="Fechar aviso">×</button>';
    document.body.insertBefore(faixa, document.body.firstChild);
    document.body.classList.add("btec-com-faixa");

    var campos = {};
    var nums = faixa.querySelectorAll(".bf-num");
    for (var i = 0; i < nums.length; i++) { campos[nums[i].getAttribute("data-p")] = nums[i]; }

    var relogio;
    function atualizar() {
      var resta = Math.max(0, Math.floor((fim - Date.now()) / 1000));
      campos.h.textContent = doisDigitos(Math.floor(resta / 3600));
      campos.m.textContent = doisDigitos(Math.floor(resta % 3600 / 60));
      campos.s.textContent = doisDigitos(resta % 60);
      if (!resta) {
        clearInterval(relogio);
        if (!FAIXA.fim) { fim = fimDaPromocao(); relogio = setInterval(atualizar, 1000); }
      }
    }
    atualizar();
    relogio = setInterval(atualizar, 1000);

    faixa.querySelector(".bf-x").addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      clearInterval(relogio);
      faixa.parentNode.removeChild(faixa);
      document.body.classList.remove("btec-com-faixa");
      guardado("btecFaixaFechada", "1");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", montarFaixa);
  } else {
    montarFaixa();
  }
})();

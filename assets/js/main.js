// Malaysia GeoIntelligence Summit 2027 — page behaviour (no dependencies)

(function () {
  'use strict';

  // ---------- Countdown (home page) ----------
  var SUMMIT_START = new Date('2027-04-13T09:00:00+08:00').getTime();

  document.querySelectorAll('[data-days-left]').forEach(function (el) {
    var days = Math.max(0, Math.ceil((SUMMIT_START - Date.now()) / 86400000));
    el.textContent = days;
  });

  // ---------- Registration form ----------
  // Payment gateway not wired up yet: keep native validation, stop the page reload.
  document.querySelectorAll('form[data-registration]').forEach(function (form) {
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  });

  // ---------- Fee table currency toggle (registration page) ----------
  var feeTables = document.querySelectorAll('[data-fees]');
  if (!feeTables.length) return;

  var FEES = {
    local: [
      { name: 'Government and agency', who: 'Federal, state and local authority officers', eb: [1200, 295], nm: [1400, 345] },
      { name: 'Academic and researcher', who: 'Universities and research institutes', eb: [1200, 295], nm: [1400, 345] },
      { name: 'Industry and private sector', who: 'Companies, consultants and licensed surveyors', eb: [1500, 370], nm: [1800, 440] },
      { name: 'Presenter', who: 'Author presenting an accepted paper', eb: [1300, 320], nm: [1500, 370] },
      { name: 'Student', who: 'Full-time students, proof required', eb: [500, 120], nm: [650, 160] },
      { name: 'Day pass', who: 'Single day, any category', eb: [500, 120], nm: [600, 145] }
    ],
    intl: [
      { name: 'Delegate', who: 'Non-presenting participant', eb: [1840, 450], nm: [2250, 550] },
      { name: 'Presenter', who: 'Author presenting an accepted paper', eb: [2040, 500], nm: [2450, 600] },
      { name: 'Student', who: 'Full-time students, proof required', eb: [1020, 250], nm: [1230, 300] },
      { name: 'Online participant', who: 'Live stream of plenary sessions', eb: [610, 150], nm: [730, 180] }
    ]
  };

  var ADDONS = {
    workshop: { RM: 'RM 300', USD: 'USD 75' },
    dinner: { RM: 'RM 200', USD: 'USD 50' }
  };

  function rm(n) { return 'RM ' + n.toLocaleString('en-MY'); }
  function usd(n) { return 'USD ' + n.toLocaleString('en-US'); }

  function priceCell(pair, cur) {
    var td = document.createElement('td');
    var main = document.createElement('span');
    var alt = document.createElement('span');
    main.className = 'price';
    alt.className = 'sub';
    main.textContent = cur === 'RM' ? rm(pair[0]) : usd(pair[1]);
    alt.textContent = '≈ ' + (cur === 'RM' ? usd(pair[1]) : rm(pair[0]));
    td.append(main, alt);
    return td;
  }

  function renderFees(cur) {
    feeTables.forEach(function (tbody) {
      tbody.replaceChildren();
      FEES[tbody.dataset.fees].forEach(function (row) {
        var tr = document.createElement('tr');
        var th = document.createElement('th');
        var name = document.createElement('span');
        var who = document.createElement('span');
        th.scope = 'row';
        name.className = 'cat';
        who.className = 'sub';
        name.textContent = row.name;
        who.textContent = row.who;
        th.append(name, who);
        tr.append(th, priceCell(row.eb, cur), priceCell(row.nm, cur));
        tbody.append(tr);
      });
    });

    document.querySelectorAll('[data-addon-fee]').forEach(function (el) {
      el.textContent = ADDONS[el.dataset.addonFee][cur];
    });

    document.querySelectorAll('[data-currency]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.dataset.currency === cur));
    });
  }

  document.querySelectorAll('[data-currency]').forEach(function (btn) {
    btn.addEventListener('click', function () { renderFees(btn.dataset.currency); });
  });

  renderFees('RM');
})();

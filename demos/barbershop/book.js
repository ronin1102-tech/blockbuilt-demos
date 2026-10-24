/* ==========================================================================
   Fulton Road Barber Co. — demo booking
   Four steps, no network calls, no storage. Times are generated from the
   shop's opening hours and a fixed hash picks the slots that are "taken",
   so the same slot looks booked on every reload. Nothing is sent anywhere.
   ========================================================================== */
(function () {
  "use strict";

  var SERVICES = [
    { id: "signature", name: "Signature cut", price: 30, mins: 45 },
    { id: "fade", name: "Skin fade", price: 35, mins: 45 },
    { id: "beard", name: "Beard trim", price: 18, mins: 30 },
    { id: "shave", name: "Hot towel shave", price: 35, mins: 30 },
    { id: "cutbeard", name: "Cut & beard", price: 45, mins: 60 },
    { id: "kids", name: "Kids, 12 and under", price: 22, mins: 30 }
  ];

  var BARBERS = [
    { name: "Manny", meta: "Owner. Shaves." },
    { name: "Dez", meta: "Fades, line-ups." },
    { name: "Ray", meta: "Cuts, beard work." },
    { name: "No preference", meta: "First chair free." }
  ];

  /* Sunday 0 … Saturday 6. Open and close in minutes past midnight. */
  var HOURS = { 2: [540, 1140], 3: [540, 1140], 4: [540, 1140], 5: [540, 1140], 6: [480, 960] };

  var STEP_COUNT = 4;
  var panel = document.getElementById("book-panel");
  var stepLabel = document.getElementById("book-step");
  var resetBtn = document.getElementById("book-reset");
  var section = document.getElementById("book");

  if (!panel || !section) return;

  var state = {
    step: 1,
    service: null,
    barber: null,
    day: null,
    time: null,
    booked: []
  };

  /* --- small helpers ---------------------------------------------------- */

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function button(className, label) {
    var b = make("button", className);
    b.type = "button";
    if (label) b.textContent = label;
    return b;
  }

  function startOfDay(offset) {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
  }

  function dayKey(date) {
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  }

  function clockLabel(mins) {
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    var suffix = h >= 12 ? "pm" : "am";
    var hour = h % 12 === 0 ? 12 : h % 12;
    return hour + ":" + String(m).padStart(2, "0") + suffix;
  }

  function longDate(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
  }

  function shortDate(date) {
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  }

  function money(value) {
    return "$" + value;
  }

  /* Deterministic "someone already has that slot" hash. */
  function isTaken(key) {
    if (state.booked.indexOf(key) !== -1) return true;
    var h = 2166136261;
    for (var i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 9) === 0;
  }

  function slotsFor(date) {
    var hours = HOURS[date.getDay()];
    if (!hours) return [];

    var key = dayKey(date);
    var today = startOfDay(0).getTime() === date.getTime();
    var earliest = today ? new Date().getHours() * 60 + new Date().getMinutes() + 30 : 0;
    var slots = [];

    for (var t = hours[0]; t <= hours[1] - 30; t += 30) {
      if (today && t < earliest) continue;
      slots.push({ mins: t, label: clockLabel(t), taken: isTaken(key + "@" + t) });
    }

    /* Never show a day with nothing free — keep two chairs open. */
    if (slots.length && slots.every(function (s) { return s.taken; })) {
      slots[0].taken = false;
      slots[Math.min(1, slots.length - 1)].taken = false;
    }

    return slots;
  }

  function openDays(count) {
    var days = [];
    for (var i = 0; i < 14 && days.length < count; i++) {
      var date = startOfDay(i);
      if (!HOURS[date.getDay()]) continue;
      var free = slotsFor(date).filter(function (s) { return !s.taken; });
      if (!free.length) continue;
      days.push(date);
    }
    return days;
  }

  /* --- rendering -------------------------------------------------------- */

  function heading(text) {
    var h = make("h3", "book__title", text);
    h.tabIndex = -1;
    return h;
  }

  function nav(backTo, next) {
    var wrap = make("div", "book__nav");
    if (backTo) {
      var back = button("btn btn--ghost", "Back");
      back.addEventListener("click", function () {
        state.step = backTo;
        render();
      });
      wrap.appendChild(back);
    }
    if (next) wrap.appendChild(next);
    return wrap;
  }

  function renderService() {
    var frag = document.createDocumentFragment();
    frag.appendChild(heading("What do you need?"));

    var grid = make("div", "opts");
    SERVICES.forEach(function (service) {
      var b = button("opt");
      b.setAttribute("aria-pressed", state.service === service.id ? "true" : "false");
      b.appendChild(make("span", "opt__name", service.name));
      b.appendChild(make("span", "opt__meta", money(service.price) + " · " + service.mins + " min"));
      b.addEventListener("click", function () {
        state.service = service.id;
        state.step = 2;
        render();
      });
      grid.appendChild(b);
    });
    frag.appendChild(grid);
    return frag;
  }

  function renderBarber() {
    var frag = document.createDocumentFragment();
    frag.appendChild(heading("Who's cutting?"));

    var grid = make("div", "opts");
    BARBERS.forEach(function (barber) {
      var b = button("opt");
      b.setAttribute("aria-pressed", state.barber === barber.name ? "true" : "false");
      b.appendChild(make("span", "opt__name", barber.name));
      b.appendChild(make("span", "opt__meta", barber.meta));
      b.addEventListener("click", function () {
        state.barber = barber.name;
        state.step = 3;
        if (!state.day) state.day = openDays(1)[0] || null;
        render();
      });
      grid.appendChild(b);
    });
    frag.appendChild(grid);
    frag.appendChild(nav(1));
    return frag;
  }

  function renderTime() {
    var frag = document.createDocumentFragment();
    frag.appendChild(heading("When suits you?"));

    var days = openDays(6);
    if (!days.length) {
      frag.appendChild(make("p", "book__fallback", "Nothing free in the next fortnight. Call the shop and we'll sort you out."));
      frag.appendChild(nav(2, null));
      return frag;
    }

    if (!state.day || days.every(function (d) { return dayKey(d) !== dayKey(state.day); })) {
      state.day = days[0];
    }

    var dayList = make("div", "days");
    days.forEach(function (date) {
      var b = button("day");
      var active = dayKey(date) === dayKey(state.day);
      b.setAttribute("aria-pressed", active ? "true" : "false");
      b.setAttribute("aria-label", longDate(date));
      b.appendChild(make("span", "day__dow", shortDate(date)));
      b.appendChild(document.createTextNode(String(date.getDate())));
      b.addEventListener("click", function () {
        state.day = date;
        state.time = null;
        render();
      });
      dayList.appendChild(b);
    });
    frag.appendChild(dayList);

    var slots = slotsFor(state.day);
    var slotList = make("div", "slots");
    slots.forEach(function (slot) {
      var b = button("slot", slot.label);
      b.disabled = slot.taken;
      b.setAttribute("aria-pressed", state.time === slot.mins ? "true" : "false");
      b.setAttribute("aria-label", clockLabel(slot.mins) + (slot.taken ? " — booked" : ""));
      if (!slot.taken) {
        b.addEventListener("click", function () {
          state.time = slot.mins;
          state.step = 4;
          render();
        });
      }
      slotList.appendChild(b);
    });
    frag.appendChild(slotList);

    frag.appendChild(nav(2));
    return frag;
  }

  function serviceById(id) {
    for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i];
    return null;
  }

  function summaryRows(items) {
    var dl = make("dl", "book__summary");
    items.forEach(function (item) {
      var row = make("div");
      row.appendChild(make("dt", null, item[0]));
      row.appendChild(make("dd", null, item[1]));
      dl.appendChild(row);
    });
    return dl;
  }

  function renderDetails() {
    var service = serviceById(state.service);
    var frag = document.createDocumentFragment();
    frag.appendChild(heading("Who's the cut for?"));

    frag.appendChild(
      summaryRows([
        ["Service", service.name + " · " + money(service.price)],
        ["Barber", state.barber],
        ["When", longDate(state.day) + ", " + clockLabel(state.time)]
      ])
    );

    var fields = make("div", "fields");

    var nameField = make("div", "field");
    var nameId = "book-name";
    var nameLabel = make("label", null, "Your name");
    nameLabel.setAttribute("for", nameId);
    var nameInput = document.createElement("input");
    nameInput.id = nameId;
    nameInput.name = "name";
    nameInput.type = "text";
    nameInput.autocomplete = "name";
    nameInput.required = true;
    nameInput.placeholder = "Marcus T.";
    nameField.appendChild(nameLabel);
    nameField.appendChild(nameInput);
    fields.appendChild(nameField);

    var phoneField = make("div", "field");
    var phoneId = "book-phone";
    var phoneLabel = make("label", null, "Mobile number");
    phoneLabel.setAttribute("for", phoneId);
    var phoneInput = document.createElement("input");
    phoneInput.id = phoneId;
    phoneInput.name = "phone";
    phoneInput.type = "tel";
    phoneInput.inputMode = "tel";
    phoneInput.autocomplete = "tel";
    phoneInput.required = true;
    phoneInput.placeholder = "(216) 555-0148";
    phoneField.appendChild(phoneLabel);
    phoneField.appendChild(phoneInput);
    fields.appendChild(phoneField);

    frag.appendChild(fields);

    var err = make("p", "field__err");
    err.setAttribute("role", "alert");
    err.hidden = true;

    var confirm = button("btn btn--brass", "Confirm booking");
    confirm.addEventListener("click", function () {
      var name = nameInput.value.trim();
      var digits = phoneInput.value.replace(/\D/g, "");

      if (name.length < 2) {
        err.textContent = "We need a name for the chair.";
        err.hidden = false;
        nameInput.focus();
        return;
      }
      if (digits.length < 10 || digits.length > 11) {
        err.textContent = "That number doesn’t look right — ten digits, please.";
        err.hidden = false;
        phoneInput.focus();
        return;
      }

      state.name = name;
      state.phone = formatPhone(digits);
      state.booked.push(dayKey(state.day) + "@" + state.time);
      state.step = 5;
      render();
    });

    var actions = make("div", "book__nav");
    var back = button("btn btn--ghost", "Back");
    back.addEventListener("click", function () {
      state.step = 3;
      render();
    });
    actions.appendChild(back);
    actions.appendChild(confirm);

    frag.appendChild(err);
    frag.appendChild(actions);

    phoneInput.addEventListener("blur", function () {
      var digits = phoneInput.value.replace(/\D/g, "");
      if (digits.length === 10 || digits.length === 11) phoneInput.value = formatPhone(digits);
    });

    return frag;
  }

  function formatPhone(digits) {
    if (digits.length === 11 && digits.charAt(0) === "1") digits = digits.slice(1);
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6, 10);
  }

  function renderDone() {
    var service = serviceById(state.service);
    var frag = document.createDocumentFragment();

    frag.appendChild(make("p", "confirm__big", "You’re in the chair."));

    frag.appendChild(
      summaryRows([
        ["Service", service.name + " · " + money(service.price)],
        ["Barber", state.barber],
        ["When", longDate(state.day) + ", " + clockLabel(state.time)],
        ["Name", state.name],
        ["Text", state.phone]
      ])
    );

    var note = make("p", "demo-note");
    note.appendChild(make("strong", null, "This is a demo booking."));
    note.appendChild(
      document.createTextNode(
        " Nothing was sent and no appointment was made. On a live Blockbuilt site this slot would be held and you’d get a text within a minute."
      )
    );
    frag.appendChild(note);

    var actions = make("div", "book__nav");
    var again = button("btn btn--brass", "Book another chair");
    again.addEventListener("click", reset);
    actions.appendChild(again);
    frag.appendChild(actions);

    return frag;
  }

  function render() {
    var frag;
    if (state.step === 1) frag = renderService();
    else if (state.step === 2) frag = renderBarber();
    else if (state.step === 3) frag = renderTime();
    else if (state.step === 4) frag = renderDetails();
    else frag = renderDone();

    panel.textContent = "";
    panel.appendChild(frag);

    stepLabel.textContent = state.step > STEP_COUNT ? "Demo booking confirmed" : "Step " + state.step + " of " + STEP_COUNT;
    resetBtn.hidden = state.step === 1;

    var title = panel.querySelector(".book__title");
    if (title) title.focus({ preventScroll: true });
  }

  function reset() {
    state.step = 1;
    state.service = null;
    state.barber = null;
    state.day = null;
    state.time = null;
    render();
    panel.scrollIntoView({ block: "nearest" });
  }

  resetBtn.addEventListener("click", reset);

  document.querySelectorAll("[data-book]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      if (state.step === 5) reset();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      var title = panel.querySelector(".book__title");
      if (title) setTimeout(function () { title.focus({ preventScroll: true }); }, 320);
    });
  });

  /* Open on step one, without stealing focus on page load. */
  var first = renderService();
  panel.textContent = "";
  panel.appendChild(first);
})();

/* ==========================================================================
   Marlowe & Ash — demo booking + stylist match
   One file, no network calls, no storage. Slots come from the salon's
   opening hours and respect how long the chosen service takes, so a
   three-hour balayage can't be booked at 5pm. Nothing is sent anywhere.
   ========================================================================== */
(function () {
  "use strict";

  var SERVICES = [
    { id: "signature", cat: "Cuts", name: "Signature cut & style", mins: 60, price: 65 },
    { id: "bob", cat: "Cuts", name: "Precision bob", mins: 75, price: 75 },
    { id: "curly", cat: "Cuts", name: "Curly cut, dry", mins: 90, price: 95 },
    { id: "fringe", cat: "Cuts", name: "Fringe trim", mins: 20, price: 20 },
    { id: "blowout", cat: "Cuts", name: "Blowout", mins: 45, price: 45 },
    { id: "single", cat: "Color", name: "Single-process color", mins: 120, price: 110, from: true },
    { id: "balayage", cat: "Color", name: "Balayage", mins: 180, price: 185, from: true },
    { id: "gloss", cat: "Color", name: "Gloss & tone", mins: 45, price: 65 },
    { id: "roots", cat: "Color", name: "Root touch-up", mins: 90, price: 85 },
    { id: "deep", cat: "Treatments", name: "Deep conditioning", mins: 30, price: 40 },
    { id: "scalp", cat: "Treatments", name: "Scalp ritual", mins: 45, price: 55 },
    { id: "keratin", cat: "Treatments", name: "Keratin smoothing", mins: 150, price: 200, from: true }
  ];

  var STYLISTS = [
    {
      name: "Maren",
      role: "Color director",
      focus: "color",
      tags: "balayage, dimensional blonde and corrections"
    },
    {
      name: "Jules",
      role: "Cutting",
      focus: "cut",
      tags: "bobs, short hair and curls cut dry"
    },
    {
      name: "Priya",
      role: "Texture & treatments",
      focus: "texture",
      tags: "curl shaping, keratin and scalp work"
    }
  ];

  /* Tuesday 2 … Saturday 6. Open and close in minutes past midnight. */
  var HOURS = { 2: [600, 1140], 3: [600, 1140], 4: [600, 1140], 5: [600, 1140], 6: [540, 1020] };
  var STEP_COUNT = 4;

  var bookPanel = document.getElementById("book-panel");
  var bookStep = document.getElementById("book-step");
  var bookReset = document.getElementById("book-reset");
  var bookSection = document.getElementById("book");
  var matchPanel = document.getElementById("match-panel");

  if (!bookPanel || !bookSection) return;

  var state = {
    step: 1,
    service: null,
    stylist: null,
    day: null,
    time: null,
    name: "",
    phone: "",
    note: "",
    booked: []
  };

  /* --- helpers ---------------------------------------------------------- */

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
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }

  function shortDow(date) {
    return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  }

  function money(value, from) {
    return (from ? "from $" : "$") + value;
  }

  /* Minutes everywhere, to match the printed menu exactly. */
  function duration(mins) {
    return mins + " min";
  }

  function serviceById(id) {
    for (var i = 0; i < SERVICES.length; i++) if (SERVICES[i].id === id) return SERVICES[i];
    return null;
  }

  function stylistByName(name) {
    for (var i = 0; i < STYLISTS.length; i++) if (STYLISTS[i].name === name) return STYLISTS[i];
    return null;
  }

  function isTaken(key) {
    if (state.booked.indexOf(key) !== -1) return true;
    var h = 2166136261;
    for (var i = 0; i < key.length; i++) {
      h ^= key.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 11) === 0;
  }

  function slotsFor(date) {
    var hours = HOURS[date.getDay()];
    if (!hours) return [];

    var service = serviceById(state.service);
    var length = service ? service.mins : 60;
    var key = dayKey(date);
    var today = startOfDay(0).getTime() === date.getTime();
    var now = new Date();
    var earliest = today ? now.getHours() * 60 + now.getMinutes() + 45 : 0;
    var latestStart = hours[1] - length;
    var slots = [];

    for (var t = hours[0]; t <= latestStart; t += 30) {
      if (today && t < earliest) continue;
      slots.push({ mins: t, label: clockLabel(t), taken: isTaken(key + "@" + t) });
    }

    if (slots.length && slots.every(function (s) { return s.taken; })) {
      slots[0].taken = false;
      if (slots.length > 1) slots[1].taken = false;
    }

    return slots;
  }

  function openDays(count) {
    var days = [];
    for (var i = 0; i < 16 && days.length < count; i++) {
      var date = startOfDay(i);
      if (!HOURS[date.getDay()]) continue;
      var free = slotsFor(date).filter(function (s) { return !s.taken; });
      if (!free.length) continue;
      days.push(date);
    }
    return days;
  }

  /* --- booking rendering ------------------------------------------------ */

  function heading(text) {
    var h = make("h3", "book__title", text);
    h.tabIndex = -1;
    return h;
  }

  function nav(backTo, next) {
    var wrap = make("div", "book__nav");
    if (backTo) {
      var back = button("btn btn--line", "Back");
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
    frag.appendChild(heading("What are we doing?"));

    var categories = ["Cuts", "Color", "Treatments"];
    categories.forEach(function (cat) {
      frag.appendChild(make("p", "group-label", cat));
      var grid = make("div", "opts");
      SERVICES.filter(function (s) { return s.cat === cat; }).forEach(function (service) {
        var b = button("opt");
        b.setAttribute("aria-pressed", state.service === service.id ? "true" : "false");
        b.appendChild(make("span", "opt__name", service.name));
        b.appendChild(
          make("span", "opt__meta", money(service.price, service.from) + " · " + duration(service.mins))
        );
        b.addEventListener("click", function () {
          state.service = service.id;
          state.time = null;
          state.day = null;
          state.step = state.stylist ? 3 : 2;
          render();
        });
        grid.appendChild(b);
      });
      frag.appendChild(grid);
    });

    return frag;
  }

  function renderStylist() {
    var frag = document.createDocumentFragment();
    frag.appendChild(heading("Who’s chair?"));

    var grid = make("div", "opts");
    STYLISTS.concat([{ name: "No preference", role: "First chair free" }]).forEach(function (person) {
      var b = button("opt");
      b.setAttribute("aria-pressed", state.stylist === person.name ? "true" : "false");
      b.appendChild(make("span", "opt__name", person.name));
      b.appendChild(make("span", "opt__meta", person.role));
      b.addEventListener("click", function () {
        state.stylist = person.name;
        state.step = 3;
        state.day = null;
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
      frag.appendChild(
        make("p", "book__fallback", "Nothing free in the next fortnight for this service. Call the salon and we’ll sort it out.")
      );
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
      b.appendChild(make("span", "day__dow", shortDow(date)));
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
      b.setAttribute("aria-label", clockLabel(slot.mins) + (slot.taken ? " — taken" : ""));
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

  function formatPhone(digits) {
    if (digits.length === 11 && digits.charAt(0) === "1") digits = digits.slice(1);
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6, 10);
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
    frag.appendChild(heading("And your details?"));

    frag.appendChild(
      summaryRows([
        ["Service", service.name + " · " + duration(service.mins)],
        ["Stylist", state.stylist],
        ["When", longDate(state.day) + ", " + clockLabel(state.time)]
      ])
    );

    var fields = make("div", "fields");

    var nameWrap = make("div", "field");
    var nameId = "salon-name";
    var nameLabel = make("label", null, "Your name");
    nameLabel.setAttribute("for", nameId);
    var nameInput = document.createElement("input");
    nameInput.id = nameId;
    nameInput.name = "name";
    nameInput.type = "text";
    nameInput.autocomplete = "name";
    nameInput.placeholder = "Dana W.";
    nameWrap.appendChild(nameLabel);
    nameWrap.appendChild(nameInput);
    fields.appendChild(nameWrap);

    var phoneWrap = make("div", "field");
    var phoneId = "salon-phone";
    var phoneLabel = make("label", null, "Mobile number");
    phoneLabel.setAttribute("for", phoneId);
    var phoneInput = document.createElement("input");
    phoneInput.id = phoneId;
    phoneInput.name = "phone";
    phoneInput.type = "tel";
    phoneInput.inputMode = "tel";
    phoneInput.autocomplete = "tel";
    phoneInput.placeholder = "(216) 555-0173";
    phoneWrap.appendChild(phoneLabel);
    phoneWrap.appendChild(phoneInput);
    fields.appendChild(phoneWrap);

    var noteWrap = make("div", "field");
    var noteId = "salon-note";
    var noteLabel = make("label", null, "Anything we should know? (optional)");
    noteLabel.setAttribute("for", noteId);
    var noteInput = document.createElement("textarea");
    noteInput.id = noteId;
    noteInput.name = "note";
    noteInput.maxLength = 240;
    noteInput.placeholder = "Previous color, allergies, parking, running late…";
    noteWrap.appendChild(noteLabel);
    noteWrap.appendChild(noteInput);
    fields.appendChild(noteWrap);

    frag.appendChild(fields);

    var err = make("p", "field__err");
    err.setAttribute("role", "alert");
    err.hidden = true;

    var confirm = button("btn btn--dark", "Confirm booking");
    confirm.addEventListener("click", function () {
      var name = nameInput.value.trim();
      var digits = phoneInput.value.replace(/\D/g, "");

      if (name.length < 2) {
        err.textContent = "We need a name for the appointment.";
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
      state.note = noteInput.value.trim();
      state.booked.push(dayKey(state.day) + "@" + state.time);
      state.step = 5;
      render();
    });

    var actions = make("div", "book__nav");
    var back = button("btn btn--line", "Back");
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

  function renderDone() {
    var service = serviceById(state.service);
    var frag = document.createDocumentFragment();

    frag.appendChild(make("p", "confirm__big", "You’re booked in."));

    frag.appendChild(
      summaryRows([
        ["Service", service.name + " · " + money(service.price, service.from)],
        ["Stylist", state.stylist],
        ["When", longDate(state.day) + ", " + clockLabel(state.time)],
        ["Name", state.name],
        ["Text", state.phone]
      ])
    );

    var note = make("p", "demo-note");
    note.appendChild(make("strong", null, "This is a demo booking."));
    note.appendChild(
      document.createTextNode(
        " Nothing was sent and no appointment was made. On a live Blockbuilt site the slot would be held and you’d get a text the day before."
      )
    );
    frag.appendChild(note);

    var actions = make("div", "book__nav");
    var again = button("btn btn--dark", "Book another appointment");
    again.addEventListener("click", resetBooking);
    actions.appendChild(again);
    frag.appendChild(actions);

    return frag;
  }

  function render() {
    var frag;
    if (state.step === 1) frag = renderService();
    else if (state.step === 2) frag = renderStylist();
    else if (state.step === 3) frag = renderTime();
    else if (state.step === 4) frag = renderDetails();
    else frag = renderDone();

    bookPanel.textContent = "";
    bookPanel.appendChild(frag);

    bookStep.textContent =
      state.step > STEP_COUNT ? "Demo booking confirmed" : "Step " + state.step + " of " + STEP_COUNT;
    bookReset.hidden = state.step === 1;

    var title = bookPanel.querySelector(".book__title");
    if (title) title.focus({ preventScroll: true });
  }

  function resetBooking() {
    state.step = 1;
    state.service = null;
    state.stylist = null;
    state.day = null;
    state.time = null;
    render();
    bookPanel.scrollIntoView({ block: "nearest" });
  }

  function startBooking(stylist) {
    if (state.step === 5) resetBooking();
    if (stylist) state.stylist = stylist;
    state.step = 1;
    render();
    bookSection.scrollIntoView({ behavior: "smooth", block: "start" });
    var title = bookPanel.querySelector(".book__title");
    if (title) setTimeout(function () { title.focus({ preventScroll: true }); }, 340);
  }

  bookReset.addEventListener("click", resetBooking);

  document.querySelectorAll("[data-book]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      startBooking(trigger.getAttribute("data-stylist") || null);
    });
  });

  /* --- stylist match ---------------------------------------------------- */

  var match = { step: 1, focus: null, vibe: null };

  var FOCUS_OPTIONS = [
    { id: "cut", label: "A cut and a shape", meta: "Bobs, short hair, curls" },
    { id: "color", label: "Color", meta: "Balayage, gloss, correction" },
    { id: "texture", label: "Texture or a treatment", meta: "Curls, keratin, scalp" }
  ];

  var VIBE_OPTIONS = [
    { id: "quiet", label: "Quiet, please", meta: "Head down, scissors up" },
    { id: "chatty", label: "Chat away", meta: "The chair is a sofa" }
  ];

  function matchedStylist() {
    for (var i = 0; i < STYLISTS.length; i++) if (STYLISTS[i].focus === match.focus) return STYLISTS[i];
    return STYLISTS[0];
  }

  function renderMatch() {
    if (!matchPanel) return;
    matchPanel.textContent = "";

    var frag = document.createDocumentFragment();

    if (match.step <= 2) {
      var isFocus = match.step === 1;
      frag.appendChild(make("p", "match__count", "Question " + match.step + " of 2"));
      frag.appendChild(
        make("p", "match__q", isFocus ? "What brings you in?" : "And the chair-side manner?")
      );

      var stack = make("div", "stack");
      (isFocus ? FOCUS_OPTIONS : VIBE_OPTIONS).forEach(function (opt) {
        var b = button("opt");
        var selected = isFocus ? match.focus === opt.id : match.vibe === opt.id;
        b.setAttribute("aria-pressed", selected ? "true" : "false");
        b.appendChild(make("span", "opt__name", opt.label));
        b.appendChild(make("span", "opt__meta", opt.meta));
        b.addEventListener("click", function () {
          if (isFocus) {
            match.focus = opt.id;
            match.step = 2;
          } else {
            match.vibe = opt.id;
            match.step = 3;
          }
          renderMatch();
        });
        stack.appendChild(b);
      });
      frag.appendChild(stack);

      if (match.step === 2) {
        var backWrap = make("div", "book__nav");
        var back = button("btn btn--line", "Back");
        back.addEventListener("click", function () {
          match.step = 1;
          renderMatch();
        });
        backWrap.appendChild(back);
        frag.appendChild(backWrap);
      }
    } else {
      var person = matchedStylist();
      frag.appendChild(make("p", "match__count", "Your match"));
      frag.appendChild(make("p", "match__name", person.name));
      frag.appendChild(make("p", "match__role", person.role));

      var why =
        person.name +
        " takes " +
        person.tags +
        ". " +
        (match.vibe === "quiet"
          ? "Say the word and it’s a quiet appointment — no small talk, just the work."
          : "Happy to talk the whole way through, or read the room if you’d rather not.");
      frag.appendChild(make("p", "match__why", why));

      var actions = make("div", "book__nav");
      var bookThem = button("btn btn--dark", "Book with " + person.name);
      bookThem.addEventListener("click", function () {
        startBooking(person.name);
      });
      actions.appendChild(bookThem);

      var again = button("link-arrow", "Start again");
      again.addEventListener("click", function () {
        match = { step: 1, focus: null, vibe: null };
        renderMatch();
      });
      actions.appendChild(again);
      frag.appendChild(actions);

      var seeAll = make("p", "match__foot", "Or read about all three chairs above.");
      frag.appendChild(seeAll);
    }

    matchPanel.appendChild(frag);

    var q = matchPanel.querySelector(".match__q");
    if (q && match.step > 1) {
      q.tabIndex = -1;
      q.focus({ preventScroll: true });
    }
  }

  /* Initial paint: booking step one, match question one. */
  (function init() {
    var frag = renderService();
    bookPanel.textContent = "";
    bookPanel.appendChild(frag);
    renderMatch();
  })();
})();

/* ==========================================================================
   Voss & Sons — cost estimator, ZIP check and walkthrough request
   One file, no network calls, no storage. Bands are planning numbers for a
   Cleveland house, the ZIP check is a real list, and the request ends by
   saying plainly that nothing was sent.
   ========================================================================== */
(function () {
  "use strict";

  var PROJECTS = [
    { id: "kitchen", name: "Kitchen", band: [38000, 95000], weeks: "8–12", meta: "Cabinets, counters, lighting, floors" },
    { id: "bath", name: "Bathroom", band: [18000, 45000], weeks: "4–6", meta: "Tile, waterproofing, fixtures" },
    { id: "addition", name: "Addition", band: [120000, 260000], weeks: "16–24", meta: "Foundation to finishes" },
    { id: "whole", name: "Whole home", band: [210000, 450000], weeks: "20–32", meta: "Down to the studs and back" },
    { id: "porch", name: "Porch or deck", band: [22000, 60000], weeks: "3–5", meta: "Structure, railings, roof" },
    { id: "basement", name: "Basement", band: [28000, 65000], weeks: "5–8", meta: "Dry, insulated, finished" }
  ];

  var FINISHES = [
    {
      id: "standard",
      name: "Solid and standard",
      meta: "Good where it shows",
      mult: 0.85,
      body: "Builder-grade cabinets, quartz-look counters, standard tile and fixtures. Sound work, nothing showy."
    },
    {
      id: "mid",
      name: "Mid-range",
      meta: "A few custom pieces",
      mult: 1,
      body: "Semi-custom cabinets, real quartz, tile to the ceiling in the bath, and lighting planned properly."
    },
    {
      id: "high",
      name: "High-end",
      meta: "Custom throughout",
      mult: 1.35,
      body: "Custom cabinetry, stone slabs, detail carpentry. The band widens because the finishes are still open."
    }
  ];

  var TIMINGS = [
    { id: "asap", label: "As soon as we can", meta: "Within 3 months" },
    { id: "quarter", label: "Next 3–6 months", meta: "Planning now" },
    { id: "year", label: "Later this year", meta: "No rush" },
    { id: "planning", label: "Just planning", meta: "Numbers first" }
  ];

  /* ZIPs the shop actually works in. */
  var AREAS = {
    "44113": "Tremont, Ohio City and Clark-Fulton",
    "44102": "Detroit-Shoreway, Gordon Square and Edgewater",
    "44109": "Old Brooklyn and Brooklyn Centre",
    "44111": "West Park and Kamm’s Corners",
    "44107": "Lakewood",
    "44103": "St. Clair–Superior and Hough",
    "44114": "Downtown and the Flats",
    "44115": "Campus District",
    "44106": "Cleveland Heights and Little Italy",
    "44118": "Cleveland Heights",
    "44120": "Shaker Heights",
    "44144": "Brooklyn"
  };

  var PHONE_TEXT = "(216) 555-0163";
  var PHONE_HREF = "+12165550163";

  var estPanel = document.getElementById("est-panel");
  var estCount = document.getElementById("est-count");
  var flowPanel = document.getElementById("flow-panel");
  var flowStep = document.getElementById("flow-step");
  var flowReset = document.getElementById("flow-reset");
  var flowSection = document.getElementById("walkthrough");
  var estimateSection = document.getElementById("estimate");
  var zipForm = document.getElementById("zip-form");
  var zipInput = document.getElementById("zip-input");
  var zipOut = document.getElementById("zip-out");

  if (!estPanel || !flowPanel) return;

  var est = { step: 1, project: null, finish: null };
  var flow = {
    step: 1,
    project: null,
    street: "",
    zip: "",
    area: "",
    name: "",
    phone: "",
    timing: null,
    note: "",
    band: null
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

  function projectById(id) {
    for (var i = 0; i < PROJECTS.length; i++) if (PROJECTS[i].id === id) return PROJECTS[i];
    return null;
  }

  function finishById(id) {
    for (var i = 0; i < FINISHES.length; i++) if (FINISHES[i].id === id) return FINISHES[i];
    return null;
  }

  function money(value) {
    return "$" + String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function roundTo(value, step) {
    return Math.round(value / step) * step;
  }

  function bandFor(project, finish) {
    if (!project || !finish) return null;
    return [roundTo(project.band[0] * finish.mult, 1000), roundTo(project.band[1] * finish.mult, 1000)];
  }

  function focusHeading(node, delay) {
    if (!node) return;
    node.tabIndex = -1;
    setTimeout(function () {
      node.focus({ preventScroll: true });
    }, delay || 0);
  }

  function formatPhone(digits) {
    if (digits.length === 11 && digits.charAt(0) === "1") digits = digits.slice(1);
    return "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6, 10);
  }

  function heading(text, className) {
    return make("h3", className || "est__q", text);
  }

  /* --- estimator -------------------------------------------------------- */

  function renderEstimate(silent) {
    var frag = document.createDocumentFragment();

    if (est.step === 1) {
      estCount.textContent = "Question 1 of 2";
      var q1 = heading("What are we building?");
      frag.appendChild(q1);

      var grid1 = make("div", "opts");
      PROJECTS.forEach(function (project) {
        var b = button("opt");
        b.setAttribute("aria-pressed", est.project === project.id ? "true" : "false");
        b.appendChild(make("span", "opt__name", project.name));
        b.appendChild(make("span", "opt__meta", project.weeks + " weeks"));
        b.addEventListener("click", function () {
          est.project = project.id;
          est.step = 2;
          renderEstimate();
        });
        grid1.appendChild(b);
      });
      frag.appendChild(grid1);
    } else if (est.step === 2) {
      estCount.textContent = "Question 2 of 2";
      var project = projectById(est.project);
      frag.appendChild(heading("How far are we going, on a " + project.name.toLowerCase() + "?"));

      var grid2 = make("div", "opts");
      FINISHES.forEach(function (finish) {
        var b = button("opt");
        b.setAttribute("aria-pressed", est.finish === finish.id ? "true" : "false");
        b.appendChild(make("span", "opt__name", finish.name));
        b.appendChild(make("span", "opt__meta", finish.meta));
        b.addEventListener("click", function () {
          est.finish = finish.id;
          est.step = 3;
          renderEstimate();
        });
        grid2.appendChild(b);
      });
      frag.appendChild(grid2);

      var nav = make("div", "est__nav");
      var back = button("link", "Back a step");
      back.addEventListener("click", function () {
        est.step = 1;
        renderEstimate();
      });
      nav.appendChild(back);
      frag.appendChild(nav);
    } else {
      var p = projectById(est.project);
      var f = finishById(est.finish);
      var band = bandFor(p, f);

      estCount.textContent = "Planning band";
      var result = make("div", "est__result");
      result.appendChild(make("p", "est__kicker", p.name + " · " + f.name.toLowerCase()));
      result.appendChild(
        make("p", "est__range", money(band[0]) + " – " + money(band[1]))
      );
      result.appendChild(make("p", "est__weeks", p.weeks + " weeks on site for most " + p.name.toLowerCase() + " jobs"));
      result.appendChild(make("p", "est__body", f.body));
      result.appendChild(
        make(
          "p",
          "est__body",
          "Not in the band: design fees, permits, and anything structural we can’t see until a wall comes open."
        )
      );

      var actions = make("div", "est__actions");
      var use = button("btn btn--sm", "Use this in a walkthrough request");
      use.addEventListener("click", function () {
        openFlow(p.id, f.id);
      });
      actions.appendChild(use);

      var change = button("link", "Change the finish");
      change.addEventListener("click", function () {
        est.step = 2;
        renderEstimate();
      });
      actions.appendChild(change);

      var again = button("link", "Start over");
      again.addEventListener("click", function () {
        est = { step: 1, project: null, finish: null };
        renderEstimate();
        focusHeading(estPanel.querySelector(".est__q"));
      });
      actions.appendChild(again);

      result.appendChild(actions);
      frag.appendChild(result);
      frag.appendChild(
        make(
          "p",
          "estimate__fine",
          "A planning band, not a quote. The itemized proposal after the walkthrough is the number that counts."
        )
      );
    }

    estPanel.textContent = "";
    estPanel.appendChild(frag);

    if (!silent) focusHeading(estPanel.querySelector(".est__q"));
  }

  /* --- walkthrough flow ------------------------------------------------- */

  function flowBandText() {
    if (flow.band) return money(flow.band[0]) + " – " + money(flow.band[1]);
    return "Set at the walkthrough";
  }

  function flowProjectName() {
    if (flow.project === "unsure") return "Not sure yet";
    var p = projectById(flow.project);
    return p ? p.name : "Not sure yet";
  }

  function summary(rows) {
    var box = make("div", "flow__summary");
    rows.forEach(function (row) {
      var line = make("p");
      line.appendChild(make("span", null, row[0] + ": "));
      line.appendChild(document.createTextNode(row[1]));
      box.appendChild(line);
    });
    return box;
  }

  function errorLine(text) {
    var p = make("p", "field__err");
    p.setAttribute("role", "alert");
    p.textContent = text;
    return p;
  }

  function renderFlow(silent) {
    var frag = document.createDocumentFragment();

    if (flow.step === 1) {
      frag.appendChild(heading("What are we looking at?", "flow__title"));
      var grid = make("div", "opts");
      PROJECTS.concat([{ id: "unsure", name: "Not sure yet", weeks: "", meta: "Tell us on the day" }]).forEach(function (project) {
        var b = button("opt");
        b.setAttribute("aria-pressed", flow.project === project.id ? "true" : "false");
        b.appendChild(make("span", "opt__name", project.name));
        b.appendChild(make("span", "opt__meta", project.weeks ? project.weeks + " weeks" : project.meta));
        b.addEventListener("click", function () {
          flow.project = project.id;
          flow.step = 2;
          renderFlow();
        });
        grid.appendChild(b);
      });
      frag.appendChild(grid);
    } else if (flow.step === 2) {
      frag.appendChild(heading("Where’s the house?", "flow__title"));

      var fields = make("div", "fields");

      var streetWrap = make("div", "field");
      var streetLabel = make("label", null, "Street address");
      streetLabel.setAttribute("for", "flow-street");
      var street = document.createElement("input");
      street.id = "flow-street";
      street.name = "street";
      street.type = "text";
      street.autocomplete = "street-address";
      street.placeholder = "3312 Fulton Rd";
      street.value = flow.street;
      streetWrap.appendChild(streetLabel);
      streetWrap.appendChild(street);
      fields.appendChild(streetWrap);

      var zipWrap = make("div", "field");
      var zipLabel = make("label", null, "ZIP code");
      zipLabel.setAttribute("for", "flow-zip");
      var zip = document.createElement("input");
      zip.id = "flow-zip";
      zip.name = "zip";
      zip.type = "text";
      zip.inputMode = "numeric";
      zip.maxLength = 5;
      zip.autocomplete = "postal-code";
      zip.placeholder = "44113";
      zip.value = flow.zip;
      zipWrap.appendChild(zipLabel);
      zipWrap.appendChild(zip);
      fields.appendChild(zipWrap);

      frag.appendChild(fields);

      var err = errorLine("");
      err.hidden = true;
      frag.appendChild(err);

      var nav = make("div", "flow__nav");
      var back = button("btn btn--line btn--sm", "Back");
      back.addEventListener("click", function () {
        flow.street = street.value;
        flow.zip = zip.value;
        flow.step = 1;
        renderFlow();
      });
      nav.appendChild(back);

      var next = button("btn btn--sm", "Continue");
      next.addEventListener("click", function () {
        var streetValue = street.value.trim();
        var zipValue = zip.value.replace(/\D/g, "");

        if (streetValue.length < 4) {
          err.textContent = "We need the street and number — that’s what we look up before the visit.";
          err.hidden = false;
          street.focus();
          return;
        }
        if (zipValue.length !== 5) {
          err.textContent = "That ZIP doesn’t look right — five digits, please.";
          err.hidden = false;
          zip.focus();
          return;
        }
        if (!AREAS[zipValue]) {
          err.textContent = "";
          err.appendChild(
            document.createTextNode(
              "We don’t build in " + zipValue + ". Our crews stay within about 25 minutes of the shop, and we’d rather say no than be late. Call " + PHONE_TEXT + " and we’ll point you at someone good."
            )
          );
          err.hidden = false;
          zip.focus();
          return;
        }

        flow.street = streetValue;
        flow.zip = zipValue;
        flow.area = AREAS[zipValue];
        flow.step = 3;
        renderFlow();
      });
      nav.appendChild(next);
      frag.appendChild(nav);
    } else if (flow.step === 3) {
      frag.appendChild(heading("And how do we reach you?", "flow__title"));

      frag.appendChild(
        summary([
          ["Project", flowProjectName()],
          ["Address", flow.street + ", " + flow.zip],
          ["Band", flow.band ? flowBandText() : "Set at the walkthrough"]
        ])
      );

      var fields3 = make("div", "fields");

      var nameWrap = make("div", "field");
      var nameLabel = make("label", null, "Your name");
      nameLabel.setAttribute("for", "flow-name");
      var name = document.createElement("input");
      name.id = "flow-name";
      name.name = "name";
      name.type = "text";
      name.autocomplete = "name";
      name.placeholder = "Dana Whitfield";
      name.value = flow.name;
      nameWrap.appendChild(nameLabel);
      nameWrap.appendChild(name);
      fields3.appendChild(nameWrap);

      var phoneWrap = make("div", "field");
      var phoneLabel = make("label", null, "Phone");
      phoneLabel.setAttribute("for", "flow-phone");
      var phone = document.createElement("input");
      phone.id = "flow-phone";
      phone.name = "phone";
      phone.type = "tel";
      phone.inputMode = "tel";
      phone.autocomplete = "tel";
      phone.placeholder = "(216) 555-0188";
      phone.value = flow.phone;
      phoneWrap.appendChild(phoneLabel);
      phoneWrap.appendChild(phone);
      fields3.appendChild(phoneWrap);

      var noteWrap = make("div", "field");
      var noteLabel = make("label", null, "Anything we should know? (optional)");
      noteLabel.setAttribute("for", "flow-note");
      var note = document.createElement("textarea");
      note.id = "flow-note";
      note.name = "note";
      note.maxLength = 300;
      note.placeholder = "The kitchen hasn’t been touched since 1974, and the basement gets wet in March.";
      note.value = flow.note;
      noteWrap.appendChild(noteLabel);
      noteWrap.appendChild(note);
      fields3.appendChild(noteWrap);

      frag.appendChild(fields3);

      var timingLabel = make("p", "flow__step", "When would you like to start?");
      timingLabel.style.margin = "1rem 0 0.5rem";
      frag.appendChild(timingLabel);

      var timingGrid = make("div", "opts");
      TIMINGS.forEach(function (timing) {
        var b = button("opt");
        b.setAttribute("aria-pressed", flow.timing === timing.id ? "true" : "false");
        b.appendChild(make("span", "opt__name", timing.label));
        b.appendChild(make("span", "opt__meta", timing.meta));
        b.addEventListener("click", function () {
          flow.name = name.value;
          flow.phone = phone.value;
          flow.note = note.value;
          flow.timing = timing.id;
          renderFlow();
        });
        timingGrid.appendChild(b);
      });
      frag.appendChild(timingGrid);

      var err3 = errorLine("");
      err3.hidden = true;
      frag.appendChild(err3);

      var nav3 = make("div", "flow__nav");
      var back3 = button("btn btn--line btn--sm", "Back");
      back3.addEventListener("click", function () {
        flow.name = name.value;
        flow.phone = phone.value;
        flow.note = note.value;
        flow.step = 2;
        renderFlow();
      });
      nav3.appendChild(back3);

      var send = button("btn btn--sm", "Send the request");
      send.addEventListener("click", function () {
        var nameValue = name.value.trim();
        var digits = phone.value.replace(/\D/g, "");

        if (nameValue.length < 2) {
          err3.textContent = "We need a name to call you back by.";
          err3.hidden = false;
          name.focus();
          return;
        }
        if (digits.length < 10 || digits.length > 11) {
          err3.textContent = "That number doesn’t look right — ten digits, please.";
          err3.hidden = false;
          phone.focus();
          return;
        }
        if (!flow.timing) {
          err3.textContent = "Pick a rough start — it tells us whether to call this week or next.";
          err3.hidden = false;
          return;
        }

        flow.name = nameValue;
        flow.phone = formatPhone(digits);
        flow.note = note.value.trim();
        flow.step = 4;
        renderFlow();
        flowSection.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      nav3.appendChild(send);
      frag.appendChild(nav3);

      phone.addEventListener("blur", function () {
        var digits = phone.value.replace(/\D/g, "");
        if (digits.length === 10 || digits.length === 11) phone.value = formatPhone(digits);
      });
    } else {
      frag.appendChild(make("p", "confirm__big", "Request received."));
      frag.appendChild(
        summary([
          ["Project", flowProjectName()],
          ["Address", flow.street + ", " + flow.zip + " (" + flow.area + ")"],
          ["Start", flow.timing ? TIMINGS.filter(function (t) { return t.id === flow.timing; })[0].label : "—"],
          ["Band", flow.band ? flowBandText() + " (planning)" : "Set at the walkthrough"],
          ["Name", flow.name],
          ["Phone", flow.phone]
        ])
      );

      var nextSteps = make("ol", "next");
      [
        ["01", "Daniel calls you back within one business day, from his mobile. If he misses you, he texts."],
        ["02", "We walk the house together — 60 to 90 minutes, no charge, and you get an honest read on what the job needs."],
        ["03", "An itemized written proposal lands in your inbox 7–10 business days later. No deposit to see it."]
      ].forEach(function (row) {
        var li = make("li");
        li.appendChild(make("span", null, row[0]));
        li.appendChild(make("p", null, row[1]));
        nextSteps.appendChild(li);
      });
      frag.appendChild(nextSteps);

      var note = make("p", "demo-note");
      note.appendChild(make("strong", null, "This is a demo request."));
      note.appendChild(
        document.createTextNode(
          " Nothing was sent and nobody will call. On a live Blockbuilt site this lands in the shop’s inbox with the ZIP already checked."
        )
      );
      frag.appendChild(note);

      var actions = make("div", "flow__nav");
      var again = button("btn btn--sm", "Start another request");
      again.addEventListener("click", function () {
        openFlow(null, null);
      });
      actions.appendChild(again);
      frag.appendChild(actions);
    }

    flowPanel.textContent = "";
    flowPanel.appendChild(frag);

    flowStep.textContent = flow.step > 3 ? "Demo request confirmed" : "Step " + flow.step + " of 3";
    flowReset.hidden = flow.step === 1;

    if (!silent) focusHeading(flowPanel.querySelector(".flow__title"), 210);
  }

  function openFlow(projectId, finishId) {
    flow.step = 1;
    flow.project = projectId || null;
    flow.street = "";
    flow.zip = "";
    flow.area = "";
    flow.name = "";
    flow.phone = "";
    flow.timing = null;
    flow.note = "";

    if (projectId && projectId !== "unsure" && finishId) {
      var p = projectById(projectId);
      var f = finishById(finishId);
      flow.band = bandFor(p, f);
    } else {
      flow.band = null;
    }

    renderFlow();
    flowSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  flowReset.addEventListener("click", function () {
    openFlow(null, null);
  });

  document.querySelectorAll("[data-start]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openFlow(null, null);
    });
  });

  /* Service rows jump into the estimator with the project chosen. */
  document.querySelectorAll("[data-estimate]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      est.project = trigger.getAttribute("data-estimate");
      est.finish = null;
      est.step = 2;
      renderEstimate();
      estimateSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* --- ZIP check -------------------------------------------------------- */

  if (zipForm) {
    zipForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = zipInput.value.replace(/\D/g, "");
      zipOut.className = "zip__out";

      if (value.length !== 5) {
        zipOut.textContent = "That doesn’t look like a ZIP — five digits, please.";
        zipOut.className = "zip__out is-out";
        zipInput.focus();
        return;
      }
      if (AREAS[value]) {
        zipOut.textContent = value + " — that’s our patch. " + AREAS[value] + ".";
        zipOut.className = "zip__out is-in";
      } else {
        zipOut.textContent =
          "Not ours. We stay within about 25 minutes of Literary Road, so we’d be the wrong call at " +
          value +
          ". Call " +
          PHONE_TEXT +
          " anyway and we’ll point you to someone good.";
        zipOut.className = "zip__out is-out";
      }
    });
  }

  /* Initial paint: estimator question one, flow step one. */
  renderEstimate(true);
  renderFlow(true);
})();

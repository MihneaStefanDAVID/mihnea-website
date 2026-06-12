const titles = {
  welcome: "Welcome",
  about: "About me",
  research: "Research",
  engineering: "Engineering",
  teaching: "Teaching",
  community: "Community",
  notes: "Journal",
};

const contentWindow = document.querySelector("#content-window");
const windowBody = contentWindow.querySelector(".window-body");
const aiWindow = document.querySelector("#ai-window");
const pdfWindow = document.querySelector("#pdf-window");
const footballWindow = document.querySelector("#football-window");
const footballWindowBody = document.querySelector("#football-window-body");
const footballCaseStudy = document.querySelector("#football-case-study");
const organismsWindow = document.querySelector("#organisms-window");
const organismsWindowBody = document.querySelector("#organisms-window-body");
const organismsCaseStudy = document.querySelector("#organisms-case-study");
const spyWindow = document.querySelector("#spy-window");
const spyWindowBody = document.querySelector("#spy-window-body");
const spyCaseStudy = document.querySelector("#spy-case-study");
const mosquitoWindow = document.querySelector("#mosquito-window");
const mosquitoWindowBody = document.querySelector("#mosquito-window-body");
const mosquitoCaseStudy = document.querySelector("#mosquito-case-study");
const tspWindow = document.querySelector("#tsp-window");
const tspWindowBody = document.querySelector("#tsp-window-body");
const tspCaseStudy = document.querySelector("#tsp-case-study");
const portfolioWindow = document.querySelector("#portfolio-window");
const portfolioWindowBody = document.querySelector("#portfolio-window-body");
const portfolioCaseStudy = document.querySelector("#portfolio-case-study");
const localWindow = document.querySelector("#local-window");
const localWindowBody = document.querySelector("#local-window-body");
const localCaseStudy = document.querySelector("#local-case-study");
const tspLabWindow = document.querySelector("#tsp-lab-window");
const tspLabIframe = document.querySelector("#tsp-lab-iframe");
const tspLabLoader = document.querySelector("#tsp-lab-loader");
const tspLabKicker = document.querySelector("#tsp-lab-kicker");
const tspLabHeading = document.querySelector("#tsp-lab-heading");
const tspLabStatus = document.querySelector("#tsp-lab-status");
const tspLabStatusLabel = document.querySelector("#tsp-lab-status-label");
const tspLabRetry = document.querySelector("#tsp-lab-retry");
const TSP_VISUALIZER_URL = "https://lab.mihdavid.com/";
let tspLabLoadTimer = null;
let tspLabRevealTimer = null;
let tspLabLoaded = false;
let tspLabLoadStartedAt = 0;
const TSP_LAB_MIN_LOADER_MS = 7000;
const pdfViewer = pdfWindow.querySelector(".pdf-viewer");
const pdfTitle = document.querySelector("#pdf-title");
const pdfDownload = document.querySelector("#pdf-download");
const desktopIntro = document.querySelector(".desktop-intro");
const chat = document.querySelector("#chat");
const chatField = document.querySelector("#chat-field");
const teachingGrid = document.querySelector("#teaching-grid");
const teachingEmpty = document.querySelector("#teaching-empty");
const teachingBreadcrumb = document.querySelector("#teaching-breadcrumb");
const teachingBack = document.querySelector("#teaching-back");
const teachingCount = document.querySelector("#teaching-count");
const andBuilding = document.querySelector("#and-building");
let teachingPath = [];
let pdfReturnWindow = null;

function enableTouchScrolling(element) {
  if (!element) return;

  let previousY = 0;
  let tracking = false;

  element.addEventListener("touchstart", (event) => {
    if (event.touches.length !== 1) return;
    previousY = event.touches[0].clientY;
    tracking = true;
  }, { passive: true });

  element.addEventListener("touchmove", (event) => {
    if (!tracking || event.touches.length !== 1) return;

    const currentY = event.touches[0].clientY;
    const deltaY = previousY - currentY;
    const maxScroll = element.scrollHeight - element.clientHeight;

    if (maxScroll > 0) {
      element.scrollTop = Math.max(0, Math.min(maxScroll, element.scrollTop + deltaY));
      event.preventDefault();
    }

    previousY = currentY;
  }, { passive: false });

  element.addEventListener("touchend", () => {
    tracking = false;
  }, { passive: true });

  element.addEventListener("touchcancel", () => {
    tracking = false;
  }, { passive: true });
}

document.querySelectorAll(".window-body, .project-window-body, .chat").forEach(enableTouchScrolling);

function mountPdf(url) {
  const object = document.createElement("object");
  object.id = "pdf-object";
  object.type = "application/pdf";
  object.data = `${url}#view=FitH`;

  const fallback = document.createElement("p");
  fallback.textContent = "Your browser cannot display this PDF here.";
  object.append(fallback);
  pdfViewer.replaceChildren(object);
}

function openPdf(url, name, returnTo = null) {
  pdfReturnWindow = returnTo === "football" ? footballWindow : returnTo === "organisms" ? organismsWindow : returnTo === "spy" ? spyWindow : returnTo === "mosquito" ? mosquitoWindow : returnTo === "tsp" ? tspWindow : returnTo ? contentWindow : null;
  pdfTitle.textContent = name;
  pdfDownload.href = url;
  pdfDownload.download = name;
  mountPdf(url);
  pdfWindow.classList.add("open");
  contentWindow.classList.remove("open");
  footballWindow.classList.remove("open");
  organismsWindow.classList.remove("open");
  spyWindow.classList.remove("open");
  mosquitoWindow.classList.remove("open");
  tspWindow.classList.remove("open");
  portfolioWindow?.classList.remove("open");
  localWindow?.classList.remove("open");
  desktopIntro.classList.add("hidden");
}

function openPanel(name) {
  if (!titles[name]) return;
  pdfWindow.classList.remove("open");
  footballWindow.classList.remove("open");
  organismsWindow.classList.remove("open");
  spyWindow.classList.remove("open");
  mosquitoWindow.classList.remove("open");
  tspWindow.classList.remove("open");
  portfolioWindow?.classList.remove("open");
  localWindow?.classList.remove("open");
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `panel-${name}`);
  });
  document.querySelector("#window-title").textContent = titles[name];
  contentWindow.classList.add("open");
  windowBody.scrollTop = 0;
  desktopIntro.classList.add("hidden");
}

function teachingNodeAt(path) {
  return path.reduce((node, segment) => {
    return node?.children?.find((item) => item.type === "folder" && item.name === segment);
  }, window.TEACHING_LIBRARY);
}

function fileLabel(name) {
  const extension = name.includes(".") ? name.split(".").pop().toUpperCase() : "FILE";
  return extension.slice(0, 5);
}

function renderTeaching(path = teachingPath) {
  if (!teachingGrid || !window.TEACHING_LIBRARY) return;
  const node = teachingNodeAt(path) || window.TEACHING_LIBRARY;
  teachingPath = node === window.TEACHING_LIBRARY && path.length ? [] : path;
  const children = node.children || [];

  teachingBreadcrumb.replaceChildren();
  ["Teaching", ...teachingPath].forEach((segment, index) => {
    const crumb = document.createElement("button");
    crumb.type = "button";
    crumb.textContent = segment;
    crumb.addEventListener("click", () => renderTeaching(teachingPath.slice(0, index)));
    teachingBreadcrumb.append(crumb);
  });

  const isAndFolder = teachingPath.length === 1 && teachingPath[0] === "AnD";
  teachingBack.disabled = teachingPath.length === 0;
  teachingCount.textContent = `${children.length} ${children.length === 1 ? "item" : "items"}`;
  andBuilding.hidden = !isAndFolder;
  teachingGrid.replaceChildren();
  teachingEmpty.hidden = children.length > 0 || isAndFolder;
  teachingGrid.hidden = children.length === 0;

  children.forEach((item) => {
    const isPdf = item.type === "file" && item.extension === "pdf";
    const entry = document.createElement(item.type === "folder" || isPdf ? "button" : "a");
    entry.className = `explorer-item ${item.type}`;

    const icon = document.createElement("span");
    icon.className = "explorer-icon";
    icon.textContent = item.type === "file" ? fileLabel(item.name) : "";

    const copy = document.createElement("span");
    copy.className = "explorer-copy";
    const title = document.createElement("strong");
    title.textContent = item.label || item.name;
    const detail = document.createElement("small");
    detail.textContent = item.description || (item.type === "folder" ? `${item.children?.length || 0} items` : item.size);
    copy.append(title, detail);
    entry.append(icon, copy);

    if (item.type === "folder") {
      entry.type = "button";
      entry.addEventListener("click", () => renderTeaching([...teachingPath, item.name]));
    } else if (isPdf) {
      entry.type = "button";
      entry.addEventListener("click", () => openPdf(item.url, item.name, true));
    } else {
      entry.href = item.url;
      entry.target = "_blank";
      entry.rel = "noopener";
    }
    teachingGrid.append(entry);
  });
}

teachingBack?.addEventListener("click", () => renderTeaching(teachingPath.slice(0, -1)));
renderTeaching();

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => openPanel(button.dataset.open));
});

document.querySelector(".close-window").addEventListener("click", () => {
  contentWindow.classList.remove("open");
  desktopIntro.classList.remove("hidden");
});

function openAI() {
  aiWindow.classList.add("open");
  setTimeout(() => chatField.focus(), 100);
}

document.querySelectorAll(".open-ai").forEach((button) => button.addEventListener("click", openAI));
document.querySelector(".close-ai").addEventListener("click", () => aiWindow.classList.remove("open"));

document.querySelector(".open-cv").addEventListener("click", () => {
  openPdf("documents/CV_David_Mihnea_Stefan.pdf", "CV.pdf");
});

document.querySelectorAll(".open-football-report").forEach((button) => {
  button.addEventListener("click", () => {
    openPdf("documents/Parallel_Football_G7_Report.pdf", "Parallel Football · Team Report.pdf", "football");
  });
});

document.querySelectorAll(".open-football-statement").forEach((button) => {
  button.addEventListener("click", () => {
    openPdf("documents/Parallel_Football_Problem_Statement.pdf", "Parallel Football · Problem Statement.pdf", "football");
  });
});

document.querySelectorAll(".open-organisms-report").forEach((button) => {
  button.addEventListener("click", () => {
    openPdf("documents/Organisms_G8_Report.pdf", "Organisms · Team Report.pdf", "organisms");
  });
});

document.querySelectorAll(".open-organisms-statement").forEach((button) => {
  button.addEventListener("click", () => {
    openPdf("documents/Organisms_Problem_Statement.pdf", "Organisms · Problem Statement.pdf", "organisms");
  });
});

document.querySelectorAll(".open-spy-report").forEach((button) => {
  button.addEventListener("click", () => {
    openPdf("documents/Spy_G7_Report.pdf", "Soldier, Soldier, Soldier, Spy · Team Report.pdf", "spy");
  });
});

document.querySelectorAll(".open-spy-statement").forEach((button) => {
  button.addEventListener("click", () => {
    openPdf("documents/Spy_Problem_Statement.pdf", "Soldier, Soldier, Soldier, Spy · Problem Statement.pdf", "spy");
  });
});

document.querySelectorAll(".open-mosquito-report").forEach((button) => {
  button.addEventListener("click", () => {
    openPdf("documents/Mosquito_G1_Report.pdf", "Mosquito · Team Report.pdf", "mosquito");
  });
});

document.querySelectorAll(".open-mosquito-statement").forEach((button) => {
  button.addEventListener("click", () => {
    openPdf("documents/Mosquito_Problem_Statement.pdf", "Mosquito · Problem Statement.pdf", "mosquito");
  });
});

document.querySelectorAll(".open-tsp-theory").forEach((button) => {
  button.addEventListener("click", () => {
    openPdf("documents/SHPP_Theoretical_Report.pdf", "Can We Cheat NP-Hardness · Theoretical Report.pdf", "tsp");
  });
});

document.querySelectorAll(".open-tsp-practical").forEach((button) => {
  button.addEventListener("click", () => {
    openPdf("documents/SHPP_Practical_Report_TSP.pdf", "TSP Laboratory · Practical Report.pdf", "tsp");
  });
});

function openFootballProject() {
  if (footballCaseStudy.parentElement !== footballWindowBody) {
    footballWindowBody.append(footballCaseStudy);
  }
  footballCaseStudy.hidden = false;
  contentWindow.classList.remove("open");
  pdfWindow.classList.remove("open");
  organismsWindow.classList.remove("open");
  spyWindow.classList.remove("open");
  mosquitoWindow.classList.remove("open");
  tspWindow.classList.remove("open");
  portfolioWindow?.classList.remove("open");
  localWindow?.classList.remove("open");
  footballWindow.classList.add("open");
  footballWindowBody.scrollTop = 0;
  desktopIntro.classList.add("hidden");
}

const footballCard = document.querySelector(".project-card.football");
footballCard?.addEventListener("click", openFootballProject);
footballCard?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openFootballProject();
  }
});

document.querySelector(".close-football")?.addEventListener("click", () => {
  footballWindow.classList.remove("open");
  openPanel("engineering");
});

function openOrganismsProject() {
  if (organismsCaseStudy.parentElement !== organismsWindowBody) {
    organismsWindowBody.append(organismsCaseStudy);
  }
  organismsCaseStudy.hidden = false;
  contentWindow.classList.remove("open");
  pdfWindow.classList.remove("open");
  footballWindow.classList.remove("open");
  spyWindow.classList.remove("open");
  mosquitoWindow.classList.remove("open");
  tspWindow.classList.remove("open");
  portfolioWindow?.classList.remove("open");
  localWindow?.classList.remove("open");
  organismsWindow.classList.add("open");
  organismsWindowBody.scrollTop = 0;
  desktopIntro.classList.add("hidden");
}

const organismsCard = document.querySelector(".project-card.organisms");
organismsCard?.addEventListener("click", openOrganismsProject);
organismsCard?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openOrganismsProject();
  }
});

function openSpyProject() {
  if (spyCaseStudy.parentElement !== spyWindowBody) {
    spyWindowBody.append(spyCaseStudy);
  }
  spyCaseStudy.hidden = false;
  contentWindow.classList.remove("open");
  pdfWindow.classList.remove("open");
  footballWindow.classList.remove("open");
  organismsWindow.classList.remove("open");
  mosquitoWindow.classList.remove("open");
  tspWindow.classList.remove("open");
  portfolioWindow?.classList.remove("open");
  localWindow?.classList.remove("open");
  spyWindow.classList.add("open");
  spyWindowBody.scrollTop = 0;
  desktopIntro.classList.add("hidden");
}

const spyCard = document.querySelector(".project-card.spy");
spyCard?.addEventListener("click", openSpyProject);
spyCard?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openSpyProject();
  }
});

document.querySelector(".close-spy")?.addEventListener("click", () => {
  spyWindow.classList.remove("open");
  tspWindow.classList.remove("open");
  openPanel("engineering");
});

function openMosquitoProject() {
  if (mosquitoCaseStudy.parentElement !== mosquitoWindowBody) {
    mosquitoWindowBody.append(mosquitoCaseStudy);
  }
  mosquitoCaseStudy.hidden = false;
  contentWindow.classList.remove("open");
  pdfWindow.classList.remove("open");
  footballWindow.classList.remove("open");
  organismsWindow.classList.remove("open");
  spyWindow.classList.remove("open");
  tspWindow.classList.remove("open");
  portfolioWindow?.classList.remove("open");
  localWindow?.classList.remove("open");
  mosquitoWindow.classList.add("open");
  mosquitoWindowBody.scrollTop = 0;
  desktopIntro.classList.add("hidden");
}

const mosquitoCard = document.querySelector(".project-card.mosquito");
mosquitoCard?.addEventListener("click", openMosquitoProject);
mosquitoCard?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openMosquitoProject();
  }
});

document.querySelector(".close-mosquito")?.addEventListener("click", () => {
  mosquitoWindow.classList.remove("open");
  openPanel("engineering");
});

function openTspProject() {
  if (tspCaseStudy.parentElement !== tspWindowBody) {
    tspWindowBody.append(tspCaseStudy);
  }
  tspCaseStudy.hidden = false;
  contentWindow.classList.remove("open");
  pdfWindow.classList.remove("open");
  footballWindow.classList.remove("open");
  organismsWindow.classList.remove("open");
  spyWindow.classList.remove("open");
  mosquitoWindow.classList.remove("open");
  tspLabWindow?.classList.remove("open");
  portfolioWindow?.classList.remove("open");
  localWindow?.classList.remove("open");
  tspWindow.classList.add("open");
  tspWindowBody.scrollTop = 0;
  desktopIntro.classList.add("hidden");
}

function openPortfolioProject() {
  if (portfolioCaseStudy.parentElement !== portfolioWindowBody) {
    portfolioWindowBody.append(portfolioCaseStudy);
  }
  portfolioCaseStudy.hidden = false;
  contentWindow.classList.remove("open");
  pdfWindow.classList.remove("open");
  footballWindow.classList.remove("open");
  organismsWindow.classList.remove("open");
  spyWindow.classList.remove("open");
  mosquitoWindow.classList.remove("open");
  tspWindow.classList.remove("open");
  tspLabWindow?.classList.remove("open");
  localWindow?.classList.remove("open");
  portfolioWindow.classList.add("open");
  portfolioWindowBody.scrollTop = 0;
  desktopIntro.classList.add("hidden");
}

const portfolioCard = document.querySelector(".portfolio-project");
portfolioCard?.addEventListener("click", openPortfolioProject);
portfolioCard?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openPortfolioProject();
  }
});

document.querySelector(".close-portfolio")?.addEventListener("click", () => {
  portfolioWindow.classList.remove("open");
  openPanel("engineering");
});

document.querySelector(".close-portfolio-from-page")?.addEventListener("click", () => {
  portfolioWindow.classList.remove("open");
  openPanel("engineering");
});

function openLocalProject() {
  if (localCaseStudy.parentElement !== localWindowBody) {
    localWindowBody.append(localCaseStudy);
  }
  localCaseStudy.hidden = false;
  contentWindow.classList.remove("open");
  pdfWindow.classList.remove("open");
  footballWindow.classList.remove("open");
  organismsWindow.classList.remove("open");
  spyWindow.classList.remove("open");
  mosquitoWindow.classList.remove("open");
  tspWindow.classList.remove("open");
  tspLabWindow?.classList.remove("open");
  portfolioWindow?.classList.remove("open");
  localWindow.classList.add("open");
  localWindowBody.scrollTop = 0;
  desktopIntro.classList.add("hidden");
}

const localCard = document.querySelector(".local-project");
localCard?.addEventListener("click", openLocalProject);
localCard?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openLocalProject();
  }
});

document.querySelector(".close-local")?.addEventListener("click", () => {
  localWindow.classList.remove("open");
  openPanel("engineering");
});

document.querySelector(".close-local-from-page")?.addEventListener("click", () => {
  localWindow.classList.remove("open");
  openPanel("engineering");
});

function loadTspLab() {
  if (!tspLabIframe || !tspLabLoader) return;

  window.clearTimeout(tspLabLoadTimer);
  window.clearTimeout(tspLabRevealTimer);
  tspLabLoaded = false;
  tspLabLoadStartedAt = Date.now();
  tspLabLoader.classList.remove("mobile-note");
  tspLabLoader.hidden = false;
  tspLabIframe.hidden = false;
  tspLabIframe.classList.remove("ready");
  tspLabRetry.hidden = true;
  tspLabKicker.textContent = "INTERACTIVE LAB / STARTING SERVER";
  tspLabHeading.innerHTML = "Waking up the<br /><em>algorithm laboratory.</em>";
  tspLabStatusLabel.textContent = "Connecting to the laboratory server";
  tspLabStatus.textContent = "The lab runs on a free research server. If it has been resting, startup can take up to one minute.";

  tspLabIframe.src = `${TSP_VISUALIZER_URL}?startup=${Date.now()}`;
  tspLabLoadTimer = window.setTimeout(() => {
    if (tspLabLoaded) return;
    tspLabStatusLabel.textContent = "The server is still waking up";
    tspLabStatus.textContent = "This first start is taking a little longer than usual. You can keep waiting or ask the laboratory to try connecting again.";
    tspLabRetry.hidden = false;
  }, 70000);
}

tspLabIframe?.addEventListener("load", () => {
  tspLabLoaded = true;
  window.clearTimeout(tspLabLoadTimer);
  if (window.matchMedia("(max-width: 800px)").matches) return;

  const remainingLoaderTime = Math.max(0, TSP_LAB_MIN_LOADER_MS - (Date.now() - tspLabLoadStartedAt));

  tspLabRevealTimer = window.setTimeout(() => {
    tspLabIframe.classList.add("ready");
    tspLabLoader.hidden = true;
  }, remainingLoaderTime);
});

tspLabRetry?.addEventListener("click", loadTspLab);

function openTspLab() {
  contentWindow.classList.remove("open");
  pdfWindow.classList.remove("open");
  footballWindow.classList.remove("open");
  organismsWindow.classList.remove("open");
  spyWindow.classList.remove("open");
  mosquitoWindow.classList.remove("open");
  tspWindow.classList.remove("open");
  portfolioWindow?.classList.remove("open");
  localWindow?.classList.remove("open");

  tspLabWindow?.classList.add("open");
  desktopIntro.classList.add("hidden");

  if (window.matchMedia("(max-width: 800px)").matches) {
    window.clearTimeout(tspLabLoadTimer);
    window.clearTimeout(tspLabRevealTimer);
    tspLabLoader.classList.add("mobile-note");
    tspLabLoader.hidden = false;
    tspLabIframe.hidden = true;
    tspLabIframe.classList.remove("ready");
    tspLabKicker.textContent = "INTERACTIVE LAB / DESKTOP EXPERIENCE";
    tspLabHeading.innerHTML = "Best explored on<br /><em>a laptop.</em>";
    tspLabStatus.textContent = "The laboratory combines large algorithm visualisations, controls, simulations and an interactive road map. A mobile version is still in progress.";
    tspLabStatusLabel.textContent = "Please return from a laptop or desktop";
    tspLabRetry.hidden = true;
    return;
  }

  if (!tspLabLoaded) loadTspLab();
}

document.querySelectorAll(".open-tsp-lab").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    openTspLab();
  });
});

document.querySelector(".close-tsp-lab")?.addEventListener("click", () => {
  tspLabWindow?.classList.remove("open");
  openTspProject();
});

const tspCard = document.querySelector(".tsp-project");
tspCard?.addEventListener("click", openTspProject);
tspCard?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openTspProject();
  }
});

document.querySelector(".close-tsp")?.addEventListener("click", () => {
  tspWindow.classList.remove("open");
  openPanel("engineering");
});

document.querySelector(".close-organisms")?.addEventListener("click", () => {
  organismsWindow.classList.remove("open");
  openPanel("engineering");
});

document.querySelector(".close-pdf").addEventListener("click", () => {
  pdfWindow.classList.remove("open");
  pdfViewer.replaceChildren();
  if (pdfReturnWindow) {
    pdfReturnWindow.classList.add("open");
  } else {
    desktopIntro.classList.remove("hidden");
  }
  pdfReturnWindow = null;
});

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  const author = document.createElement("small");
  author.textContent = type === "user" ? "YOU" : "SOLVY";
  const body = document.createElement("p");
  body.textContent = text;
  message.append(author, body);
  chat.append(message);
  chat.scrollTop = chat.scrollHeight;
  return message;
}

function answer(question) {
  const query = question.toLowerCase();
  if (query.includes("research") || query.includes("privacy") || query.includes("pac") || query.includes("theory") || query.includes("genai") || query.includes("generative ai") || query.includes("upenn") || query.includes("problem solving")) {
    openPanel("research");
    return "I've opened Research. Mihnea explores differential privacy, private learning and computational efficiency. He is also beginning a collaboration at UPenn on programming and problem solving in the GenAI era: what AI can implement or discover, what still requires human judgment, and how computer science courses should adapt.";
  }
  if (query.includes("project") || query.includes("engineering") || query.includes("work") || query.includes("build") || query.includes("imc")) {
    openPanel("engineering");
    return "I've opened Engineering. It includes four open-ended Programming and Problem Solving projects, the Local messaging application, and an interactive guide to approximation algorithms for the Travelling Salesperson Problem.";
  }
  if (query.includes("market") || query.includes("econom") || query.includes("finance") || query.includes("trading") || query.includes("amsterdam")) {
    openPanel("about");
    return "Mihnea is deeply interested in economics, financial markets, and market making: a field where probability, algorithms, and decisions under uncertainty meet. His next chapter will be at IMC in Amsterdam.";
  }
  if (query.includes("about") || query.includes("background") || query.includes("who")) {
    openPanel("about");
    return "Mihnea studies Computer Science at ETH Zürich, but his interests extend into mathematics, physics, educational sciences, political science, and civic participation. He combines research and engineering with teaching, student representation, and community-building. I've opened his full story.";
  }
  if (query.includes("teach") || query.includes("ta")) {
    openPanel("teaching");
    return "I've opened Teaching. Mihnea has been a Teaching Assistant for Algorithms and Data Structures, Algorithms and Probability, and Numerical Methods for Computer Science. He has also worked as a Coding Assistant and Academic Facilitator for ETH's PVK exam-preparation program.";
  }
  if (query.includes("community") || query.includes("leadership") || query.includes("education") || query.includes("icpc") || query.includes("activism")) {
    openPanel("community");
    return "I've opened Community. It brings together the causes Mihnea cares about, habits for staying thoughtfully informed, a reading list on technology and society, and organizations whose work is worth exploring.";
  }
  if (query.includes("journal") || query.includes("blog") || query.includes("article") || query.includes("essay") || query.includes("writing") || query.includes("reflection")) {
    openPanel("notes");
    return "I've opened Journal, a space for Mihnea's technical ideas, lessons from research and teaching, and reflections on education, markets, technology and society. The first entries are still in progress.";
  }
  if (query.includes("contact") || query.includes("email") || query.includes("instagram") || query.includes("linkedin") || query.includes("reach")) {
    openPanel("welcome");
    return "I've opened Welcome, where you can reach Mihnea at mihdavid@ethz.ch or find him on Instagram and LinkedIn.";
  }
  return "I'm having trouble reaching my AI brain right now — give it a few seconds and ask again. Meanwhile I can still navigate: ask about Mihnea's research, projects, teaching, community work or journal and I'll open the right folder.";
}

const SOLVY_ENDPOINT = "/api/solvy";
const solvyHistory = [];
let solvyPending = false;

const SOLVY_EXTERNAL_LINKS = {
  github: "https://github.com/MihneaStefanDAVID",
  github_football: "https://github.com/MihneaStefanDAVID/PPS_football",
  github_mosquito: "https://github.com/MihneaStefanDAVID/PPS_mosquito",
  github_organisms: "https://github.com/MihneaStefanDAVID/PPS_organisms",
  github_spy: "https://github.com/MihneaStefanDAVID/PPS_spy",
  github_tsp: "https://github.com/MihneaStefanDAVID/TSP_visualisation",
  linkedin: "https://www.linkedin.com/in/mihnea-stefan-david-950893268/",
  instagram: "https://www.instagram.com/david_mihnea/",
  tsp_lab: "https://lab.mihdavid.com",
  local_apk: "https://polybox.ethz.ch/index.php/s/JarNcdEZiCSbRYJ",
};

const solvyActionRunners = {
  open_section(args) {
    const section = args.section === "journal" ? "notes" : args.section;
    if (!titles[section]) return;
    openPanel(section);
    const find = String(args.find || "").trim().toLowerCase();
    if (!find) return;
    // Give the panel a moment to render, then scroll to the matching heading.
    setTimeout(() => {
      const panel = document.querySelector(".panel.active");
      if (!panel) return;
      const headings = panel.querySelectorAll("h2, h3, h4, h5, strong, small, span, b");
      for (const el of headings) {
        if (el.textContent.toLowerCase().includes(find)) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          break;
        }
      }
    }, 400);
  },
  open_external(args) {
    const url = SOLVY_EXTERNAL_LINKS[args.target];
    if (url) window.open(url, "_blank", "noopener");
  },
  compose_email(args) {
    const subject = encodeURIComponent(String(args.subject || "Hello from your website"));
    const emailBody = encodeURIComponent(String(args.body || ""));
    window.open(`mailto:mihdavid@ethz.ch?subject=${subject}&body=${emailBody}`, "_self");
  },
  close_windows() {
    document.querySelectorAll(".app-window.open").forEach((w) => w.classList.remove("open"));
    desktopIntro.classList.remove("hidden");
  },
  open_project(args) {
    const projects = {
      local: openLocalProject,
      football: openFootballProject,
      organisms: openOrganismsProject,
      spy: openSpyProject,
      mosquito: openMosquitoProject,
      tsp: openTspProject,
      tsp_lab: openTspLab,
      portfolio: openPortfolioProject,
    };
    projects[args.project]?.();
  },
  open_teaching_file(args) {
    const url = String(args.url || "");
    // Only files that actually live on this site can be opened.
    if (url.startsWith("teaching-materials/") || url.startsWith("documents/")) {
      openPdf(url, String(args.name || url.split("/").pop()));
    }
  },
  open_document(args) {
    const documents = {
      cv: ["documents/CV_David_Mihnea_Stefan.pdf", "CV.pdf"],
      football_report: ["documents/Parallel_Football_G7_Report.pdf", "Parallel Football · Team Report.pdf"],
      football_statement: ["documents/Parallel_Football_Problem_Statement.pdf", "Parallel Football · Problem Statement.pdf"],
      organisms_report: ["documents/Organisms_G8_Report.pdf", "Organisms · Team Report.pdf"],
      organisms_statement: ["documents/Organisms_Problem_Statement.pdf", "Organisms · Problem Statement.pdf"],
      spy_report: ["documents/Spy_G7_Report.pdf", "Soldier, Soldier, Soldier, Spy · Team Report.pdf"],
      spy_statement: ["documents/Spy_Problem_Statement.pdf", "Soldier, Soldier, Soldier, Spy · Problem Statement.pdf"],
      mosquito_report: ["documents/Mosquito_G1_Report.pdf", "Mosquito · Team Report.pdf"],
      mosquito_statement: ["documents/Mosquito_Problem_Statement.pdf", "Mosquito · Problem Statement.pdf"],
      tsp_theory: ["documents/SHPP_Theoretical_Report.pdf", "Can We Cheat NP-Hardness · Theoretical Report.pdf"],
      tsp_practical: ["documents/SHPP_Practical_Report_TSP.pdf", "TSP Laboratory · Practical Report.pdf"],
    };
    const doc = documents[args.document];
    if (doc) openPdf(doc[0], doc[1]);
  },
};

function runSolvyActions(actions) {
  if (!Array.isArray(actions)) return;
  actions.forEach((action) => {
    try {
      solvyActionRunners[action.tool]?.(action.args || {});
    } catch {
      /* a failed navigation should never break the chat */
    }
  });
}

function teachingLibrarySummary() {
  const library = window.TEACHING_LIBRARY;
  if (!library) return "";
  const lines = [];
  const walk = (node, path) => {
    (node.children || []).forEach((item) => {
      if (lines.length >= 80) return;
      if (item.type === "folder") {
        lines.push(`[folder] ${path}${item.name}/${item.description ? " — " + item.description : ""}`);
        walk(item, `${path}${item.name}/`);
      } else {
        lines.push(`[file] ${path}${item.name} (url: ${item.url})${item.description ? " — " + item.description : ""}`);
      }
    });
  };
  walk(library, "");
  if (!lines.length) return "The teaching library is currently empty (materials in preparation for Autumn 2026).";
  return lines.join("\n").slice(0, 3800);
}

function currentViewLabel() {
  if (document.querySelector("#pdf-window.open")) return "the PDF viewer";
  const openWindow = [...document.querySelectorAll(".app-window.open")].find((w) => w.id !== "ai-window");
  if (!openWindow) return "the desktop (no window open)";
  if (openWindow.id === "content-window") {
    const panel = document.querySelector(".panel.active");
    const name = panel ? titles[panel.id.replace("panel-", "")] : null;
    return name ? `the "${name}" section` : "a section window";
  }
  return openWindow.getAttribute("aria-label") || "a project window";
}

function proposalToAction(args) {
  const tool = String(args.tool || "");
  if (tool === "compose_email") {
    return { tool, args: { subject: args.subject, body: args.body } };
  }
  const target = String(args.target || "");
  if (!target) return null;
  if (tool === "open_section") return { tool, args: { section: target, find: args.find } };
  if (tool === "open_project") return { tool, args: { project: target } };
  if (tool === "open_document") return { tool, args: { document: target } };
  if (tool === "open_external") return { tool, args: { target } };
  if (tool === "open_teaching_file") return { tool, args: { url: target, name: args.name } };
  return null;
}

function annotateLastReply(note) {
  for (let i = solvyHistory.length - 1; i >= 0; i--) {
    if (solvyHistory[i].role === "assistant") {
      solvyHistory[i].content += ` ${note}`;
      return;
    }
  }
}

function renderProposal(proposalAction) {
  const args = proposalAction.args || {};
  const action = proposalToAction(args);
  if (!action) return false;

  // A second chat bubble: the offer text plus Yes/No buttons inside it.
  const message = addMessage(
    String(args.question || `Open ${args.target}?`).slice(0, 160),
    "ai proposal"
  );
  const wrap = document.createElement("div");
  wrap.className = "suggestions dynamic confirm";

  const yes = document.createElement("button");
  yes.type = "button";
  yes.textContent = `✓ ${String(args.yes_label || "Yes, open it").slice(0, 40)}`;
  yes.addEventListener("click", () => {
    wrap.remove();
    runSolvyActions([action]);
    annotateLastReply("[The visitor accepted — it is now open.]");
  });

  const no = document.createElement("button");
  no.type = "button";
  no.textContent = String(args.no_label || "Not now").slice(0, 40);
  no.addEventListener("click", () => {
    wrap.remove();
    annotateLastReply("[The visitor declined the offer to open it.]");
  });

  wrap.append(yes, no);
  message.append(wrap);
  chat.scrollTop = chat.scrollHeight;
  return true;
}

function clearDynamicChips() {
  document.querySelectorAll("#chat .suggestions.dynamic").forEach((el) => el.remove());
}

function showTyping() {
  const message = document.createElement("div");
  message.className = "message ai typing";
  const body = document.createElement("p");
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    dot.className = "typing-dot";
    body.append(dot);
  }
  message.append(body);
  chat.append(message);
  chat.scrollTop = chat.scrollHeight;
  return message;
}

async function ask(question) {
  const text = question.trim();
  if (!text || solvyPending) return;
  solvyPending = true;
  clearDynamicChips();
  addMessage(text, "user");
  chatField.value = "";
  solvyHistory.push({ role: "user", content: text });

  const typing = showTyping();
  // Never let the chat hang on "..." — abort and fall back after 75s.
  const abort = new AbortController();
  const abortTimer = setTimeout(() => abort.abort(), 75_000);
  try {
    // One automatic retry: transient Workers AI hiccups usually clear in a second.
    let response = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        response = await fetch(SOLVY_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abort.signal,
          body: JSON.stringify({
            messages: solvyHistory.slice(-10),
            context: teachingLibrarySummary(),
            state: currentViewLabel(),
          }),
        });
        if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
        break;
      } catch (attemptError) {
        if (attempt === 1 || abort.signal.aborted) throw attemptError;
        console.warn("Solvy attempt 1 failed, retrying:", attemptError);
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    }

    // v2 protocol: one JSON meta line ({v, actions}), then the reply text, streamed.
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let meta = null;
    let replyParagraph = null;
    let replyText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      if (!meta) {
        const newline = buffer.indexOf("\n");
        if (newline < 0) continue;
        meta = JSON.parse(buffer.slice(0, newline));
        buffer = buffer.slice(newline + 1);
        typing.remove();
        const allActions = Array.isArray(meta.actions) ? meta.actions : [];
        runSolvyActions(allActions.filter((a) => a.tool !== "propose_navigation"));
        meta.proposals = allActions.filter((a) => a.tool === "propose_navigation");
        replyParagraph = addMessage("", "ai").querySelector("p");
      }
      if (meta && buffer) {
        replyText += buffer;
        buffer = "";
        replyParagraph.textContent = replyText;
        chat.scrollTop = chat.scrollHeight;
      }
    }
    if (!meta) throw new Error("bad response");

    replyText = replyText.trim() || "Done! Have a look around — and ask me anything else.";
    replyParagraph.textContent = replyText;
    solvyHistory.push({ role: "assistant", content: replyText });
    (meta.proposals || []).some((p) => renderProposal(p));
    chat.scrollTop = chat.scrollHeight;
  } catch (error) {
    // Offline / not yet deployed: fall back to the built-in keyword guide.
    console.warn("Solvy API failed, using offline fallback:", error);
    typing.remove();
    document.querySelector("#chat .message.ai:last-child p:empty")?.closest(".message")?.remove();
    const fallback = answer(text);
    addMessage(fallback, "ai");
    solvyHistory.push({ role: "assistant", content: fallback });
  } finally {
    clearTimeout(abortTimer);
    solvyPending = false;
  }
}

document.querySelector("#chat-form").addEventListener("submit", (event) => {
  event.preventDefault();
  ask(chatField.value);
});

document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openAI();
  }
});

function updateTime() {
  document.querySelector("#time").textContent = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Zurich",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

updateTime();
setInterval(updateTime, 30_000);

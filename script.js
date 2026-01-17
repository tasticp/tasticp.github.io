// ===== ANIMATED TAB TITLE =====
const tabTitles = [
  "tasticp | Portfolio",
  "< Developer />",
  "{ coding... }",
  "[ projects ]",
  "( connect )",
];
let currentTitleIndex = 0;

function animateTabTitle() {
  document.title = tabTitles[currentTitleIndex];
  currentTitleIndex = (currentTitleIndex + 1) % tabTitles.length;
}

setInterval(animateTabTitle, 2000);

// ===== TYPING ANIMATION =====
const typingText = "tasticp";
const typingElement = document.getElementById("typingName");
let charIndex = 0;
let isDeleting = false;
let typingDelay = 150;

function typeEffect() {
  if (!typingElement) return;

  if (!isDeleting && charIndex <= typingText.length) {
    typingElement.textContent = typingText.substring(0, charIndex);
    charIndex++;
    setTimeout(typeEffect, typingDelay);
  } else if (isDeleting && charIndex > 0) {
    typingElement.textContent = typingText.substring(0, charIndex);
    charIndex--;
    setTimeout(typeEffect, typingDelay / 2);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      setTimeout(typeEffect, 500);
    } else {
      setTimeout(typeEffect, 2000);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(typeEffect, 1000);
});

// ===== FLOATING CODE SNIPPETS =====
const codeSnippets = [
  "const dev = new Developer();",
  "function buildProject() {}",
  'import { success } from "life";',
  "while(learning) { improve(); }",
  "class Mechatronics extends Engineering",
  "await deploy(portfolio);",
  'git commit -m "progress"',
  "npm run build",
  "rust.compile();",
  "// TODO: change the world",
  "if (coffee) { code(); }",
  "robots.activate();",
];

function createFloatingCode() {
  const container = document.getElementById("floatingCode");
  if (!container) return;

  codeSnippets.forEach((snippet, index) => {
    const span = document.createElement("span");
    span.textContent = snippet;
    span.style.left = `${Math.random() * 100}%`;
    span.style.animationDelay = `${Math.random() * 15}s`;
    span.style.animationDuration = `${15 + Math.random() * 10}s`;
    container.appendChild(span);
  });
}

createFloatingCode();

// ===== NAVIGATION =====
const nav = document.getElementById("nav");
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const navLinks = document.querySelectorAll(".nav__link");

// Scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

// Mobile menu
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show");
  });
}

if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
  });
});

// Active link on scroll
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");
    const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach((link) => link.classList.remove("active"));
      if (navLink) navLink.classList.add("active");
    }
  });
}

window.addEventListener("scroll", scrollActive);

// ===== SKILLS TABS =====
const skillsTabs = document.querySelectorAll(".skills__tab");
const skillsPanels = document.querySelectorAll(".skills__panel");

skillsTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    // Remove active from all tabs and panels
    skillsTabs.forEach((t) => t.classList.remove("active"));
    skillsPanels.forEach((p) => p.classList.remove("active"));

    // Add active to clicked tab and corresponding panel
    tab.classList.add("active");
    document.getElementById(target).classList.add("active");

    // Animate skill bars if coding tab
    if (target === "coding") {
      animateSkillBars();
    }
  });
});

// ===== SKILL BARS ANIMATION =====
function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-bar__fill");
  skillBars.forEach((bar) => {
    bar.classList.remove("animate");
    setTimeout(() => {
      bar.classList.add("animate");
    }, 100);
  });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      // Animate skill bars when skills section is visible
      if (entry.target.id === "skills") {
        setTimeout(animateSkillBars, 500);
      }
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll(".section").forEach((section) => {
  observer.observe(section);
});

// ===== GITHUB API INTEGRATION =====
const GITHUB_USERNAME = "tasticp";
const projectsGrid = document.getElementById("projectsGrid");
const filterBtns = document.querySelectorAll(".filter-btn");

// Language colors
const languageColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  C: "#555555",
  Shell: "#89e051",
  Vue: "#41b883",
};

async function fetchGitHubRepos() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=30`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch repos");
    }

    const repos = await response.json();
    displayProjects(repos);
    updateRepoCount(repos.length);
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    displayFallbackProjects();
  }
}

function updateRepoCount(count) {
  const repoCountEl = document.getElementById("repoCount");
  if (repoCountEl) {
    repoCountEl.textContent = count;
  }
}

function displayProjects(repos) {
  if (!projectsGrid) return;

  projectsGrid.innerHTML = "";

  // Filter out forks and show public repos
  const filteredRepos = repos.filter((repo) => !repo.fork);

  if (filteredRepos.length === 0) {
    projectsGrid.innerHTML = '<p class="no-projects">No projects found.</p>';
    return;
  }

  filteredRepos.forEach((repo) => {
    const card = createProjectCard(repo);
    projectsGrid.appendChild(card);
  });
}

function createProjectCard(repo) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.dataset.language = repo.language || "Other";

  const langColor = languageColors[repo.language] || "#858585";

  card.innerHTML = `
        <div class="project-card__header">
            <div class="project-card__icon">
                <i class="fas fa-folder-open"></i>
            </div>
            <div class="project-card__links">
                <a href="${repo.html_url}" target="_blank" title="View Repository">
                    <i class="fab fa-github"></i>
                </a>
                ${
                  repo.homepage
                    ? `
                    <a href="${repo.homepage}" target="_blank" title="Live Demo">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                `
                    : ""
                }
            </div>
        </div>
        <div class="project-card__body">
            <h3 class="project-card__title">${repo.name}</h3>
            <p class="project-card__description">${repo.description || "No description available."}</p>
        </div>
        <div class="project-card__footer">
            <div class="project-card__language">
                <span class="language-dot" style="background: ${langColor}"></span>
                <span>${repo.language || "Unknown"}</span>
            </div>
            <div class="project-card__stats">
                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
            </div>
        </div>
    `;

  return card;
}

function displayFallbackProjects() {
  const fallbackRepos = [
    {
      name: "Base44RogueLike",
      description:
        "A procedurally-generated roguelike built in JavaScript — focuses on replayability and procedural level systems.",
      language: "JavaScript",
      html_url: "https://github.com/tasticp/Base44RogueLike",
      stargazers_count: 0,
      forks_count: 0,
    },
    {
      name: "Browser-tasks-trial-Est",
      description:
        "A TypeScript experiment using browser APIs for task automation and in-page tooling.",
      language: "TypeScript",
      html_url: "https://github.com/tasticp/Browser-tasks-trial-Est",
      stargazers_count: 0,
      forks_count: 0,
    },
    {
      name: "Zed-But-Browser",
      description:
        "A Rust-based editor/browser experiment inspired by Zed's architecture and real-time editing ideas.",
      language: "Rust",
      html_url: "https://github.com/tasticp/Zed-But-Browser",
      stargazers_count: 0,
      forks_count: 0,
    },
    {
      name: "story-generator",
      description:
        "A creative Python tool to generate unique short stories and narrative seeds.",
      language: "Python",
      html_url: "https://github.com/tasticp/story-generator",
      stargazers_count: 0,
      forks_count: 0,
    },
    {
      name: "ITE-NP",
      description:
        "ITE and NP coursework projects including networking and mechatronics.",
      language: "C++",
      html_url: "https://github.com/tasticp/ITE-NP",
      stargazers_count: 1,
      forks_count: 0,
    },
    {
      name: "Landing-Page",
      description: "A creative landing page experiment.",
      language: "HTML",
      html_url: "https://github.com/tasticp/Landing-Page",
      stargazers_count: 0,
      forks_count: 0,
    },
  ];

  displayProjects(fallbackRepos);
}

// Project filtering
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const cards = document.querySelectorAll(".project-card");
    cards.forEach((card) => {
      if (filter === "all" || card.dataset.language === filter) {
        card.style.display = "block";
        card.style.animation = "fadeIn 0.5s ease forwards";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// Fetch repos on load
document.addEventListener("DOMContentLoaded", fetchGitHubRepos);

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ===== TIMELINE ANIMATION =====
const timelineItems = document.querySelectorAll(".timeline__item");

const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 200);
      }
    });
  },
  { threshold: 0.2 },
);

timelineItems.forEach((item) => {
  item.style.opacity = "0";
  item.style.transform = "translateY(30px)";
  item.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  timelineObserver.observe(item);
});

// ===== CONNECT CARDS ANIMATION =====
const connectCards = document.querySelectorAll(".connect-card");

const connectObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 50);
      }
    });
  },
  { threshold: 0.1 },
);

connectCards.forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
  connectObserver.observe(card);
});

// ===== PARALLAX EFFECT ON HERO =====
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const hero = document.querySelector(".hero__image");

  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.1}px)`;
  }
});

// ===== CURSOR GLOW EFFECT (Desktop only) =====
if (window.matchMedia("(min-width: 768px)").matches) {
  document.addEventListener("mousemove", (e) => {
    const glow = document.querySelector(".bg-animation::before");
    if (glow) {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    }
  });
}

// ===== CONSOLE EASTER EGG =====
console.log(
  "%c👋 Hey there, fellow developer!",
  "font-size: 20px; font-weight: bold; color: #70FFDB;",
);
console.log(
  "%c📧 Feel free to reach out: ricksue99@gmail.com",
  "font-size: 14px; color: #9A91DE;",
);
console.log(
  "%c🔗 GitHub: https://github.com/tasticp",
  "font-size: 14px; color: #8CE3E0;",
);
console.log(
  '%c💡 Try typing "sudo make me a sandwich" in the About terminal!',
  "font-size: 12px; color: #ff79c6;",
);

// ===== INTERACTIVE TERMINAL =====
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");
const terminalCommands = {
  help: `Available commands:
• whoami - Who am I?
• ls - List files
• cat [file] - View file contents
• skills - Show my skills
• projects - Show my projects
• github - Open GitHub profile
• clear - Clear terminal
• date - Show current date
• neofetch - System info
• exit - Close terminal
• sudo [command] - Try it ;)`,
  whoami:
    "Kelvin (tasticp) — Mechatronics & Robotics student, Developer, Tinkerer",
  ls: "Desktop  Documents  projects.txt  skills.json  interests.txt  secrets/  .bashrc",
  pwd: "/home/tasticp",
  date: () => new Date().toLocaleString(),
  "cat interests.txt": `• Game Development & Procedural Systems
• Rust & Systems Programming
• Embedded & Browser Experiments
• Creative Coding & Open Source`,
  "cat skills.json": `{
  "languages": ["C++", "Python", "Rust", "TypeScript", "JavaScript"],
  "frameworks": ["React", "Next.js", "Tailwind"],
  "tools": ["Git", "Linux", "VS Code", "SolidWorks"]
}`,
  "cat projects.txt":
    'Run "projects" for a better view, or visit github.com/tasticp',
  "cat .bashrc": `# tasticp's bashrc
export PS1="\\[\\033[32m\\]\\u@portfolio:\\[\\033[34m\\]\\w\\[\\033[0m\\]$ "
alias dev="npm run dev"
alias deploy="git push origin main"
# Easter egg: try 'sudo make me a sandwich'`,
  skills: "Redirecting to Skills section...",
  projects: "Redirecting to Projects section...",
  github: "Opening GitHub...",
  neofetch: `
    ████████╗ █████╗ ███████╗████████╗██╗ ██████╗██████╗
    ╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝██║██╔════╝██╔══██╗
       ██║   ███████║███████╗   ██║   ██║██║     ██████╔╝
       ██║   ██╔══██║╚════██║   ██║   ██║██║     ██╔═══╝
       ██║   ██║  ██║███████║   ██║   ██║╚██████╗██║
       ╚═╝   ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝ ╚═════╝╚═╝

    OS: Portfolio OS 2026
    Host: tasticp.github.io
    Shell: bash 5.1
    Terminal: Interactive Web Terminal
    CPU: Brain @ ∞ GHz
    Memory: Unlimited Ideas`,
  clear: "CLEAR",
  exit: "Goodbye! 👋 (just kidding, you can't escape)",
  // Easter eggs
  "sudo rm -rf /":
    "🚨 Nice try! Permission denied. This portfolio is protected.",
  "sudo make me a sandwich":
    "🥪 Okay. Here's your sandwich! You found an easter egg!",
  sudo: "sudo: specify a command",
  hello: "Hey there! 👋 Welcome to my portfolio!",
  hi: "Hello! Nice to meet you!",
  secret: '🔐 Hint: try "cat .bashrc" or "sudo make me a sandwich"',
  "ls secrets/":
    "🤫 nice_try.txt  passwords_definitely_not_here.txt  rickroll.mp4",
  "cat secrets/nice_try.txt": "😄 Good attempt! Here's a cookie: 🍪",
  "cat secrets/rickroll.mp4": "Never gonna give you up! 🎵",
  rm: "Error: Read-only filesystem (it's a portfolio!)",
  vim: "I use VS Code btw",
  nano: "nano: command not found. Try vim 😈",
  emacs: "This isn't the 1980s anymore",
  coffee: "☕ Here you go! Now let's code!",
  "ping google.com": `PING google.com (142.250.190.78): 56 data bytes
64 bytes: icmp_seq=0 ttl=117 time=42ms
--- google.com ping statistics ---
1 packets transmitted, 1 received, 0% packet loss`,
  42: "The answer to life, the universe, and everything!",
  matrix: "🟢 Follow the white rabbit... 🐇",
  konami: "⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️ - You know the code!",
};

if (terminalInput) {
  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = terminalInput.value.trim().toLowerCase();
      if (!command) return;

      // Add command to output
      const cmdLine = document.createElement("p");
      cmdLine.innerHTML = `<span class="prompt">$</span> <span class="command">${escapeHtml(command)}</span>`;
      terminalOutput.appendChild(cmdLine);

      // Process command
      let response = terminalCommands[command];

      // Handle dynamic commands
      if (typeof response === "function") {
        response = response();
      }

      // Handle special commands
      if (command === "clear") {
        terminalOutput.innerHTML = "";
      } else if (command === "skills") {
        document
          .querySelector("#skills")
          .scrollIntoView({ behavior: "smooth" });
        addOutput("Scrolling to Skills section...", "success");
      } else if (command === "projects") {
        document
          .querySelector("#projects")
          .scrollIntoView({ behavior: "smooth" });
        addOutput("Scrolling to Projects section...", "success");
      } else if (command === "github") {
        window.open("https://github.com/tasticp", "_blank");
        addOutput("Opened GitHub in new tab!", "success");
      } else if (response) {
        // Check if it's an easter egg
        const isEasterEgg = [
          "sudo rm",
          "sudo make",
          "secret",
          "nice_try",
          "rickroll",
          "coffee",
          "42",
          "matrix",
          "konami",
        ].some((egg) => command.includes(egg));
        addOutput(response, isEasterEgg ? "easter-egg" : "output");
      } else if (command.startsWith("cat ")) {
        addOutput(
          `cat: ${command.slice(4)}: No such file or directory`,
          "error",
        );
      } else if (command.startsWith("sudo ")) {
        addOutput(`🔒 Permission denied! But nice try, hacker.`, "easter-egg");
      } else {
        addOutput(
          `Command not found: ${command}. Type 'help' for available commands.`,
          "error",
        );
      }

      // Clear input and scroll
      terminalInput.value = "";
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  });

  // Focus terminal when clicking on it
  document.getElementById("aboutTerminal")?.addEventListener("click", () => {
    terminalInput.focus();
  });
}

function addOutput(text, className = "output") {
  const output = document.createElement("p");
  output.className = className;
  output.style.whiteSpace = "pre-wrap";
  output.textContent = text;
  terminalOutput.appendChild(output);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ===== CISCO CLI SIMULATOR =====
const cliModal = document.getElementById("cliModal");
const cliOverlay = document.getElementById("cliOverlay");
const cliClose = document.getElementById("cliClose");
const cliInput = document.getElementById("cliInput");
const cliOutput = document.getElementById("cliOutput");
const cliPrompt = document.getElementById("cliPrompt");
const cliTitle = document.getElementById("cliTitle");
const cliPresets = document.querySelectorAll(".cli-preset");
const networkDevices = document.querySelectorAll(".network-device.clickable");

// Device configurations
const deviceConfigs = {
  router: {
    name: "Router1",
    hostname: "Router",
    mode: "user", // user, privileged, config
    prompts: { user: ">", privileged: "#", config: "(config)#" },
    interfaces: [
      {
        name: "GigabitEthernet0/0",
        ip: "192.168.1.1",
        mask: "255.255.255.0",
        status: "up",
      },
      {
        name: "GigabitEthernet0/1",
        ip: "10.0.0.1",
        mask: "255.255.255.0",
        status: "up",
      },
      {
        name: "Serial0/0/0",
        ip: "172.16.0.1",
        mask: "255.255.255.252",
        status: "down",
      },
    ],
    routes: [
      {
        network: "0.0.0.0",
        mask: "0.0.0.0",
        gateway: "10.0.0.254",
        interface: "Gi0/1",
      },
      {
        network: "192.168.2.0",
        mask: "255.255.255.0",
        gateway: "172.16.0.2",
        interface: "S0/0/0",
      },
    ],
  },
  switch: {
    name: "Switch1",
    hostname: "Switch",
    mode: "user",
    prompts: { user: ">", privileged: "#", config: "(config)#" },
    vlans: [
      { id: 1, name: "default", ports: "Fa0/1-24" },
      { id: 10, name: "SALES", ports: "Fa0/1-8" },
      { id: 20, name: "IT", ports: "Fa0/9-16" },
      { id: 30, name: "MGMT", ports: "Fa0/17-24" },
    ],
    interfaces: [
      { name: "Vlan1", ip: "192.168.1.2", mask: "255.255.255.0", status: "up" },
    ],
  },
  pc: {
    name: "PC",
    hostname: "PC",
    mode: "user",
    prompts: { user: ">" },
    ip: "192.168.1.10",
    mask: "255.255.255.0",
    gateway: "192.168.1.1",
  },
  server: {
    name: "Server1",
    hostname: "Server",
    mode: "user",
    prompts: { user: ">" },
    ip: "192.168.1.100",
    mask: "255.255.255.0",
    gateway: "192.168.1.1",
    services: ["HTTP", "HTTPS", "DNS", "DHCP"],
  },
};

let currentDevice = null;
let commandHistory = [];
let historyIndex = -1;

// CLI Commands handler
const cliCommands = {
  help: () => `Available commands:
  enable              Enter privileged mode
  configure terminal  Enter configuration mode
  show running-config Show current configuration
  show ip interface brief  Show interface status
  show vlan brief     Show VLAN information (switch)
  show ip route       Show routing table (router)
  ping [ip]           Ping an IP address
  ipconfig            Show IP configuration (PC/Server)
  exit                Exit current mode
  ?                   Show available commands`,
  "?": () => cliCommands["help"](),
  enable: () => {
    if (currentDevice.mode === "user") {
      currentDevice.mode = "privileged";
      updatePrompt();
      return "";
    }
    return "% Already in privileged mode";
  },
  disable: () => {
    if (currentDevice.mode !== "user") {
      currentDevice.mode = "user";
      updatePrompt();
      return "";
    }
    return "";
  },
  "configure terminal": () => {
    if (currentDevice.mode === "privileged") {
      currentDevice.mode = "config";
      updatePrompt();
      return "Enter configuration commands, one per line. End with exit.";
    }
    return "% Must be in privileged mode";
  },
  "conf t": () => cliCommands["configure terminal"](),
  exit: () => {
    if (currentDevice.mode === "config") {
      currentDevice.mode = "privileged";
      updatePrompt();
    } else if (currentDevice.mode === "privileged") {
      currentDevice.mode = "user";
      updatePrompt();
    }
    return "";
  },
  "show running-config": () => {
    if (!["privileged", "config"].includes(currentDevice.mode)) {
      return "% Incomplete command";
    }
    let config = `Building configuration...\n\nCurrent configuration : 1024 bytes\n!\nhostname ${currentDevice.hostname}\n!\n`;
    if (currentDevice.interfaces) {
      currentDevice.interfaces.forEach((int) => {
        config += `interface ${int.name}\n ip address ${int.ip} ${int.mask}\n no shutdown\n!\n`;
      });
    }
    if (currentDevice.vlans) {
      currentDevice.vlans.forEach((vlan) => {
        config += `vlan ${vlan.id}\n name ${vlan.name}\n!\n`;
      });
    }
    config += "!\nend";
    return config;
  },
  "show run": () => cliCommands["show running-config"](),
  "show ip interface brief": () => {
    if (!currentDevice.interfaces) return "% No interfaces configured";
    let output =
      "Interface              IP-Address      OK? Method Status                Protocol\n";
    currentDevice.interfaces.forEach((int) => {
      output += `${int.name.padEnd(22)} ${int.ip.padEnd(15)} YES manual ${int.status.padEnd(21)} ${int.status}\n`;
    });
    return output;
  },
  "show ip int brief": () => cliCommands["show ip interface brief"](),
  "show vlan brief": () => {
    if (!currentDevice.vlans)
      return "% VLAN configuration not available on this device";
    let output =
      "VLAN Name                             Status    Ports\n---- -------------------------------- --------- -------------------------------\n";
    currentDevice.vlans.forEach((vlan) => {
      output += `${String(vlan.id).padEnd(4)} ${vlan.name.padEnd(32)} active    ${vlan.ports}\n`;
    });
    return output;
  },
  "show ip route": () => {
    if (!currentDevice.routes)
      return "% Routing configuration not available on this device";
    let output =
      "Codes: C - connected, S - static, R - RIP\n\nGateway of last resort is 10.0.0.254 to network 0.0.0.0\n\n";
    currentDevice.routes.forEach((route) => {
      output += `S    ${route.network}/${route.mask} [1/0] via ${route.gateway}\n`;
    });
    if (currentDevice.interfaces) {
      currentDevice.interfaces.forEach((int) => {
        if (int.status === "up") {
          output += `C    ${int.ip.split(".").slice(0, 3).join(".")}.0/24 is directly connected, ${int.name}\n`;
        }
      });
    }
    return output;
  },
  ipconfig: () => {
    if (!currentDevice.ip) return "% Command not available on this device";
    return `IP Configuration:
  IP Address........: ${currentDevice.ip}
  Subnet Mask.......: ${currentDevice.mask}
  Default Gateway...: ${currentDevice.gateway}`;
  },
  "ipconfig /all": () => {
    if (!currentDevice.ip) return "% Command not available on this device";
    let output = `${currentDevice.hostname} IP Configuration:
  Host Name.........: ${currentDevice.hostname}

Ethernet adapter Ethernet0:
  Physical Address..: AA-BB-CC-DD-EE-FF
  DHCP Enabled......: No
  IP Address........: ${currentDevice.ip}
  Subnet Mask.......: ${currentDevice.mask}
  Default Gateway...: ${currentDevice.gateway}
  DNS Servers.......: 192.168.1.1`;
    if (currentDevice.services) {
      output += `\n\nActive Services: ${currentDevice.services.join(", ")}`;
    }
    return output;
  },
};

// Open CLI modal
networkDevices.forEach((device) => {
  device.addEventListener("click", () => {
    const deviceType = device.dataset.device;
    const deviceName = device.dataset.name;

    currentDevice = { ...deviceConfigs[deviceType] };
    currentDevice.name = deviceName;
    currentDevice.mode = "user";

    cliTitle.textContent = `${deviceName} - CLI`;
    cliOutput.innerHTML = `<p class="cli-welcome">Cisco IOS Software Simulator</p>
<p class="cli-welcome">${deviceName} - ${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)}</p>
<p class="cli-welcome">Type 'help' or '?' for available commands</p>
<p class="cli-welcome">-----------------------------------------</p>`;

    updatePrompt();
    cliModal.classList.add("active");
    setTimeout(() => cliInput.focus(), 100);
  });
});

// Close CLI modal
cliClose?.addEventListener("click", closeCliModal);
cliOverlay?.addEventListener("click", closeCliModal);

function closeCliModal() {
  cliModal.classList.remove("active");
  currentDevice = null;
}

// Handle CLI input
cliInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const command = cliInput.value.trim().toLowerCase();
    if (!command) return;

    // Add to history
    commandHistory.push(command);
    historyIndex = commandHistory.length;

    // Show command
    const cmdLine = document.createElement("p");
    cmdLine.innerHTML = `<span class="cli-command">${cliPrompt.textContent}${escapeHtml(cliInput.value)}</span>`;
    cliOutput.appendChild(cmdLine);

    // Process command
    let response = "";

    // Check for exact match first
    if (cliCommands[command]) {
      response =
        typeof cliCommands[command] === "function"
          ? cliCommands[command]()
          : cliCommands[command];
    }
    // Check for ping command
    else if (command.startsWith("ping ")) {
      const ip = command.slice(5);
      response = `Pinging ${ip} with 32 bytes of data:\nReply from ${ip}: bytes=32 time<1ms TTL=128\nReply from ${ip}: bytes=32 time<1ms TTL=128\nReply from ${ip}: bytes=32 time<1ms TTL=128\n\nPing statistics for ${ip}:\n    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss)`;
    }
    // Check partial matches
    else {
      const partialMatches = Object.keys(cliCommands).filter((cmd) =>
        cmd.startsWith(command),
      );
      if (partialMatches.length === 1) {
        response =
          typeof cliCommands[partialMatches[0]] === "function"
            ? cliCommands[partialMatches[0]]()
            : cliCommands[partialMatches[0]];
      } else if (partialMatches.length > 1) {
        response = "% Ambiguous command: " + partialMatches.join(", ");
      } else {
        response = `% Invalid input detected at '^' marker.\n\n${command}\n^`;
      }
    }

    if (response) {
      const outputLine = document.createElement("p");
      outputLine.className = "cli-output";
      outputLine.textContent = response;
      cliOutput.appendChild(outputLine);
    }

    cliInput.value = "";
    cliOutput.scrollTop = cliOutput.scrollHeight;
  }
  // Command history navigation
  else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      cliInput.value = commandHistory[historyIndex];
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      cliInput.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      cliInput.value = "";
    }
  }
});

// Preset buttons
cliPresets.forEach((btn) => {
  btn.addEventListener("click", () => {
    cliInput.value = btn.dataset.cmd;
    cliInput.focus();
  });
});

function updatePrompt() {
  if (!currentDevice) return;
  const modeSymbol = currentDevice.prompts[currentDevice.mode] || ">";
  cliPrompt.textContent = currentDevice.hostname + modeSymbol;
}

// Close modal on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && cliModal?.classList.contains("active")) {
    closeCliModal();
  }
});

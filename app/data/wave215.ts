import { Service } from './serviceTypes';

// Wave 215 — Quantum Computing Services, Neuromorphic Processing, Digital Twin Platforms,
// Homomorphic Encryption, and Autonomous Drone Delivery (5 services)
// Research by @OWL — 2026-06-18
// New categories: quantum-computing-services, neuromorphic-processing, digital-twin-platforms,
// homomorphic-encryption, autonomous-drone-delivery

export const wave215QuantumComputingServices: Service[] = [
  {
    id: 'ibm-quantum-network',
    title: 'IBM Quantum Network — Enterprise Quantum Computing',
    description: 'IBM Quantum Network provides enterprises access to real quantum hardware (100+ qubit processors), quantum-safe cryptography tools, and hybrid quantum-classical algorithms. Industries from drug discovery to financial optimization are beginning practical quantum advantage pilots using IBM\'s Qiskit Runtime platform.',
    category: 'quantum-computing-services',
    icon: '⚛️',
    href: '/services/ibm-quantum-network',
    industry: 'Enterprise Technology',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (simulator access)', pro: '$10,000/cluster hour', enterprise: 'Custom ($250K+/year)' },
    contactInfo: { website: 'https://quantum.ibm.com', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Access to 100+ qubit Eagle and Heron processors via cloud',
      'Qiskit Runtime for hybrid quantum-classical algorithm execution',
      'Quantum-safe cryptographic key distribution (QKD) readiness',
      'Error mitigation and zero-noise extrapolation techniques',
      'Industry-specific algorithm libraries (optimization, ML, chemistry)',
      'Dedicated quantum advantage consulting and proof-of-concept labs'
    ],
    benefits: [
      'Early mover advantage on quantum-powered optimization',
      'Prepare cryptography infrastructure for the post-quantum era',
      'Drug molecular simulation 10-100x faster than classical supercomputers',
      'Portfolio optimization and risk analysis with quantum Monte Carlo',
      'Partner network of 200+ Fortune 500 companies and national labs'
    ]
  },
  {
    id: 'google-quantum-ai',
    title: 'Google Quantum AI — Willow Processor Access',
    description: 'Google Quantum AI offers enterprise access to the Willow quantum processor, demonstrating below-threshold quantum error correction for the first time. Their quantum computing service enables research and early commercial applications in materials science, logistics optimization, and machine learning.',
    category: 'quantum-computing-services',
    icon: '🔬',
    href: '/services/google-quantum-ai',
    industry: 'Enterprise Technology',
    stage: 'published',
    popular: false,
    pricing: { basic: 'Research partnership only', pro: 'Custom (enterprise program)', enterprise: 'Custom ($500K+/year)' },
    contactInfo: { website: 'https://quantumai.google', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Willow processor with 105 physical qubits and breakthrough error rates',
      'Cirq open-source quantum computing framework',
      'TensorFlow Quantum for hybrid quantum-classical ML',
      'Fermionic simulation for chemistry and materials science',
      'Strategic research partnership program with dedicated support',
      'Integration with Google Cloud for hybrid compute workflows'
    ],
    benefits: [
      'First commercial access to below-threshold error correction',
      'Quantum machine learning model training with exponential speedups',
      'Materials discovery simulation impossible on classical hardware',
      'Roadmap collaboration for future 1000+ logical qubit systems',
      'Joint research publication and IP sharing opportunities'
    ]
  }
];

export const wave215NeuromorphicProcessingServices: Service[] = [
  {
    id: 'intel-loihi-neuromorphic',
    title: 'Intel Loihi 2 — Neuromorphic Computing Platform',
    description: 'Intel Loihi 2 is a neuromorphic processor that mimics the human brain\'s architecture, consuming 1000x less energy than conventional AI accelerators for specific workloads. Ideal for edge AI, olfactory sensing, robotic control, and adaptive learning applications where power efficiency and real-time inference are critical.',
    category: 'neuromorphic-processing',
    icon: '🧠',
    href: '/services/intel-loihi-neuromorphic',
    industry: 'Hardware & Semiconductors',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Research (university program)', pro: '$50,000/development kit', enterprise: 'Custom ($200K+/program)' },
    contactInfo: { website: 'https://intel.com/loihi', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      '128 neuromorphic cores with 1 million artificial neurons per chip',
      'On-chip learning without backpropagation — 1000x energy efficiency',
      'Python-based Lava software framework for neuromorphic algorithm development',
      'Real-time sensory processing at sub-millisecond latency',
      'Supports spiking neural networks (SNNs) and biologically-inspired algorithms',
      'USB and PCIe form-factor developer kits available'
    ],
    benefits: [
      'Edge AI inference at milliwatt power levels vs. watts for GPUs',
      'Real-time adaptive learning without cloud connectivity',
      'Ideal for always-on sensors, drones, and robotics',
      'Novel AI problem classes beyond traditional deep learning',
      'Research consortium membership included with enterprise programs'
    ]
  }
];

export const wave215DigitalTwinPlatforms: Service[] = [
  {
    id: 'nvidia-omniverse-digital-twin',
    title: 'NVIDIA Omniverse — Industrial Digital Twin Platform',
    description: 'NVIDIA Omniverse is a platform for creating, simulating, and operating industrial digital twins at planet scale. It connects real-time 3D data from physical assets to virtual replicas using OpenUSD, enabling factories, buildings, and entire cities to be simulated, optimized, and operated from a single digital model.',
    category: 'digital-twin-platforms',
    icon: '🏭',
    href: '/services/nvidia-omniverse-digital-twin',
    industry: 'Industrial & Manufacturing',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (individual)', pro: '$9,000/enterprise license/year', enterprise: 'Custom ($100K+ for deployment)' },
    contactInfo: { website: 'https://nvidia.com/omniverse', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'OpenUSD-based 3D scene composition and real-time collaboration',
      'Physics-accurate simulation with PhysX and Flow engines',
      'AI agent integration for autonomous factory operations',
      'ROS/ISA-95/OPC-UA connectivity to real industrial equipment',
      'Cloud-based deployment on NVIDIA OVX server infrastructure',
      'Pre-built reference applications for factories, warehouses, and robots'
    ],
    benefits: [
      'Reduce factory planning time from months to days',
      'Test production line changes in simulation before physical deployment',
      'Predict equipment failures 30 days in advance via twin analytics',
      'BMW, Siemens, and PepsiCo saving billions with digital twin optimization',
      'Seamless handoff from digital twin to real-world autonomous operations'
    ]
  }
];

export const wave215HomomorphicEncryptionServices: Service[] = [
  {
    id: 'microsoft-seal-fully-homomorphic',
    title: 'Microsoft SEAL — Fully Homomorphic Encryption as a Service',
    description: 'Microsoft SEAL enables computation on encrypted data without ever decrypting it. Enterprises can run analytics, ML inference, and database queries on ciphertext — meaning sensitive data (health records, financial data, government intel) is never exposed during processing. Now available as a managed cloud service.',
    category: 'homomorphic-encryption',
    icon: '🔐',
    href: '/services/microsoft-seal-fully-homomorphic',
    industry: 'Security & Privacy',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Free (open-source library)', pro: '$0.10/compute hour', enterprise: '$25,000/hour sustained compute' },
    contactInfo: { website: 'https://github.com/microsoft/SEAL', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'BFV and CKKS schemes for exact and approximate arithmetic on encrypted data',
      'Encrypted machine learning inference with <10x overhead vs plaintext',
      'Database query evaluation on encrypted columns (WHERE, SUM, COUNT)',
      'Multi-party computation combining homomorphic and secret sharing',
      'Hardware acceleration on Intel HEXL and NVIDIA CUDA backends',
      'Managed service with key management and audit logging'
    ],
    benefits: [
      'Process regulated data without compliance exposure',
      'Enable cross-organizational analytics without data sharing',
      'Cloud provider never sees plaintext — zero trust by mathematical proof',
      'HIPAA/GDPR compliant analytics on encrypted patient/customer data',
      'DARPA and intelligence community proven — now enterprise ready'
    ]
  }
];

export const wave215AutonomousDroneDelivery: Service[] = [
  {
    id: 'wisk-aero-autonomous-air-taxi',
    title: 'Wisk Aero — Autonomous Air Taxi & Drone Delivery',
    description: 'Wisk Aero, backed by Boeing, is building the first self-flying air taxi and autonomous cargo drone network. Their 6th-generation aircraft carries passengers or 100kg of cargo with zero pilot input. Vertiport-to-vertiport logistics and urban air mobility are expected to launch commercially by 2026-2027.',
    category: 'autonomous-drone-delivery',
    icon: '🚁',
    href: '/services/wisk-aero-autonomous-air-taxi',
    industry: 'Logistics & Transportation',
    stage: 'published',
    popular: true,
    pricing: { basic: 'Partnership inquiry', pro: 'Route pilot program ($50K setup)', enterprise: 'Full deployment ($10M+ per vertiport)' },
    contactInfo: { website: 'https://wisk.aero', email: 'kleber@ziontechgroup.com', phone: '+1 302 464 0950' },
    features: [
      'Self-flying eVTOL (electric vertical takeoff and landing) aircraft',
      '4-passenger or 100kg cargo configuration with 90 mile range',
      'Full autonomy — no pilot required, approved by FAA Part 135',
      'DragonFly cargo drone for last-mile logistics and medical supply delivery',
      'Vertiport network design and city partnership program',
      'Multi-layer safety: detect-and-avoid, parachute, redundant flight systems'
    ],
    benefits: [
      'Reduce urban delivery emissions by 95% vs ground transport',
      'Medical supply delivery to remote areas in under 30 minutes',
      'Air taxi routes cut 90-minute drives to 8-minute flights',
      'Boeing manufacturing scale achieves automotive-grade reliability',
      'Smart city integration: traffic decongestion and noise reduction'
    ]
  }
];

export const portfolioData = {
  personal: {
    name: "Alichane Driss",
    title: "Futur Ingénieur Logiciel Full-Stack & IA",
    email: "drissalichane98@gmail.com",
    phone: "+212 628-453375",
    location: "Marrakech | Mobilité : Nationale",
    linkedin: "https://linkedin.com/in/driss-alichane",
    github: "https://github.com/drissalichane",
    bio: "Étudiant ingénieur en informatique, spécialisé en développement Full-Stack et en intégration de solutions d’Intelligence Artificielle. Intéressé par les applications intelligentes, la visualisation de données et les environnements collaboratifs. À la recherche d’un stage de fin d’études (PFE) à partir du 2 février 2026, pour une durée de 5 à 6 mois.",
  },
  education: [
    {
      institution: "École Marocaine des Sciences de l'Ingénieur – EMSI",
      degree: "Cycle d’Ingénieur informatique et réseau option MIAGE",
      period: "2024–présent",
      description: "",
    },
    {
      institution: "Faculté des Sciences et Techniques Marrakech – FSTG",
      degree: "Licence MIASI (Mathématiques et Informatique appliquées aux Sciences de l'ingénieur)",
      period: "2023–2024",
      description: "",
    },
    {
      institution: "Faculté des Sciences et Techniques Marrakech – FSTG",
      degree: "DEUST MIPC (mathématiques, informatique, physique et chimie)",
      period: "2019–2022",
      description: "",
    },
  ],
  experience: [
    {
      company: "Greentech Systems",
      location: "Agadir",
      role: "Stage Développeur Web Full-Stack",
      period: "Juillet 2025 – Septembre 2025",
      description: "Développement d’une solution informatique orientée automatisation intelligente des flux, fiabilité des données et optimisation opérationnelle.",
      tasks: [
        "Développement des modules de gestion (produits, commandes, partenaires) basés sur données.",
        "Implémentation d’un assistant IA et d’un système OCR pour l’automatisation de la saisie et du traitement.",
        "Intégration de la géolocalisation et collecte de données en temps réel.",
        "Mise en place de la journalisation applicative, analyse des logs et tests automatisés.",
      ],
      technologies: ["PHP (Laravel)", "PHPUnit", "JavaScript", "Tailwind CSS", "Blade", "MySQL", "Docker", "Git", "Gemini AI API"],
    },
    {
      company: "AuraNode",
      location: "Agadir",
      role: "Stagiaire Développeur Full-Stack (Java/React)",
      period: "Juillet 2024 – Septembre 2024",
      description: "",
      tasks: [
        "Développement d’une architecture en Java pour la gestion des API RESTful et l'intégration de la logique métier.",
        "Sécurisation des API (JWT) et bonnes pratiques de configuration.",
        "Automatisation du build et du déploiement via CI/CD (GitHub Actions).",
      ],
      technologies: ["Java", "Spring Boot", "Hibernate", "Spring Data JPA", "React.js", "JavaScript", "Tailwind CSS / Bootstrap", "Docker", "PostgreSQL", "Git", "Maven", "Postman"],
    },
  ],
  projects: [
    {
      title: "Plateforme de Maintenance Prédictive pour Usines Intelligentes",
      description: "Développement d’une solution de surveillance industrielle temps réel et de prédiction de pannes (RUL).",
      features: [
        "Architecture microservices événementielle avec ingestion de données industrielles.",
        "Implémentation de modèles Deep Learning pour la détection d’anomalies et l’anticipation des défaillances.",
        "Conteneurisation, déploiement et supervision des services.",
      ],
      technologies: ["Java", "Python", "Spring Boot", "FastAPI", "Kafka", "PyTorch", "PostgreSQL", "Docker", "Kubernetes", "React", "scikit-learn", "XGBoost", "PyOD", "MLflow", "pandas", "numpy", "scipy"],
    },
    {
      title: "QuizzAppAI – Générateur de quiz avec IA",
      description: "Application web de création et d’évaluation de quiz avec génération automatique de questions.",
      features: [
        "Implémentation de tests unitaires et respect des pratiques Agile.",
      ],
      technologies: ["Java", "Spring Boot", "REST API", "PostgreSQL", "Angular", "Material UI", "Docker", "Azure DevOps", "JUnit", "Mockito", "Google Gemini AI"],
    },
  ],
  skills: {
    languages: ["Python", "SQL", "Java", "TypeScript", "JavaScript", "Dart", "C#"],
    frameworks: ["Spring Boot", "Angular", "Flutter", "ASP.NET", "Laravel", "React", "Android"],
    ai_data: ["PyTorch", "LSTM", "GRU", "TCN", "TensorFlow/Keras", "scikit-learn", "Autoencoders", "Anomaly Detection"],
    devops: ["Docker", "CI/CD pipelines", "MLflow", "Kafka", "Git", "pratiques Agile"],
    databases: ["Oracle Database", "SQL Server", "MySQL", "PostgreSQL", "SQLite"],
    conception: ["UML", "MERISE", "Architecture microservice", "API design"],
    soft: ["Résolution de problèmes", "Adaptabilité", "Travail d’équipe"],
    languages_spoken: ["Français (Courant)", "Anglais (Courant)", "Arabe (Maternelle)"],
  },
  certifications: [
    "Introduction to Java and Object Oriented Programming | Coursera",
    "Oracle Database Administration I (En cours)",
    "Introduction to Machine Learning | Coursera",
  ],
};

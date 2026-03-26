// Données fictives pour la plateforme SaaS de formation B2B Talentium

export type DISCProfile = 'D' | 'I' | 'S' | 'C';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'hr' | 'manager' | 'trainer';
  organizationId?: string;
  avatar?: string;
}

export interface Manager extends User {
  role: 'manager';
  teamSize: number;
  industry: string;
  seniority: string;
  discProfile: DISCProfile;
  teamDISCProfiles: DISCProfile[];
  enrolledCourses: string[];
  completedModules: string[];
  badges: string[];
}

export interface Module {
  id: string;
  title: string;
  duration: number; // en minutes
  type: 'video' | 'text' | 'quiz';
  content?: string;
  videoUrl?: string;
  completed?: boolean;
}

export interface Quiz {
  id: string;
  moduleId: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  trainer: string;
  trainerId: string;
  duration: number; // durée totale en heures
  price: number;
  enrolledCount: number;
  rating: number;
  category: string;
  discRecommendations: DISCProfile[];
  modules: Module[];
  thumbnail?: string;
}

export interface Organization {
  id: string;
  name: string;
  licenseCount: number;
  usedLicenses: number;
  subscriptionType: 'pay-per-seat' | 'subscription';
  managers: string[];
}

export const mockUser: User = {
  id: '1',
  name: 'Utilisateur Démo',
  email: 'demo@exemple.com',
  role: 'manager',
};

export const mockCourses: Course[] = [
  {
    id: 'c1',
    title: 'Intelligence Émotionnelle pour Managers',
    description: 'Maîtrisez l\'art de comprendre et gérer les émotions au travail. Apprenez à bâtir des relations solides et diriger avec empathie.',
    trainer: 'Dr. Sarah Mitchell',
    trainerId: 't1',
    duration: 8,
    price: 299,
    enrolledCount: 1243,
    rating: 4.8,
    category: 'Leadership',
    discRecommendations: ['I', 'S'],
    modules: [
      { id: 'm1', title: 'Introduction à l\'Intelligence Émotionnelle', duration: 45, type: 'video', videoUrl: 'https://example.com/video1' },
      { id: 'm2', title: 'Conscience de Soi et Auto-Régulation', duration: 60, type: 'video', videoUrl: 'https://example.com/video2' },
      { id: 'm3', title: 'Quiz Module 1', duration: 15, type: 'quiz' },
      { id: 'm4', title: 'L\'Empathie en Leadership', duration: 55, type: 'video', videoUrl: 'https://example.com/video3' },
      { id: 'm5', title: 'Compétences Sociales et Gestion des Relations', duration: 50, type: 'text' },
      { id: 'm6', title: 'Évaluation Finale', duration: 20, type: 'quiz' },
    ],
  },
  {
    id: 'c2',
    title: 'Donner des Retours Efficaces',
    description: 'Apprenez les cadres et techniques pour délivrer des retours constructifs qui motivent et développent vos équipes.',
    trainer: 'Marcus Johnson',
    trainerId: 't2',
    duration: 6,
    price: 249,
    enrolledCount: 892,
    rating: 4.6,
    category: 'Communication',
    discRecommendations: ['D', 'C'],
    modules: [
      { id: 'm7', title: 'Le Cadre du Feedback', duration: 40, type: 'video' },
      { id: 'm8', title: 'Feedback Positif vs Constructif', duration: 45, type: 'video' },
      { id: 'm9', title: 'Quiz du Module', duration: 10, type: 'quiz' },
      { id: 'm10', title: 'Gérer les Conversations Difficiles', duration: 50, type: 'video' },
      { id: 'm11', title: 'Évaluation Finale', duration: 15, type: 'quiz' },
    ],
  },
  {
    id: 'c3',
    title: 'Gérer des Équipes Haute Performance',
    description: 'Construisez et dirigez des équipes qui dépassent constamment les attentes. Focus sur la motivation, la délégation et la gestion de la performance.',
    trainer: 'Dr. Sarah Mitchell',
    trainerId: 't1',
    duration: 10,
    price: 349,
    enrolledCount: 1567,
    rating: 4.9,
    category: 'Gestion d\'Équipe',
    discRecommendations: ['D', 'I'],
    modules: [
      { id: 'm12', title: 'Construire Votre Équipe de Rêve', duration: 55, type: 'video' },
      { id: 'm13', title: 'Stratégies de Délégation', duration: 45, type: 'video' },
      { id: 'm14', title: 'Quiz 1', duration: 10, type: 'quiz' },
      { id: 'm15', title: 'Métriques de Performance et KPIs', duration: 60, type: 'video' },
      { id: 'm16', title: 'Motivation et Engagement', duration: 50, type: 'text' },
      { id: 'm17', title: 'Évaluation Finale', duration: 20, type: 'quiz' },
    ],
  },
  {
    id: 'c4',
    title: 'Maîtrise de la Résolution de Conflits',
    description: 'Naviguez les conflits au travail avec confiance. Apprenez les techniques de médiation et créez une culture de désaccord constructif.',
    trainer: 'Jennifer Lee',
    trainerId: 't3',
    duration: 7,
    price: 279,
    enrolledCount: 734,
    rating: 4.7,
    category: 'Gestion des Conflits',
    discRecommendations: ['S', 'C'],
    modules: [
      { id: 'm18', title: 'Comprendre le Conflit', duration: 40, type: 'video' },
      { id: 'm19', title: 'Communication dans le Conflit', duration: 50, type: 'video' },
      { id: 'm20', title: 'Quiz du Module', duration: 10, type: 'quiz' },
      { id: 'm21', title: 'Techniques de Médiation', duration: 55, type: 'video' },
      { id: 'm22', title: 'Évaluation Finale', duration: 15, type: 'quiz' },
    ],
  },
  {
    id: 'c5',
    title: 'Prise de Décision Stratégique',
    description: 'Améliorez vos capacités de prise de décision en utilisant des données, des cadres et des méthodologies de pensée critique.',
    trainer: 'Marcus Johnson',
    trainerId: 't2',
    duration: 9,
    price: 329,
    enrolledCount: 1021,
    rating: 4.8,
    category: 'Stratégie',
    discRecommendations: ['D', 'C'],
    modules: [
      { id: 'm23', title: 'Cadres de Prise de Décision', duration: 50, type: 'video' },
      { id: 'm24', title: 'Décisions Basées sur les Données', duration: 55, type: 'video' },
      { id: 'm25', title: 'Quiz 1', duration: 15, type: 'quiz' },
      { id: 'm26', title: 'Évaluation des Risques', duration: 60, type: 'video' },
      { id: 'm27', title: 'Évaluation Finale', duration: 20, type: 'quiz' },
    ],
  },
  {
    id: 'c6',
    title: 'Construire la Sécurité Psychologique',
    description: 'Créez un environnement où les membres de l\'équipe se sentent en sécurité pour prendre des risques, partager des idées et être eux-mêmes.',
    trainer: 'Jennifer Lee',
    trainerId: 't3',
    duration: 5,
    price: 229,
    enrolledCount: 645,
    rating: 4.9,
    category: 'Culture d\'Équipe',
    discRecommendations: ['I', 'S'],
    modules: [
      { id: 'm28', title: 'Qu\'est-ce que la Sécurité Psychologique ?', duration: 35, type: 'video' },
      { id: 'm29', title: 'Créer des Espaces Sûrs', duration: 45, type: 'video' },
      { id: 'm30', title: 'Quiz du Module', duration: 10, type: 'quiz' },
      { id: 'm31', title: 'Mesurer la Sécurité de l\'Équipe', duration: 40, type: 'text' },
      { id: 'm32', title: 'Évaluation Finale', duration: 15, type: 'quiz' },
    ],
  },
];

export const mockManagers: Manager[] = [
  {
    id: 'm1',
    name: 'Alice Thompson',
    email: 'alice@entreprise.com',
    role: 'manager',
    organizationId: 'org1',
    teamSize: 8,
    industry: 'Technologie',
    seniority: 'Manager Senior',
    discProfile: 'D',
    teamDISCProfiles: ['D', 'I', 'S', 'C', 'I', 'D', 'S', 'I'],
    enrolledCourses: ['c1', 'c2', 'c3'],
    completedModules: ['m1', 'm2', 'm3', 'm7', 'm8'],
    badges: ['early-adopter', 'completion-master'],
  },
  {
    id: 'm2',
    name: 'Robert Chang',
    email: 'robert@entreprise.com',
    role: 'manager',
    organizationId: 'org1',
    teamSize: 5,
    industry: 'Technologie',
    seniority: 'Chef d\'Équipe',
    discProfile: 'I',
    teamDISCProfiles: ['I', 'S', 'I', 'D', 'S'],
    enrolledCourses: ['c1', 'c4'],
    completedModules: ['m1'],
    badges: [],
  },
  {
    id: 'm3',
    name: 'Maria Garcia',
    email: 'maria@entreprise.com',
    role: 'manager',
    organizationId: 'org1',
    teamSize: 12,
    industry: 'Technologie',
    seniority: 'Directrice',
    discProfile: 'S',
    teamDISCProfiles: ['S', 'C', 'I', 'S', 'D', 'I', 'S', 'C', 'S', 'I', 'D', 'C'],
    enrolledCourses: ['c3', 'c6'],
    completedModules: ['m12', 'm13', 'm14', 'm15', 'm16', 'm17', 'm28'],
    badges: ['completion-master', 'team-champion'],
  },
];

export const mockOrganization: Organization = {
  id: 'org1',
  name: 'TechCorp Solutions',
  licenseCount: 50,
  usedLicenses: 3,
  subscriptionType: 'subscription',
  managers: ['m1', 'm2', 'm3'],
};

export const mockTrainerStats = {
  totalRevenue: 24580,
  enrolledManagers: 892,
  activeCourses: 2,
  avgRating: 4.7,
  monthlyGrowth: 12.5,
};

export const discProfileInfo = {
  D: {
    name: 'Dominance',
    description: 'Direct, orienté résultats, décisif',
    color: '#EF4444',
    strengths: ['Prise de décision', 'Résolution de problèmes', 'Prise en charge'],
    challenges: ['Patience', 'Sensibilité', 'Délégation'],
  },
  I: {
    name: 'Influence',
    description: 'Extraverti, enthousiaste, optimiste',
    color: '#F59E0B',
    strengths: ['Communication', 'Enthousiasme', 'Collaboration'],
    challenges: ['Suivi', 'Organisation', 'Attention aux détails'],
  },
  S: {
    name: 'Stabilité',
    description: 'Patient, calme, solidaire',
    color: '#10B981',
    strengths: ['Cohérence', 'Écoute', 'Harmonie d\'équipe'],
    challenges: ['Adaptation au changement', 'Affirmation', 'Urgence'],
  },
  C: {
    name: 'Conscienciosité',
    description: 'Analytique, précis, systématique',
    color: '#3B82F6',
    strengths: ['Précision', 'Planification', 'Focus qualité'],
    challenges: ['Flexibilité', 'Décisions rapides', 'Interaction sociale'],
  },
};

export const mockQuizzes: { [key: string]: Quiz } = {
  m3: {
    id: 'q1',
    moduleId: 'm3',
    questions: [
      {
        id: 'q1_1',
        question: 'Quel est le composant principal de l\'intelligence émotionnelle ?',
        options: ['Conscience de soi', 'Compétences techniques', 'Condition physique', 'Gestion du temps'],
        correctAnswer: 0,
      },
      {
        id: 'q1_2',
        question: 'Lequel de ces éléments est un avantage clé de l\'auto-régulation ?',
        options: ['Augmentation du salaire', 'Meilleur contrôle des émotions', 'Plus de jours de congé', 'Promotions plus rapides'],
        correctAnswer: 1,
      },
      {
        id: 'q1_3',
        question: 'L\'empathie implique :',
        options: ['Ignorer les autres', 'Comprendre les sentiments des autres', 'Éviter les conflits', 'Être strict'],
        correctAnswer: 1,
      },
    ],
  },
  m9: {
    id: 'q2',
    moduleId: 'm9',
    questions: [
      {
        id: 'q2_1',
        question: 'Le meilleur moment pour donner un feedback est :',
        options: ['Jamais', 'Dès que possible après l\'événement', 'Lors de l\'évaluation annuelle', 'Quand on est en colère'],
        correctAnswer: 1,
      },
      {
        id: 'q2_2',
        question: 'Quel cadre est couramment utilisé pour le feedback ?',
        options: ['ABC', 'SCI (Situation-Comportement-Impact)', 'XYZ', 'PDQ'],
        correctAnswer: 1,
      },
    ],
  },
};

export const mockAIRoleplays = [
  {
    id: 'r1',
    title: 'Donner un Feedback à un Membre d\'Équipe Stressé (Profil C)',
    description: 'Votre membre d\'équipe analytique commet des erreurs inhabituelles. Pratiquez à délivrer un feedback constructif avec empathie.',
    difficulty: 'Intermédiaire',
    estimatedTime: 15,
    scenario: 'employee-stressed',
    discProfile: 'C',
  },
  {
    id: 'r2',
    title: 'Motiver un Employé Désengagé (Profil S)',
    description: 'Un membre d\'équipe habituellement stable semble renfermé. Apprenez à le réengager tout en respectant son style de communication.',
    difficulty: 'Avancé',
    estimatedTime: 20,
    scenario: 'employee-disengaged',
    discProfile: 'S',
  },
  {
    id: 'r3',
    title: 'Gérer un Conflit entre Membres d\'Équipe (Profils D & I)',
    description: 'Deux membres d\'équipe avec des styles différents sont en conflit. Pratiquez la médiation et la résolution de conflits.',
    difficulty: 'Avancé',
    estimatedTime: 25,
    scenario: 'team-conflict',
    discProfile: 'D',
  },
  {
    id: 'r4',
    title: 'Déléguer à un Membre d\'Équipe Enthousiaste (Profil I)',
    description: 'Apprenez à déléguer efficacement tout en assurant le suivi avec un type de personnalité influente.',
    difficulty: 'Débutant',
    estimatedTime: 12,
    scenario: 'delegation',
    discProfile: 'I',
  },
];

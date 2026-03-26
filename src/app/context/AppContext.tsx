import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CollaboratorExtended {
  id: string;
  name: string;
  email: string;
  role: 'manager';
  organizationId?: string;
  teamSize: number;
  industry: string;
  seniority: string;
  discProfile: 'D' | 'I' | 'S' | 'C';
  teamDISCProfiles: ('D' | 'I' | 'S' | 'C')[];
  enrolledCourses: string[];
  completedModules: string[];
  badges: string[];
  courseStatuses: { [courseId: string]: 'not-started' | 'in-progress' | 'completed' };
}

export interface CourseExtended {
  id: string;
  title: string;
  description: string;
  trainer: string;
  trainerId: string;
  duration: number;
  price: number;
  enrolledCount: number;
  rating: number;
  category: string;
  discRecommendations: ('D' | 'I' | 'S' | 'C')[];
  modules: any[];
  thumbnail?: string;
  deliveryType?: 'presentiel' | 'distance';
  revenue?: number;
}

export interface TrainingRequest {
  id: string;
  collaboratorId: string;
  collaboratorName: string;
  courseId: string;
  courseTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

interface AppContextType {
  collaborators: CollaboratorExtended[];
  courses: CourseExtended[];
  trainingRequests: TrainingRequest[];
  addCollaborator: (collaborator: Omit<CollaboratorExtended, 'id' | 'courseStatuses'>) => void;
  updateCollaborator: (id: string, updates: Partial<CollaboratorExtended>) => void;
  addCourse: (course: Omit<CourseExtended, 'id' | 'enrolledCount' | 'revenue'>) => void;
  enrollCollaboratorInCourse: (collaboratorId: string, courseId: string, deliveryType: 'presentiel' | 'distance') => void;
  createTrainingRequest: (collaboratorId: string, courseId: string) => void;
  approveTrainingRequest: (requestId: string) => void;
  rejectTrainingRequest: (requestId: string) => void;
  updateCourseProgress: (collaboratorId: string, courseId: string, moduleId: string, completed: boolean) => void;
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [collaborators, setCollaborators] = useState<CollaboratorExtended[]>([]);
  const [courses, setCourses] = useState<CourseExtended[]>([]);
  const [trainingRequests, setTrainingRequests] = useState<TrainingRequest[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Charger les données du localStorage au démarrage
  useEffect(() => {
    const savedCollaborators = localStorage.getItem('talentium_collaborators');
    const savedCourses = localStorage.getItem('talentium_courses');
    const savedRequests = localStorage.getItem('talentium_requests');

    if (savedCollaborators) {
      setCollaborators(JSON.parse(savedCollaborators));
    }
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
    if (savedRequests) {
      setTrainingRequests(JSON.parse(savedRequests));
    }
  }, []);

  // Sauvegarder les collaborateurs dans localStorage
  useEffect(() => {
    if (collaborators.length > 0) {
      localStorage.setItem('talentium_collaborators', JSON.stringify(collaborators));
    }
  }, [collaborators]);

  // Sauvegarder les cours dans localStorage
  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem('talentium_courses', JSON.stringify(courses));
    }
  }, [courses]);

  // Sauvegarder les demandes dans localStorage
  useEffect(() => {
    if (trainingRequests.length > 0) {
      localStorage.setItem('talentium_requests', JSON.stringify(trainingRequests));
    }
  }, [trainingRequests]);

  const addCollaborator = (collaborator: Omit<CollaboratorExtended, 'id' | 'courseStatuses'>) => {
    const newCollaborator: CollaboratorExtended = {
      ...collaborator,
      id: `collab-${Date.now()}`,
      courseStatuses: {},
    };
    setCollaborators([...collaborators, newCollaborator]);
  };

  const updateCollaborator = (id: string, updates: Partial<CollaboratorExtended>) => {
    setCollaborators(collaborators.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const addCourse = (course: Omit<CourseExtended, 'id' | 'enrolledCount' | 'revenue'>) => {
    const newCourse: CourseExtended = {
      ...course,
      id: `course-${Date.now()}`,
      enrolledCount: 0,
      revenue: 0,
    };
    setCourses([...courses, newCourse]);
  };

  const enrollCollaboratorInCourse = (collaboratorId: string, courseId: string, deliveryType: 'presentiel' | 'distance') => {
    setCollaborators(collaborators.map(c => {
      if (c.id === collaboratorId) {
        return {
          ...c,
          enrolledCourses: [...c.enrolledCourses, courseId],
          courseStatuses: {
            ...c.courseStatuses,
            [courseId]: 'not-started' as const,
          },
        };
      }
      return c;
    }));

    setCourses(courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          enrolledCount: course.enrolledCount + 1,
          revenue: (course.revenue || 0) + course.price,
          deliveryType,
        };
      }
      return course;
    }));
  };

  const createTrainingRequest = (collaboratorId: string, courseId: string) => {
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    const course = courses.find(c => c.id === courseId);

    if (collaborator && course) {
      const newRequest: TrainingRequest = {
        id: `req-${Date.now()}`,
        collaboratorId,
        collaboratorName: collaborator.name,
        courseId,
        courseTitle: course.title,
        status: 'pending',
        requestDate: new Date().toISOString(),
      };
      setTrainingRequests([...trainingRequests, newRequest]);
    }
  };

  const approveTrainingRequest = (requestId: string) => {
    const request = trainingRequests.find(r => r.id === requestId);
    if (request) {
      enrollCollaboratorInCourse(request.collaboratorId, request.courseId, 'distance');
      setTrainingRequests(trainingRequests.map(r =>
        r.id === requestId ? { ...r, status: 'approved' as const } : r
      ));
    }
  };

  const rejectTrainingRequest = (requestId: string) => {
    setTrainingRequests(trainingRequests.map(r =>
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    ));
  };

  const updateCourseProgress = (collaboratorId: string, courseId: string, moduleId: string, completed: boolean) => {
    setCollaborators(collaborators.map(c => {
      if (c.id === collaboratorId) {
        const completedModules = completed
          ? [...c.completedModules, moduleId]
          : c.completedModules.filter(m => m !== moduleId);

        // Vérifier si le cours est complété
        const course = courses.find(co => co.id === courseId);
        const allModulesCompleted = course?.modules.every(m => completedModules.includes(m.id)) || false;

        return {
          ...c,
          completedModules,
          courseStatuses: {
            ...c.courseStatuses,
            [courseId]: allModulesCompleted ? 'completed' as const : 'in-progress' as const,
          },
        };
      }
      return c;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        collaborators,
        courses,
        trainingRequests,
        addCollaborator,
        updateCollaborator,
        addCourse,
        enrollCollaboratorInCourse,
        createTrainingRequest,
        approveTrainingRequest,
        rejectTrainingRequest,
        updateCourseProgress,
        currentUserId,
        setCurrentUserId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

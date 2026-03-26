import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { AppSidebar } from './components/AppSidebar';
import { Toaster, toast } from './components/ui/sonner';

// HR Components
import { HRDashboard } from './components/hr/HRDashboard';
import { ManagerManagement } from './components/hr/ManagerManagement';
import { TrainingCatalog } from './components/hr/TrainingCatalog';
import { AnalyticsReports } from './components/hr/AnalyticsReports';
import { CollaboratorDetail } from './components/hr/CollaboratorDetail';
import { LicensesBilling } from './components/hr/LicensesBilling';

// Manager Components
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { CoursePlayer } from './components/manager/CoursePlayer';
import { AIRoleplayLab } from './components/manager/AIRoleplayLab';
import { CoursesGrid } from './components/manager/CoursesGrid';
import { CollaboratorProgress } from './components/manager/CollaboratorProgress';

// Trainer Components
import { TrainerDashboard } from './components/trainer/TrainerDashboard';
import { CourseUpload } from './components/trainer/CourseUpload';
import { RevenueAnalytics } from './components/trainer/RevenueAnalytics';

// Data
import { mockManagers, mockCourses, mockOrganization } from './data/mockData';

interface Collaborator {
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

interface TrainingRequest {
  id: string;
  collaboratorId: string;
  collaboratorName: string;
  courseId: string;
  courseTitle: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

export default function App() {
  const [userRole, setUserRole] = useState<'hr' | 'manager' | 'trainer' | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // État global de l'application
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [trainingRequests, setTrainingRequests] = useState<TrainingRequest[]>([]);

  // Initialiser les données depuis mockData et localStorage
  useEffect(() => {
    const savedCollaborators = localStorage.getItem('talentium_collaborators');
    const savedCourses = localStorage.getItem('talentium_courses');
    const savedRequests = localStorage.getItem('talentium_requests');

    if (savedCollaborators) {
      setCollaborators(JSON.parse(savedCollaborators));
    } else {
      // Initialiser avec les données mock
      const initialCollaborators = mockManagers.map(m => ({
        ...m,
        courseStatuses: m.enrolledCourses.reduce((acc, courseId) => {
          const course = mockCourses.find(c => c.id === courseId);
          if (course) {
            const completedCount = course.modules.filter(mod => m.completedModules.includes(mod.id)).length;
            const status = completedCount === 0 ? 'not-started' : completedCount === course.modules.length ? 'completed' : 'in-progress';
            acc[courseId] = status as 'not-started' | 'in-progress' | 'completed';
          }
          return acc;
        }, {} as { [key: string]: 'not-started' | 'in-progress' | 'completed' })
      }));
      setCollaborators(initialCollaborators);
      localStorage.setItem('talentium_collaborators', JSON.stringify(initialCollaborators));
    }

    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      const initialCourses = mockCourses.map(c => ({
        ...c,
        revenue: c.price * c.enrolledCount,
        deliveryType: 'distance' as 'distance' | 'presentiel'
      }));
      setCourses(initialCourses);
      localStorage.setItem('talentium_courses', JSON.stringify(initialCourses));
    }

    if (savedRequests) {
      setTrainingRequests(JSON.parse(savedRequests));
    }
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    if (collaborators.length > 0) {
      localStorage.setItem('talentium_collaborators', JSON.stringify(collaborators));
    }
  }, [collaborators]);

  useEffect(() => {
    if (courses.length > 0) {
      localStorage.setItem('talentium_courses', JSON.stringify(courses));
    }
  }, [courses]);

  useEffect(() => {
    if (trainingRequests.length > 0) {
      localStorage.setItem('talentium_requests', JSON.stringify(trainingRequests));
    }
  }, [trainingRequests]);

  const handleLogin = (role: 'hr' | 'manager' | 'trainer') => {
    setUserRole(role);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentView('dashboard');
    setSelectedCollaboratorId(null);
    setSelectedCourseId(null);
  };

  const handleAddCollaborator = (collaborator: any) => {
    const newCollaborator: Collaborator = {
      ...collaborator,
      id: `collab-${Date.now()}`,
      courseStatuses: {},
    };
    setCollaborators([...collaborators, newCollaborator]);
    toast.success('Collaborateur ajouté !', {
      description: `${newCollaborator.name} a été ajouté avec succès.`,
    });
  };

  const handleEnrollInCourse = (collaboratorId: string, courseId: string, deliveryType: 'presentiel' | 'distance') => {
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

    const course = courses.find(c => c.id === courseId);
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    toast.success('Formation achetée !', {
      description: `${collaborator?.name} a été inscrit à "${course?.title}" (${deliveryType}).`,
    });
  };

  const handleAddCourse = (courseData: any) => {
    const newCourse = {
      ...courseData,
      id: `course-${Date.now()}`,
      enrolledCount: 0,
      revenue: 0,
    };
    setCourses([...courses, newCourse]);
    toast.success('Formation publiée ! 🎉', {
      description: `"${newCourse.title}" est maintenant disponible dans le catalogue.`,
    });
  };

  const handleCreateTrainingRequest = (collaboratorId: string, courseId: string) => {
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
      toast.info('Demande envoyée', {
        description: 'Votre RH recevra une notification pour approuver votre demande.',
      });
    }
  };

  const handleApproveRequest = (requestId: string) => {
    const request = trainingRequests.find(r => r.id === requestId);
    if (request) {
      handleEnrollInCourse(request.collaboratorId, request.courseId, 'distance');
      setTrainingRequests(trainingRequests.map(r =>
        r.id === requestId ? { ...r, status: 'approved' as const } : r
      ));
    }
  };

  const handleRejectRequest = (requestId: string) => {
    setTrainingRequests(trainingRequests.map(r =>
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    ));
    toast.error('Demande rejetée', {
      description: 'La demande de formation a été rejetée.',
    });
  };

  const handleUpdateCourseProgress = (collaboratorId: string, courseId: string, moduleId: string, completed: boolean) => {
    setCollaborators(collaborators.map(c => {
      if (c.id === collaboratorId) {
        const completedModules = completed
          ? [...c.completedModules, moduleId]
          : c.completedModules.filter(m => m !== moduleId);

        const course = courses.find(co => co.id === courseId);
        const allModulesCompleted = course?.modules.every((m: any) => completedModules.includes(m.id)) || false;

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

  if (!userRole) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const renderContent = () => {
    // VUE HR
    if (userRole === 'hr') {
      if (selectedCollaboratorId && currentView === 'managers') {
        const collaborator = collaborators.find(c => c.id === selectedCollaboratorId);
        if (collaborator) {
          const collaboratorCourses = courses
            .filter((c: any) => collaborator.enrolledCourses.includes(c.id))
            .map((course: any) => {
              const completedModules = course.modules.filter((m: any) =>
                collaborator.completedModules.includes(m.id)
              ).length;
              const progress = (completedModules / course.modules.length) * 100;
              return {
                id: course.id,
                title: course.title,
                category: course.category,
                duration: course.duration,
                modules: course.modules,
                status: collaborator.courseStatuses[course.id] || 'not-started',
                completedModules,
                totalModules: course.modules.length,
                progress,
              };
            });

          return (
            <CollaboratorDetail
              collaborator={collaborator}
              courses={collaboratorCourses}
              onBack={() => setSelectedCollaboratorId(null)}
            />
          );
        }
      }

      switch (currentView) {
        case 'dashboard':
          return <HRDashboard />;
        case 'managers':
          return (
            <ManagerManagement
              collaborators={collaborators}
              onAddCollaborator={handleAddCollaborator}
              onCollaboratorClick={(id) => setSelectedCollaboratorId(id)}
              onEnrollInCourse={handleEnrollInCourse}
              courses={courses}
              trainingRequests={trainingRequests}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
            />
          );
        case 'catalog':
          return <TrainingCatalog />;
        case 'analytics':
          return <AnalyticsReports />;
        case 'licenses':
          return (
            <LicensesBilling
              totalLicenses={mockOrganization.licenseCount}
              usedLicenses={collaborators.length}
              collaborators={collaborators}
            />
          );
        default:
          return <HRDashboard />;
      }
    }

    // VUE COLLABORATEUR
    if (userRole === 'manager') {
      const currentCollaborator = collaborators[0]; // Simuler le collaborateur connecté

      if (selectedCourseId && currentView === 'courses') {
        return <CoursePlayer courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />;
      }

      switch (currentView) {
        case 'dashboard':
          return <ManagerDashboard />;
        case 'courses':
          const collaboratorCourses = courses
            .filter((c: any) => currentCollaborator.enrolledCourses.includes(c.id))
            .map((course: any) => {
              const completedModules = course.modules.filter((m: any) =>
                currentCollaborator.completedModules.includes(m.id)
              ).length;
              const progress = (completedModules / course.modules.length) * 100;
              return {
                id: course.id,
                title: course.title,
                description: course.description,
                category: course.category,
                duration: course.duration,
                rating: course.rating,
                trainer: course.trainer,
                progress,
                status: currentCollaborator.courseStatuses[course.id] || 'not-started',
                modules: course.modules.length,
                completedModules,
              };
            });

          return <CoursesGrid courses={collaboratorCourses} onCourseClick={(id) => setSelectedCourseId(id)} />;
        case 'catalog':
          return (
            <TrainingCatalog
              isCollaboratorView={true}
              onRequestCourse={(courseId) => handleCreateTrainingRequest(currentCollaborator.id, courseId)}
            />
          );
        case 'roleplay':
          return <AIRoleplayLab />;
        case 'progress':
          const totalCourses = currentCollaborator.enrolledCourses.length;
          const completedCourses = Object.values(currentCollaborator.courseStatuses).filter(
            (status) => status === 'completed'
          ).length;
          const inProgressCourses = Object.values(currentCollaborator.courseStatuses).filter(
            (status) => status === 'in-progress'
          ).length;

          const totalHours = courses
            .filter((c: any) => currentCollaborator.enrolledCourses.includes(c.id))
            .reduce((acc: number, course: any) => {
              const status = currentCollaborator.courseStatuses[course.id];
              if (status === 'completed') return acc + course.duration;
              if (status === 'in-progress') {
                const completedModules = course.modules.filter((m: any) =>
                  currentCollaborator.completedModules.includes(m.id)
                ).length;
                return acc + (course.duration * completedModules / course.modules.length);
              }
              return acc;
            }, 0);

          const coursesByCategory = courses
            .filter((c: any) => currentCollaborator.enrolledCourses.includes(c.id))
            .reduce((acc: any[], course: any) => {
              const existing = acc.find(item => item.category === course.category);
              const status = currentCollaborator.courseStatuses[course.id];
              let hoursSpent = 0;
              if (status === 'completed') hoursSpent = course.duration;
              else if (status === 'in-progress') {
                const completedModules = course.modules.filter((m: any) =>
                  currentCollaborator.completedModules.includes(m.id)
                ).length;
                hoursSpent = course.duration * completedModules / course.modules.length;
              }

              if (existing) {
                existing.count++;
                existing.hoursSpent += hoursSpent;
              } else {
                acc.push({
                  category: course.category,
                  count: 1,
                  hoursSpent: Math.round(hoursSpent),
                  color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][acc.length % 5],
                });
              }
              return acc;
            }, []);

          return (
            <CollaboratorProgress
              summary={{
                totalCourses,
                completedCourses,
                inProgressCourses,
                totalHoursLearned: Math.round(totalHours),
                badges: currentCollaborator.badges,
                coursesByCategory,
              }}
            />
          );
        default:
          return <ManagerDashboard />;
      }
    }

    // VUE FORMATEUR
    if (userRole === 'trainer') {
      switch (currentView) {
        case 'dashboard':
          return <TrainerDashboard />;
        case 'courses':
          return (
            <div className="space-y-6">
              <div>
                <h1 className="mb-2">Mes Cours</h1>
                <p className="text-muted-foreground">
                  Gérez votre contenu de formation publié
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-lg p-12 text-center">
                <p className="text-muted-foreground">
                  Interface de gestion des cours avec des contrôles d'édition, d'analyse et de visibilité.
                </p>
              </div>
            </div>
          );
        case 'upload':
          return <CourseUpload onPublishCourse={handleAddCourse} />;
        case 'revenue':
          const trainerCourses = courses
            .filter((c: any) => c.trainerId === 't1' || c.trainerId === 't2' || c.trainerId === 't3')
            .map((course: any) => ({
              id: course.id,
              title: course.title,
              category: course.category,
              enrolledCount: course.enrolledCount,
              revenue: course.revenue || course.price * course.enrolledCount,
              price: course.price,
              rating: course.rating,
              trend: 'up' as const,
            }));

          const totalRevenue = trainerCourses.reduce((acc, c) => acc + c.revenue, 0);
          const totalEnrollments = trainerCourses.reduce((acc, c) => acc + c.enrolledCount, 0);

          const monthlyData = [
            { month: 'Oct', revenue: 3200, enrollments: 45 },
            { month: 'Nov', revenue: 4100, enrollments: 58 },
            { month: 'Déc', revenue: 3800, enrollments: 52 },
            { month: 'Jan', revenue: 5200, enrollments: 71 },
            { month: 'Fév', revenue: 6100, enrollments: 84 },
            { month: 'Mar', revenue: 7200, enrollments: 98 },
          ];

          return (
            <RevenueAnalytics
              courses={trainerCourses}
              totalRevenue={totalRevenue}
              totalEnrollments={totalEnrollments}
              monthlyData={monthlyData}
            />
          );
        default:
          return <TrainerDashboard />;
      }
    }

    return null;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar
        role={userRole}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 md:p-8 max-w-7xl">
          {renderContent()}
        </div>
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}

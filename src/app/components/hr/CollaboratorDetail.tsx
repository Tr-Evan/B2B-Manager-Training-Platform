import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { ArrowLeft, BookOpen, Clock, CheckCircle2, PlayCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface Course {
  id: string;
  title: string;
  category: string;
  duration: number;
  modules: any[];
  status: 'not-started' | 'in-progress' | 'completed';
  completedModules: number;
  totalModules: number;
  progress: number;
}

interface CollaboratorDetailProps {
  collaborator: {
    id: string;
    name: string;
    email: string;
    discProfile: string;
    teamSize: number;
    industry: string;
    seniority: string;
  };
  courses: Course[];
  onBack: () => void;
}

export function CollaboratorDetail({ collaborator, courses, onBack }: CollaboratorDetailProps) {
  const completedCourses = courses.filter(c => c.status === 'completed');
  const inProgressCourses = courses.filter(c => c.status === 'in-progress');
  const notStartedCourses = courses.filter(c => c.status === 'not-started');

  const totalHoursCompleted = completedCourses.reduce((acc, c) => acc + c.duration, 0);
  const totalHoursInProgress = inProgressCourses.reduce((acc, c) => acc + (c.duration * c.progress / 100), 0);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2">{collaborator.name}</h1>
            <p className="text-muted-foreground">{collaborator.email}</p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-base px-3 py-1">
              {collaborator.discProfile}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{completedCourses.length}</div>
                <p className="text-sm text-muted-foreground">Cours terminés</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{inProgressCourses.length}</div>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600 mb-1">{notStartedCourses.length}</div>
                <p className="text-sm text-muted-foreground">Non commencés</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  {Math.round(totalHoursCompleted + totalHoursInProgress)}h
                </div>
                <p className="text-sm text-muted-foreground">Temps en formation</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cours terminés */}
      {completedCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Cours Terminés
              </CardTitle>
              <CardDescription>Formations complétées avec succès</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.35 + index * 0.05 }}
                  className="p-4 border-2 rounded-xl bg-green-50/50 border-green-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{course.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}h
                        </span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          100% terminé
                        </Badge>
                      </div>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Cours en cours */}
      {inProgressCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-blue-600" />
                Cours en Cours
              </CardTitle>
              <CardDescription>Formations actuellement suivies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {inProgressCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.45 + index * 0.05 }}
                  className="p-4 border-2 rounded-xl bg-blue-50/50 border-blue-200"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}h
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {course.completedModules}/{course.totalModules} modules
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">{Math.round(course.progress)}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Cours non commencés */}
      {notStartedCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-gray-600" />
                Cours Inscrits mais Non Commencés
              </CardTitle>
              <CardDescription>Formations en attente de démarrage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {notStartedCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.55 + index * 0.05 }}
                  className="p-4 border-2 rounded-xl bg-gray-50/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{course.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}h
                        </span>
                        <Badge variant="outline">À commencer</Badge>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

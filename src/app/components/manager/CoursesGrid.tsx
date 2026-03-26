import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Clock, Star, Play, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface CourseCardData {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  rating: number;
  trainer: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  modules: number;
  completedModules: number;
}

interface CoursesGridProps {
  courses: CourseCardData[];
  onCourseClick: (courseId: string) => void;
}

export function CoursesGrid({ courses, onCourseClick }: CoursesGridProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mb-2">Mes Cours 📚</h1>
        <p className="text-muted-foreground">
          Accédez à toutes vos formations et continuez votre apprentissage
        </p>
      </motion.div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-2 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total des cours</p>
                  <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Play className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="border-2 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">En cours</p>
                  <p className="text-3xl font-bold text-green-600">
                    {courses.filter((c) => c.status === 'in-progress').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-2 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Terminés</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {courses.filter((c) => c.status === 'completed').length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600 fill-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Grille de cours */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.25 + index * 0.05 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card className="border-2 hover:border-primary/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer">
              <CardHeader onClick={() => onCourseClick(course.id)} className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant={
                      course.status === 'completed'
                        ? 'default'
                        : course.status === 'in-progress'
                        ? 'secondary'
                        : 'outline'
                    }
                    className={
                      course.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : course.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700'
                        : ''
                    }
                  >
                    {course.status === 'completed'
                      ? 'Terminé'
                      : course.status === 'in-progress'
                      ? 'En cours'
                      : 'Non commencé'}
                  </Badge>
                  <Badge variant="outline">{course.category}</Badge>
                </div>

                <CardTitle className="text-lg leading-tight mb-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.description}</CardDescription>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}h
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mt-2">Par {course.trainer}</p>
              </CardHeader>

              <CardContent className="pt-0">
                {course.status === 'completed' ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Cours terminé à 100%
                      </span>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => onCourseClick(course.id)}>
                      Revoir le cours
                    </Button>
                  </div>
                ) : course.status === 'in-progress' ? (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">
                          {course.completedModules}/{course.modules} modules
                        </span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <p className="text-xs text-center text-muted-foreground">
                        {Math.round(course.progress)}% complété
                      </p>
                    </div>
                    <Button className="w-full shadow-sm hover:shadow-md transition-all" onClick={() => onCourseClick(course.id)}>
                      <Play className="w-4 h-4 mr-2" />
                      Continuer
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-xs text-center text-muted-foreground">
                        {course.modules} modules · {course.duration} heures de contenu
                      </p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => onCourseClick(course.id)}>
                      <Play className="w-4 h-4 mr-2" />
                      Commencer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {courses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="border-2 border-dashed">
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <Play className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Aucun cours inscrit</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Vous n'êtes inscrit à aucun cours pour le moment. Parcourez le catalogue pour
                  trouver des formations adaptées à vos besoins.
                </p>
                <Button>Parcourir le Catalogue</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

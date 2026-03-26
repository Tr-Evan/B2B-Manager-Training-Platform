import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Clock, BookOpen, Brain, TrendingUp, Star, Play, Sparkles } from 'lucide-react';
import { mockCourses, mockManagers, discProfileInfo } from '../../data/mockData';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function ManagerDashboard() {
  // Utilisation du premier manager comme utilisateur actuel
  const currentManager = mockManagers[0];

  const enrolledCourses = mockCourses.filter((course) =>
    currentManager.enrolledCourses.includes(course.id)
  );

  const recommendedCourses = mockCourses.filter(
    (course) =>
      !currentManager.enrolledCourses.includes(course.id) &&
      course.discRecommendations.includes(currentManager.discProfile)
  ).slice(0, 3);

  const totalModules = enrolledCourses.reduce(
    (acc, course) => acc + course.modules.length,
    0
  );
  const completionPercentage = totalModules > 0
    ? (currentManager.completedModules.length / totalModules) * 100
    : 0;

  const handleEnrollCourse = (courseTitle: string) => {
    toast.success('Inscription réussie !', {
      description: `Vous êtes maintenant inscrit à "${courseTitle}".`,
    });
  };

  const handleContinueCourse = (courseTitle: string) => {
    toast.info('Reprise du cours', {
      description: `Ouverture de "${courseTitle}"...`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header avec animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="mb-2">Bienvenue, {currentManager.name} ! 👋</h1>
        <p className="text-muted-foreground">
          Continuez votre parcours de développement professionnel
        </p>
      </motion.div>

      {/* Statistiques rapides avec animations */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Cours en Cours',
            value: enrolledCourses.length,
            subtitle: `${totalModules} modules au total`,
            icon: BookOpen,
            gradient: 'from-blue-500 to-cyan-500',
            delay: 0.1,
          },
          {
            title: "Taux d'Achèvement",
            value: `${Math.round(completionPercentage)}%`,
            subtitle: 'Continuez votre excellent travail !',
            icon: TrendingUp,
            gradient: 'from-green-500 to-emerald-500',
            delay: 0.2,
          },
          {
            title: 'Badges Gagnés',
            value: currentManager.badges.length,
            subtitle: 'réalisations débloquées',
            icon: Star,
            gradient: 'from-yellow-500 to-orange-500',
            delay: 0.3,
          },
          {
            title: 'Votre Profil DISC',
            value: currentManager.discProfile,
            subtitle: discProfileInfo[currentManager.discProfile].name,
            icon: Brain,
            gradient: 'from-purple-500 to-pink-500',
            delay: 0.4,
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: stat.delay }}
          >
            <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-br bg-clip-text text-transparent from-foreground to-foreground/70">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Continuer l'apprentissage avec animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="shadow-sm border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Continuer l'Apprentissage
            </CardTitle>
            <CardDescription>Reprenez là où vous vous êtes arrêté</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {enrolledCourses.map((course, index) => {
              const courseModules = course.modules.length;
              const completedInCourse = course.modules.filter((m) =>
                currentManager.completedModules.includes(m.id)
              ).length;
              const progress = (completedInCourse / courseModules) * 100;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-center gap-4 p-5 border-2 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50/50">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {completedInCourse} sur {courseModules} modules terminés
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">{course.category}</Badge>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <Button
                      onClick={() => handleContinueCourse(course.title)}
                      className="shrink-0 shadow-sm hover:shadow-md transition-all"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Continuer
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommandé pour vous avec animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="shadow-sm border-2 bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Recommandé Pour Vous
            </CardTitle>
            <CardDescription>
              Basé sur votre profil {currentManager.discProfile} et la composition de votre équipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <Card className="border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-xl bg-white h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base leading-tight">{course.title}</CardTitle>
                      </div>
                      <CardDescription className="line-clamp-2 mt-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration}h</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full group hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-all"
                        onClick={() => handleEnrollCourse(course.title)}
                      >
                        <Sparkles className="w-4 h-4 mr-2 group-hover:text-green-500" />
                        S'Inscrire Maintenant
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Badges avec animations */}
      {currentManager.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="shadow-sm border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Vos Badges
              </CardTitle>
              <CardDescription>Réalisations obtenues au cours de votre parcours d'apprentissage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6">
                {currentManager.badges.map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1, type: 'spring' }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="text-center cursor-pointer"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-3xl mb-2 shadow-lg hover:shadow-xl transition-shadow">
                      {badge === 'early-adopter' && '🎯'}
                      {badge === 'completion-master' && '⭐'}
                      {badge === 'team-champion' && '🏆'}
                    </div>
                    <p className="text-xs font-medium capitalize">
                      {badge.replace('-', ' ')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
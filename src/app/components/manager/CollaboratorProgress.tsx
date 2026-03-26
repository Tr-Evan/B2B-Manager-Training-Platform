import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { TrendingUp, BookOpen, Clock, Award, Target, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';

interface ProgressSummary {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalHoursLearned: number;
  badges: string[];
  coursesByCategory: {
    category: string;
    count: number;
    hoursSpent: number;
    color: string;
  }[];
}

interface CollaboratorProgressProps {
  summary: ProgressSummary;
}

export function CollaboratorProgress({ summary }: CollaboratorProgressProps) {
  const completionRate = summary.totalCourses > 0
    ? (summary.completedCourses / summary.totalCourses) * 100
    : 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mb-2">Mon Progrès 📈</h1>
        <p className="text-muted-foreground">
          Suivez votre parcours d'apprentissage et vos réalisations
        </p>
      </motion.div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cours Inscrits</CardTitle>
              <BookOpen className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary.totalCourses}</div>
              <p className="text-xs text-muted-foreground mt-1">Formations totales</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cours Terminés</CardTitle>
              <Target className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{summary.completedCourses}</div>
              <p className="text-xs text-muted-foreground mt-1">Formations complétées</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heures de Formation</CardTitle>
              <Clock className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{summary.totalHoursLearned}h</div>
              <p className="text-xs text-muted-foreground mt-1">Temps d'apprentissage</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Badges Gagnés</CardTitle>
              <Award className="w-5 h-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{summary.badges.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Réalisations débloquées</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Taux de complétion global */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Taux de Complétion Global
            </CardTitle>
            <CardDescription>Votre avancement dans l'ensemble des formations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Progression générale</span>
                <span className="text-2xl font-bold text-blue-600">{Math.round(completionRate)}%</span>
              </div>
              <Progress value={completionRate} className="h-4" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="text-2xl font-bold text-green-600">{summary.completedCourses}</div>
                <p className="text-xs text-muted-foreground mt-1">Terminés</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{summary.inProgressCourses}</div>
                <p className="text-xs text-muted-foreground mt-1">En cours</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                <div className="text-2xl font-bold text-gray-600">
                  {summary.totalCourses - summary.completedCourses - summary.inProgressCourses}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Non commencés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Répartition par thématique */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Répartition par Thématique
            </CardTitle>
            <CardDescription>Analyse de vos formations par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {summary.coursesByCategory.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium">{category.category}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {category.count} cours
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {category.hoursSpent}h
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(category.count / summary.totalCourses) * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Badges et réalisations */}
      {summary.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-2 shadow-sm bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Vos Badges et Réalisations
              </CardTitle>
              <CardDescription>Célébrez vos succès dans votre parcours d'apprentissage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6 flex-wrap">
                {summary.badges.map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.45 + index * 0.1, type: 'spring' }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="text-center cursor-pointer"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-full flex items-center justify-center text-3xl mb-2 shadow-lg hover:shadow-xl transition-shadow">
                      {badge === 'early-adopter' && '🎯'}
                      {badge === 'completion-master' && '⭐'}
                      {badge === 'team-champion' && '🏆'}
                      {badge === 'fast-learner' && '⚡'}
                      {badge === 'perfect-score' && '💯'}
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Users, BookOpen, TrendingUp, CreditCard, Zap } from 'lucide-react';
import { mockOrganization, mockManagers, mockCourses } from '../../data/mockData';
import { Progress } from '../ui/progress';
import { motion } from 'motion/react';

export function HRDashboard() {
  const completionRate = mockManagers.reduce((acc, manager) => {
    const totalModules = manager.enrolledCourses.reduce((total, courseId) => {
      const course = mockCourses.find(c => c.id === courseId);
      return total + (course?.modules.length || 0);
    }, 0);
    const completed = manager.completedModules.length;
    return acc + (totalModules > 0 ? (completed / totalModules) * 100 : 0);
  }, 0) / mockManagers.length;

  const stats = [
    {
      title: 'Collaborateurs Actifs',
      value: mockOrganization.usedLicenses.toString(),
      description: `sur ${mockOrganization.licenseCount} licences`,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0.1,
    },
    {
      title: 'Cours Inscrits',
      value: mockManagers.reduce((acc, m) => acc + m.enrolledCourses.length, 0).toString(),
      description: 'Inscriptions totales',
      icon: BookOpen,
      gradient: 'from-green-500 to-emerald-500',
      delay: 0.2,
    },
    {
      title: 'Achèvement Moyen',
      value: `${Math.round(completionRate)}%`,
      description: 'Tous collaborateurs confondus',
      icon: TrendingUp,
      gradient: 'from-teal-500 to-cyan-500',
      delay: 0.3,
    },
    {
      title: 'Licences Disponibles',
      value: (mockOrganization.licenseCount - mockOrganization.usedLicenses).toString(),
      description: 'Prêtes à attribuer',
      icon: CreditCard,
      gradient: 'from-purple-500 to-pink-500',
      delay: 0.4,
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mb-2">Tableau de Bord RH 📊</h1>
        <p className="text-muted-foreground">
          Gérez l'apprentissage et le développement de votre organisation
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
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
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="shadow-sm border-2 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Aperçu du Progrès des Managers
              </CardTitle>
              <CardDescription>Taux d'achèvement individuels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockManagers.map((manager, index) => {
                const totalModules = manager.enrolledCourses.reduce((total, courseId) => {
                  const course = mockCourses.find(c => c.id === courseId);
                  return total + (course?.modules.length || 0);
                }, 0);
                const completion = totalModules > 0 ? (manager.completedModules.length / totalModules) * 100 : 0;

                return (
                  <motion.div
                    key={manager.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{manager.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {manager.enrolledCourses.length} cours
                        </p>
                      </div>
                      <span className="text-sm font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full">
                        {Math.round(completion)}%
                      </span>
                    </div>
                    <Progress value={completion} className="h-2" />
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="shadow-sm border-2 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Activité Récente
              </CardTitle>
              <CardDescription>Dernières réalisations de l'équipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {[
                {
                  color: 'bg-green-500',
                  title: 'Maria Garcia a terminé un cours',
                  description: 'Gérer des Équipes Haute Performance · il y a 2 heures',
                  delay: 0.7,
                },
                {
                  color: 'bg-blue-500',
                  title: 'Alice Thompson a commencé un nouveau cours',
                  description: 'Prise de Décision Stratégique · il y a 5 heures',
                  delay: 0.75,
                },
                {
                  color: 'bg-yellow-500',
                  title: 'Robert Chang a obtenu un badge',
                  description: 'Premier Utilisateur · il y a 1 jour',
                  delay: 0.8,
                },
                {
                  color: 'bg-purple-500',
                  title: 'Nouveau cours ajouté au catalogue',
                  description: 'Construire la Sécurité Psychologique · il y a 2 jours',
                  delay: 0.85,
                },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: activity.delay }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-2.5 h-2.5 mt-2 rounded-full ${activity.color} ring-4 ring-${activity.color}/20`}></div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
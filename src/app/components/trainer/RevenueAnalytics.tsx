import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { DollarSign, TrendingUp, Users, BookOpen, Star, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CourseRevenue {
  id: string;
  title: string;
  category: string;
  enrolledCount: number;
  revenue: number;
  price: number;
  rating: number;
  trend: 'up' | 'down' | 'stable';
}

interface RevenueAnalyticsProps {
  courses: CourseRevenue[];
  totalRevenue: number;
  totalEnrollments: number;
  monthlyData: {
    month: string;
    revenue: number;
    enrollments: number;
  }[];
}

export function RevenueAnalytics({
  courses,
  totalRevenue,
  totalEnrollments,
  monthlyData,
}: RevenueAnalyticsProps) {
  const avgRevenueCourse = courses.length > 0 ? totalRevenue / courses.length : 0;
  const topCourse = courses.sort((a, b) => b.revenue - a.revenue)[0];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mb-2">Revenus et Analyse 💰</h1>
        <p className="text-muted-foreground">
          Suivez vos performances financières et vos métriques de cours
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
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
              <DollarSign className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{totalRevenue.toLocaleString()}€</div>
              <p className="text-xs text-muted-foreground mt-1">Revenus cumulés</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscriptions Totales</CardTitle>
              <Users className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{totalEnrollments}</div>
              <p className="text-xs text-muted-foreground mt-1">Collaborateurs formés</p>
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
              <CardTitle className="text-sm font-medium">Cours Actifs</CardTitle>
              <BookOpen className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{courses.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Formations publiées</p>
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
              <CardTitle className="text-sm font-medium">Revenu Moyen</CardTitle>
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {Math.round(avgRevenueCourse).toLocaleString()}€
              </div>
              <p className="text-xs text-muted-foreground mt-1">Par cours</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Graphique des revenus mensuels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Évolution des Revenus
            </CardTitle>
            <CardDescription>Performance financière sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Revenus (€)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Graphique des inscriptions mensuelles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Inscriptions Mensuelles
            </CardTitle>
            <CardDescription>Nombre de nouveaux collaborateurs inscrits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="enrollments" fill="#8b5cf6" name="Inscriptions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performances par cours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              Performance par Cours
            </CardTitle>
            <CardDescription>Analyse détaillée de chaque formation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.45 + index * 0.05 }}
                  className="p-5 border-2 rounded-xl hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{course.title}</h3>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{course.category}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    {course.trend === 'up' && (
                      <Badge variant="default" className="bg-green-100 text-green-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        En hausse
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-muted-foreground">Inscrits</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{course.enrolledCount}</p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-muted-foreground">Revenus</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {course.revenue.toLocaleString()}€
                      </p>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-xs text-muted-foreground">Prix</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">{course.price}€</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Meilleur cours */}
      {topCourse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <Card className="border-2 shadow-sm bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                Votre Meilleur Cours
              </CardTitle>
              <CardDescription>Le cours le plus performant en termes de revenus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{topCourse.title}</h3>
                  <Badge variant="secondary">{topCourse.category}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl border-2">
                    <div className="text-3xl font-bold text-green-600">
                      {topCourse.revenue.toLocaleString()}€
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Revenus générés</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border-2">
                    <div className="text-3xl font-bold text-blue-600">{topCourse.enrolledCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">Inscrits</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border-2">
                    <div className="text-3xl font-bold text-yellow-600">
                      {topCourse.rating.toFixed(1)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Note moyenne</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

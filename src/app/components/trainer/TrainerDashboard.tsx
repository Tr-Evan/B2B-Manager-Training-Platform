import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { DollarSign, Users, BookOpen, TrendingUp, Star } from 'lucide-react';
import { mockTrainerStats, mockCourses } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export function TrainerDashboard() {
  const trainerCourses = mockCourses.filter((c) => c.trainerId === 't1');
  
  // Charger aussi les cours créés par le formateur custom depuis localStorage
  const customCreatedCourses = JSON.parse(localStorage.getItem('talentium_courses') || '[]').filter((c: any) => c.trainerId === 'trainer-custom');
  const allTrainerCourses = [...trainerCourses, ...customCreatedCourses];

  const revenueData = [
    { month: 'Jan', revenue: 3200 },
    { month: 'Fév', revenue: 3800 },
    { month: 'Mar', revenue: 4200 },
    { month: 'Avr', revenue: 4500 },
    { month: 'Mai', revenue: 5100 },
    { month: 'Juin', revenue: 5800 },
  ];

  const enrollmentData = allTrainerCourses.map((course) => ({
    name: course.title.slice(0, 20),
    students: course.enrolledCount,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Tableau de Bord Formateur</h1>
        <p className="text-muted-foreground">
          Suivez la performance de vos cours et vos revenus
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenus Totaux
            </CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockTrainerStats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Gains de tous les temps
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Managers Inscrits
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTrainerStats.enrolledManagers}
            </div>
            <p className="text-xs text-muted-foreground">
              Apprenants actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cours Actifs
            </CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTrainerStats.activeCourses}
            </div>
            <p className="text-xs text-muted-foreground">
              Cours publiés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Note Moyenne
            </CardTitle>
            <Star className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTrainerStats.avgRating}
            </div>
            <p className="text-xs text-muted-foreground">
              Sur 5,0
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendance des Revenus</CardTitle>
            <CardDescription>Gains mensuels au fil du temps</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance des Cours</CardTitle>
            <CardDescription>Inscriptions par cours</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vos Cours</CardTitle>
          <CardDescription>Aperçu de performance de vos cours publiés</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allTrainerCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-16 w-16 min-w-16 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 rounded-lg overflow-hidden flex items-center justify-center">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <BookOpen className="w-8 h-8 text-yellow-600 opacity-50" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.category} • {course.duration} heures
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8 text-sm">
                  <div className="text-center">
                    <p className="font-semibold">{course.enrolledCount}</p>
                    <p className="text-muted-foreground">Inscrits</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <p className="font-semibold">{course.rating}</p>
                    </div>
                    <p className="text-muted-foreground">Note</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">${course.price}</p>
                    <p className="text-muted-foreground">Prix</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-green-600">
                      ${(course.enrolledCount * course.price * 0.7).toLocaleString()}
                    </p>
                    <p className="text-muted-foreground">Revenu</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600 rounded-full">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Aperçus de Croissance</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Vos cours performent {mockTrainerStats.monthlyGrowth}% mieux que le mois dernier.
              Continuez à créer du contenu de valeur pour maximiser votre impact et vos revenus !
            </p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Taux d'Achèvement</p>
                <p className="font-semibold">68%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Temps de Visionnage Moy.</p>
                <p className="font-semibold">87%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Satisfaction Étudiants</p>
                <p className="font-semibold">92%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

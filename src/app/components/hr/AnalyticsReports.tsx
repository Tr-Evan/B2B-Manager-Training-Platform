import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { mockManagers, mockCourses, discProfileInfo } from '../../data/mockData';
import { Badge } from '../ui/badge';
import { TrendingUp, Users, BookOpen, Award } from 'lucide-react';

export function AnalyticsReports() {
  // Données d'inscription aux cours
  const courseData = mockCourses.map((course) => {
    const enrolled = mockManagers.filter((m) => m.enrolledCourses.includes(course.id)).length;
    return {
      name: course.title.slice(0, 20),
      enrolled,
    };
  }).sort((a, b) => b.enrolled - a.enrolled).slice(0, 6);

  // Distribution DISC
  const discData = Object.keys(discProfileInfo).map((profile) => ({
    name: profile,
    value: mockManagers.filter((m) => m.discProfile === profile).length,
    color: discProfileInfo[profile as keyof typeof discProfileInfo].color,
  }));

  // Tendances d'achèvement (données fictives)
  const trendData = [
    { month: 'Jan', completion: 45 },
    { month: 'Fév', completion: 52 },
    { month: 'Mar', completion: 58 },
    { month: 'Avr', completion: 65 },
    { month: 'Mai', completion: 71 },
    { month: 'Juin', completion: 78 },
  ];

  // Calcul des métriques d'équipe
  const avgTeamSize = mockManagers.reduce((acc, m) => acc + m.teamSize, 0) / mockManagers.length;
  const totalBadges = mockManagers.reduce((acc, m) => acc + m.badges.length, 0);
  const totalEnrollments = mockManagers.reduce((acc, m) => acc + m.enrolledCourses.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Analyses et Rapports</h1>
        <p className="text-muted-foreground">
          Suivez le progrès et l'impact d'apprentissage de votre organisation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taille d'Équipe Moy.
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTeamSize.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              membres par manager
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inscriptions Totales
            </CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              places de cours actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Badges Gagnés
            </CardTitle>
            <Award className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBadges}</div>
            <p className="text-xs text-muted-foreground">
              réalisations débloquées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tendance de Croissance
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,5%</div>
            <p className="text-xs text-muted-foreground">
              vs le mois dernier
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inscriptions aux Cours</CardTitle>
            <CardDescription>Programmes de formation les plus populaires</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrolled" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution des Profils DISC</CardTitle>
            <CardDescription>Types de personnalité des managers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={discData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {discData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {Object.entries(discProfileInfo).map(([key, info]) => (
                <div key={key} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: info.color }}
                  />
                  <span className="text-sm">
                    {key} - {info.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendance d'Achèvement</CardTitle>
            <CardDescription>Taux d'achèvement moyen au fil du temps</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="completion"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aperçus du Climat d'Équipe</CardTitle>
            <CardDescription>Analyses socio-émotionnelles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Intelligence Émotionnelle</span>
                <Badge variant="secondary">En amélioration</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Qualité du Feedback</span>
                <Badge variant="secondary">Fort</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Engagement de l'Équipe</span>
                <Badge variant="secondary">En croissance</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-600 h-2 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Résolution de Conflits</span>
                <Badge variant="secondary">Modéré</Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

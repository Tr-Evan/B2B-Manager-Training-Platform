import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, Clock, Star, Users, Send, X, BookOpen } from 'lucide-react';
import { mockCourses } from '../../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';

interface TrainingCatalogProps {
  isCollaboratorView?: boolean;
  onRequestCourse?: (courseId: string) => void;
}

export function TrainingCatalog({ isCollaboratorView = false, onRequestCourse }: TrainingCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);

  // Charger les cours au montage du composant
  useEffect(() => {
    // Charger les mock courses
    let courses = [...mockCourses];
    
    // Charger les cours créés par les formateurs depuis localStorage
    try {
      const customCourses = JSON.parse(localStorage.getItem('talentium_courses') || '[]');
      courses = [...courses, ...customCourses];
    } catch (error) {
      console.error('Erreur lors du chargement des cours personnalisés:', error);
    }
    
    setAllCourses(courses);
  }, []);

  const categories = ['all', ...Array.from(new Set(allCourses.map(c => c.category)))];

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRequestCourse = (courseId: string) => {
    if (onRequestCourse) {
      onRequestCourse(courseId);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mb-2">Catalogue de Formation</h1>
        <p className="text-muted-foreground">
          {isCollaboratorView
            ? 'Parcourez le catalogue et demandez l\'accès aux formations'
            : 'Parcourez et achetez des cours de formation pour vos collaborateurs'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des cours..."
                  className="pl-10 transition-all focus:ring-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 + index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Card className="border-2 hover:border-primary/30 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="h-40 w-full bg-gradient-to-br from-purple-200 via-yellow-300 to-orange-400 overflow-hidden rounded-t-2xl flex items-center justify-center relative">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <BookOpen className="w-12 h-12 text-purple-600 opacity-50" />
                          <span className="text-purple-700 font-semibold text-sm">{course.category}</span>
                        </div>
                      )}
                    </div>
                    <CardHeader className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">{course.category}</Badge>
                        <Badge variant="outline" className="font-bold">
                          {course.price}€
                        </Badge>
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
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.enrolledCount}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2">Par {course.trainer}</p>

                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Recommandé pour :</p>
                        <div className="flex gap-1">
                          {course.discRecommendations.map((profile) => (
                            <Badge key={profile} variant="outline" className="text-xs">
                              {profile}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {isCollaboratorView ? (
                        <Button
                          className="w-full shadow-sm hover:shadow-md transition-all"
                          onClick={() => handleRequestCourse(course.id)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Demander l'Accès
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <div className="p-2 bg-gray-50 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground">
                              {course.modules.length} modules
                            </p>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full" onClick={() => setSelectedCourse(course)}>
                                Voir les Détails
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{course.title}</DialogTitle>
                                <DialogDescription>
                                  {course.category} • {course.duration}h • Par {course.trainer}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-6">
                                {/* Description */}
                                <div className="space-y-2">
                                  <h3 className="font-semibold text-sm">Description</h3>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {course.description}
                                  </p>
                                </div>

                                {/* Statistiques */}
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{course.rating}</p>
                                    <p className="text-xs text-muted-foreground">Note</p>
                                  </div>
                                  <div className="text-center p-3 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">{course.enrolledCount}</p>
                                    <p className="text-xs text-muted-foreground">Inscrits</p>
                                  </div>
                                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                                    <p className="text-2xl font-bold text-purple-600">{course.price}€</p>
                                    <p className="text-xs text-muted-foreground">Prix</p>
                                  </div>
                                </div>

                                {/* Profils DISC */}
                                <div className="space-y-2">
                                  <h3 className="font-semibold text-sm">Recommandé pour les profils DISC :</h3>
                                  <div className="flex gap-2 flex-wrap">
                                    {course.discRecommendations.map((profile: string) => (
                                      <Badge key={profile} variant="secondary">
                                        {profile}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {/* Modules */}
                                <Tabs defaultValue="modules" className="w-full">
                                  <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="modules">Modules</TabsTrigger>
                                    <TabsTrigger value="apercu">Aperçu</TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="modules" className="space-y-3 mt-4">
                                    {course.modules && course.modules.length > 0 ? (
                                      <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {course.modules.map((module: any, idx: number) => (
                                          <div key={idx} className="p-3 bg-gray-50 rounded-lg border text-sm">
                                            <div className="flex items-center justify-between">
                                              <span className="font-medium">{idx + 1}. {module.title}</span>
                                              <Badge variant="outline" className="text-xs">
                                                {module.type}
                                              </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                              <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {module.duration} min
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">Aucun module disponible</p>
                                    )}
                                  </TabsContent>

                                  <TabsContent value="apercu" className="space-y-3 mt-4">
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-sm font-semibold mb-2">Points clés du cours :</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                                          <li>Contenu pratique et appliquable immédiatement</li>
                                          <li>Formateur expert avec {Math.floor(Math.random() * 15) + 5}+ années d'expérience</li>
                                          <li>Accès à vie au contenu</li>
                                          <li>Certificat de complétion</li>
                                        </ul>
                                      </div>

                                      <div>
                                        <h4 className="text-sm font-semibold mb-2">Pour qui ?</h4>
                                        <p className="text-sm text-muted-foreground">
                                          Ce cours est particulièrement adapté aux managers, superviseurs et responsables d'équipe
                                          qui souhaitent développer leurs compétences en {course.category.toLowerCase()}.
                                        </p>
                                      </div>
                                    </div>
                                  </TabsContent>
                                </Tabs>

                                {/* Boutons d'action */}
                                <div className="flex gap-3 pt-4">
                                  <Button className="flex-1">
                                    {isCollaboratorView ? 'Demander l\'accès' : 'Acheter le cours'}
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    Partager
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

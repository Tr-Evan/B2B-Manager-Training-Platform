import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Search, Clock, Star, Users, Send } from 'lucide-react';
import { mockCourses } from '../../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface TrainingCatalogProps {
  isCollaboratorView?: boolean;
  onRequestCourse?: (courseId: string) => void;
}

export function TrainingCatalog({ isCollaboratorView = false, onRequestCourse }: TrainingCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(mockCourses.map(c => c.category)))];

  const filteredCourses = mockCourses.filter((course) => {
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
                          <Button variant="outline" className="w-full">
                            Voir les Détails
                          </Button>
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

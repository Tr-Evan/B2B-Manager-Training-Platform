import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { BookOpen, Edit2, Trash2, Eye, Copy, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { EditCourseDialog } from './EditCourseDialog';

interface TrainerCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  trainer: string;
  trainerId: string;
  duration: number;
  rating: number;
  enrolledCount: number;
  discRecommendations: string[];
  modules: any[];
  thumbnail?: string;
}

export function TrainerMyCourses() {
  const [courses, setCourses] = useState<TrainerCourse[]>([]);
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<TrainerCourse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les cours du formateur depuis localStorage
    const loadCourses = () => {
      try {
        const allCourses = JSON.parse(localStorage.getItem('talentium_courses') || '[]');
        const trainerCourses = allCourses.filter((c: TrainerCourse) => c.trainerId === 'trainer-custom');
        setCourses(trainerCourses);
      } catch (error) {
        toast.error('Erreur lors du chargement des cours');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleDeleteCourse = (courseId: string) => {
    try {
      const allCourses = JSON.parse(localStorage.getItem('talentium_courses') || '[]');
      const updatedCourses = allCourses.filter((c: TrainerCourse) => c.id !== courseId);
      localStorage.setItem('talentium_courses', JSON.stringify(updatedCourses));
      setCourses(courses.filter((c) => c.id !== courseId));
      toast.success('Cours supprimé', {
        description: 'Le cours a été retiré du catalogue.',
      });
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
    setDeletingCourseId(null);
  };

  const handleDuplicateCourse = (course: TrainerCourse) => {
    try {
      const duplicatedCourse = {
        ...course,
        id: `c-${Date.now()}`,
        title: `${course.title} (copie)`,
        enrolledCount: 0,
        rating: 4.5,
      };

      const allCourses = JSON.parse(localStorage.getItem('talentium_courses') || '[]');
      allCourses.push(duplicatedCourse);
      localStorage.setItem('talentium_courses', JSON.stringify(allCourses));
      setCourses([...courses, duplicatedCourse]);

      toast.success('Cours dupliqué', {
        description: 'Une copie du cours a été créée.',
      });
    } catch (error) {
      toast.error('Erreur lors de la duplication');
    }
  };

  const handleShareCourse = (course: TrainerCourse) => {
    const shareText = `Découvrez mon cours: "${course.title}" sur Talentium! 🎓`;
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Lien copié', {
        description: 'Le texte a été copié dans le presse-papiers.',
      });
    }
  };

  const handleEditCourse = (course: TrainerCourse) => {
    setEditingCourse(course);
  };

  const handleSaveCourse = (updatedCourse: TrainerCourse) => {
    setCourses(courses.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    setEditingCourse(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="mb-2">Mes Cours</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-64 animate-pulse bg-gray-200"></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mb-2">Mes Cours 📚</h1>
        <p className="text-muted-foreground">
          Gérez vos cours publiés et consultez leurs statistiques
        </p>
      </motion.div>

      {courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="text-center py-12 border-2 border-dashed">
            <CardContent className="space-y-4">
              <BookOpen className="w-12 h-12 mx-auto opacity-50" style={{ color: '#f4c11b' }} />
              <div>
                <h3 className="text-lg font-semibold mb-1">Aucun cours pour le moment</h3>
                <p className="text-muted-foreground">
                  Vous n'avez créé aucun cours. Créez votre premier cours dans la section
                  "Télécharger un Cours".
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Nombre de cours</p>
                      <p className="text-3xl font-bold" style={{ color: '#f4c11b' }}>
                        {courses.length}
                      </p>
                    </div>
                    <BookOpen className="w-8 h-8" style={{ color: '#f4c11b', opacity: 0.3 }} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total d'inscrits</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {courses.reduce((acc, c) => acc + c.enrolledCount, 0)}
                      </p>
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
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Note moyenne</p>
                      <p className="text-3xl font-bold text-green-600">
                        {(courses.reduce((acc, c) => acc + c.rating, 0) / courses.length).toFixed(1)}
                      </p>
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
                <Card className="h-full flex flex-col border-2 hover:shadow-lg transition-all cursor-pointer">
                  <div className="h-40 w-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 overflow-hidden rounded-t-2xl flex items-center justify-center relative">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <BookOpen className="w-12 h-12 text-yellow-600 opacity-50" />
                        <span className="text-yellow-700 font-semibold text-sm">{course.category}</span>
                      </div>
                    )}
                  </div>
                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <Badge
                        variant="outline"
                        className="border-yellow-300 bg-yellow-50 text-yellow-800"
                      >
                        {course.category}
                      </Badge>
                      <Badge variant="secondary">{course.modules.length} modules</Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Durée</p>
                        <p className="font-semibold">{course.duration.toFixed(1)}h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Inscrits</p>
                        <p className="font-semibold">{course.enrolledCount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Prix</p>
                        <p className="font-semibold">${course.price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Note</p>
                        <p className="font-semibold">⭐ {course.rating}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 rounded-lg"
                        onClick={() => handleEditCourse(course)}
                        title="Modifier le cours"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 rounded-lg"
                        onClick={() => handleDuplicateCourse(course)}
                        title="Dupliquer le cours"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 rounded-lg"
                        onClick={() => handleShareCourse(course)}
                        title="Partager le cours"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeletingCourseId(course.id)}
                        title="Supprimer le cours"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deletingCourseId !== null} onOpenChange={(open) => !open && setDeletingCourseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce cours ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le cours sera supprimé du catalogue et tous les inscrits perdront l'accès.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingCourseId && handleDeleteCourse(deletingCourseId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog d'édition de cours */}
      {editingCourse && (
        <EditCourseDialog
          isOpen={editingCourse !== null}
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={handleSaveCourse}
        />
      )}
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Upload, Plus, Trash2, Video, FileText, HelpCircle, Save, Send } from 'lucide-react';
import { discProfileInfo } from '../../data/mockData';
import { Separator } from '../ui/separator';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface Module {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  duration: number;
}

interface CourseUploadProps {
  onPublishCourse?: (courseData: any) => void;
}

export function CourseUpload({ onPublishCourse }: CourseUploadProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedDISC, setSelectedDISC] = useState<string[]>([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [coursePrice, setCoursePrice] = useState(299);

  const addModule = (type: 'video' | 'text' | 'quiz') => {
    const newModule = {
      id: `module-${Date.now()}`,
      title: '',
      type,
      duration: 0,
    };
    setModules([...modules, newModule]);
    
    toast.success('Module ajouté !', {
      description: `Un module ${type === 'video' ? 'vidéo' : type === 'text' ? 'texte' : 'quiz'} a été ajouté au cours.`,
    });
  };

  const removeModule = (id: string) => {
    setModules(modules.filter((m) => m.id !== id));
    toast.info('Module supprimé', {
      description: 'Le module a été retiré du cours.',
    });
  };

  const toggleDISC = (profile: string) => {
    if (selectedDISC.includes(profile)) {
      setSelectedDISC(selectedDISC.filter((p) => p !== profile));
    } else {
      setSelectedDISC([...selectedDISC, profile]);
    }
  };

  const handleSaveDraft = () => {
    toast.info('Brouillon enregistré', {
      description: 'Votre cours a été sauvegardé comme brouillon.',
      duration: 3000,
    });
  };

  const handlePublishCourse = () => {
    if (!courseTitle || !courseDescription || !courseCategory || modules.length === 0) {
      toast.error('Erreur', {
        description: 'Veuillez remplir tous les champs et ajouter au moins un module.',
      });
      return;
    }

    const courseData = {
      title: courseTitle,
      description: courseDescription,
      category: courseCategory,
      price: coursePrice,
      trainer: 'Vous',
      trainerId: 'trainer-current',
      duration: modules.reduce((acc, m) => acc + m.duration, 0) / 60,
      rating: 4.5,
      discRecommendations: selectedDISC,
      modules: modules.map((m, i) => ({
        id: `${m.id}-${i}`,
        title: m.title,
        duration: m.duration,
        type: m.type,
      })),
    };

    if (onPublishCourse) {
      onPublishCourse(courseData);
    } else {
      toast.success('Cours publié avec succès ! 🎉', {
        description: 'Votre cours est maintenant disponible dans le catalogue.',
        duration: 5000,
      });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mb-2">Télécharger un Nouveau Cours</h1>
        <p className="text-muted-foreground">
          Créez et publiez votre contenu de formation
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-4 shadow-sm"
      >
        <p className="text-sm">
          <strong>Note :</strong> Vous devez avoir un abonnement formateur actif pour télécharger des cours.
          Le prix et le partage des revenus seront configurés lors de la publication.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-sm border-2">
          <CardHeader>
            <CardTitle>Informations sur le Cours</CardTitle>
            <CardDescription>Détails de base sur votre cours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du Cours</Label>
              <Input
                id="title"
                placeholder="ex. Stratégies de Leadership Avancées"
                className="transition-all focus:ring-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Décrivez ce que les managers apprendront dans ce cours..."
                rows={4}
                className="transition-all focus:ring-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={courseCategory} onValueChange={setCourseCategory}>
                  <SelectTrigger id="category" className="transition-all focus:ring-2">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="team">Gestion d'Équipe</SelectItem>
                    <SelectItem value="conflict">Gestion des Conflits</SelectItem>
                    <SelectItem value="strategy">Stratégie</SelectItem>
                    <SelectItem value="culture">Culture d'Équipe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix par Place ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="299"
                  min="0"
                  className="transition-all focus:ring-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Profils DISC Recommandés</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Sélectionnez les types de personnalité qui bénéficieraient le plus de ce cours
              </p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(discProfileInfo).map(([key, info]) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + Object.keys(discProfileInfo).indexOf(key) * 0.05 }}
                    className="flex items-center space-x-2 p-4 border-2 rounded-xl cursor-pointer hover:bg-muted/50 hover:border-primary/30 transition-all"
                    onClick={() => toggleDISC(key)}
                  >
                    <Checkbox
                      id={`disc-${key}`}
                      checked={selectedDISC.includes(key)}
                      onCheckedChange={() => toggleDISC(key)}
                    />
                    <label
                      htmlFor={`disc-${key}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="font-medium"
                          style={{
                            borderColor: info.color,
                            color: info.color,
                          }}
                        >
                          {key}
                        </Badge>
                        <span className="text-sm font-medium">{info.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {info.description}
                      </p>
                    </label>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-sm border-2">
          <CardHeader>
            <CardTitle>Modules du Cours</CardTitle>
            <CardDescription>
              Ajoutez des leçons vidéo, du matériel de lecture et des quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {modules.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/20">
                <div className="max-w-md mx-auto">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground mb-4">
                    Aucun module ajouté pour l'instant. Commencez à construire votre cours !
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border-2 rounded-xl p-5 space-y-4 bg-gradient-to-r from-white to-gray-50/30 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {module.type === 'video' && (
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Video className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                        {module.type === 'text' && (
                          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-green-600" />
                          </div>
                        )}
                        {module.type === 'quiz' && (
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <HelpCircle className="w-5 h-5 text-purple-600" />
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Module {index + 1}</span>
                          <Badge variant="secondary" className="ml-2">{module.type}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModule(module.id)}
                        className="hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label>Titre du Module</Label>
                        <Input placeholder="ex. Introduction au Leadership" className="transition-all focus:ring-2" />
                      </div>
                      <div className="space-y-2">
                        <Label>Durée (minutes)</Label>
                        <Input type="number" placeholder="45" min="0" className="transition-all focus:ring-2" />
                      </div>
                    </div>

                    {module.type === 'video' && (
                      <div className="space-y-2">
                        <Label>Fichier Vidéo</Label>
                        <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors bg-white">
                          <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-3">
                            Glissez-déposez votre fichier vidéo ou cliquez pour parcourir
                          </p>
                          <Button variant="outline" size="sm" className="shadow-sm">
                            Choisir un Fichier
                          </Button>
                        </div>
                      </div>
                    )}

                    {module.type === 'text' && (
                      <div className="space-y-2">
                        <Label>Contenu</Label>
                        <Textarea
                          placeholder="Écrivez le contenu de votre leçon ici..."
                          rows={6}
                          className="transition-all focus:ring-2"
                        />
                      </div>
                    )}

                    {module.type === 'quiz' && (
                      <div className="space-y-2">
                        <Label>Questions du Quiz</Label>
                        <div className="border-2 rounded-xl p-5 bg-muted/30">
                          <p className="text-sm text-muted-foreground mb-3">
                            Ajoutez 5 à 10 questions à choix multiples pour tester la compréhension
                          </p>
                          <Button variant="outline" size="sm" className="shadow-sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter une Question
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            <Separator />

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => addModule('video')} className="shadow-sm hover:shadow-md transition-all">
                <Video className="w-4 h-4 mr-2" />
                Ajouter une Vidéo
              </Button>
              <Button variant="outline" onClick={() => addModule('text')} className="shadow-sm hover:shadow-md transition-all">
                <FileText className="w-4 h-4 mr-2" />
                Ajouter une Lecture
              </Button>
              <Button variant="outline" onClick={() => addModule('quiz')} className="shadow-sm hover:shadow-md transition-all">
                <HelpCircle className="w-4 h-4 mr-2" />
                Ajouter un Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="shadow-sm border-2">
          <CardHeader>
            <CardTitle>Miniature du Cours</CardTitle>
            <CardDescription>Téléchargez une image de couverture pour votre cours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-xl p-12 text-center hover:border-primary/50 transition-colors bg-gradient-to-br from-white to-gray-50/50">
              <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Glissez-déposez une image ou cliquez pour parcourir
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Taille recommandée : 1280x720px (ratio 16:9)
              </p>
              <Button variant="outline" className="shadow-sm">
                Choisir une Image
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex gap-4 justify-end"
      >
        <Button variant="outline" size="lg" onClick={handleSaveDraft} className="shadow-md hover:shadow-lg transition-all">
          <Save className="w-4 h-4 mr-2" />
          Enregistrer comme Brouillon
        </Button>
        <Button size="lg" onClick={handlePublishCourse} className="shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-blue-600 to-blue-700">
          <Send className="w-4 h-4 mr-2" />
          Publier le Cours
        </Button>
      </motion.div>
    </div>
  );
}
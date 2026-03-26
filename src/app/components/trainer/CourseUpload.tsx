import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Upload, Plus, Trash2, Video, FileText, HelpCircle, Save, Send, X, ChevronDown, ChevronUp } from 'lucide-react';
import { discProfileInfo } from '../../data/mockData';
import { Separator } from '../ui/separator';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Module {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  duration: number;
  videoFile?: File;
  videoUrl?: string;
  textContent?: string;
  questions?: Question[];
  imageUrl?: string;
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
  const [courseThumbnail, setCourseThumbnail] = useState<File | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

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

  const updateModule = (id: string, updates: Partial<Module>) => {
    setModules(modules.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const addQuestion = (moduleId: string) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId && m.type === 'quiz') {
          const newQuestion: Question = {
            id: `q-${Date.now()}`,
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0,
          };
          return {
            ...m,
            questions: [...(m.questions || []), newQuestion],
          };
        }
        return m;
      })
    );
    toast.success('Question ajoutée !');
  };

  const removeQuestion = (moduleId: string, questionId: string) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId && m.type === 'quiz') {
          return {
            ...m,
            questions: m.questions?.filter((q) => q.id !== questionId),
          };
        }
        return m;
      })
    );
    toast.info('Question supprimée');
  };

  const updateQuestion = (moduleId: string, questionId: string, updates: Partial<Question>) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId && m.type === 'quiz') {
          return {
            ...m,
            questions: m.questions?.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
          };
        }
        return m;
      })
    );
  };

  const updateQuestionOption = (moduleId: string, questionId: string, optionIndex: number, value: string) => {
    setModules(
      modules.map((m) => {
        if (m.id === moduleId && m.type === 'quiz') {
          return {
            ...m,
            questions: m.questions?.map((q) => {
              if (q.id === questionId) {
                const newOptions = [...q.options];
                newOptions[optionIndex] = value;
                return { ...q, options: newOptions };
              }
              return q;
            }),
          };
        }
        return m;
      })
    );
  };

  const handleVideoUpload = (moduleId: string, file: File) => {
    // Stocker en cache navigateur (localStorage)
    const reader = new FileReader();
    reader.onload = (e) => {
      const videoData = e.target?.result as string;
      try {
        localStorage.setItem(`video-${moduleId}`, videoData);
        updateModule(moduleId, { videoFile: file, videoUrl: `local-${moduleId}` });
        toast.success('Vidéo téléchargée et mise en cache !');
      } catch (error) {
        toast.error('La vidéo est trop volumineuse pour le cache navigateur');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      try {
        localStorage.setItem('course-thumbnail', imageData);
        setCourseThumbnail(file);
        toast.success('Image de couverture téléchargée et mise en cache !');
      } catch (error) {
        toast.error('L\'image est trop volumineuse pour le cache navigateur');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleTextUpload = (moduleId: string, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateModule(moduleId, { textContent: event.target.value });
  };

  const handlePublishCourse = () => {
    // Accepter les champs vides - générer des valeurs par défaut si nécessaire
    const finalTitle = courseTitle || `Cours ${new Date().toLocaleDateString()}`;
    const finalDescription = courseDescription || 'Description non disponible';
    const finalCategory = courseCategory || 'Général';
    
    // Au moins un module est recommandé mais pas obligatoire
    if (modules.length === 0) {
      toast.warning('Avertissement', {
        description: 'Vous créez un cours sans modules. Vous pouvez en ajouter ultérieurement.',
      });
    }

    // Valider les modules existants
    for (const module of modules) {
      const finalModuleTitle = module.title || `Module ${module.type}`;
      if (module.type === 'quiz' && (!module.questions || module.questions.length === 0)) {
        toast.error('Erreur', {
          description: `Le module quiz doit contenir au moins une question.`,
        });
        return;
      }
    }

    const courseModule = modules.map((m, i) => ({
      id: `m-${Date.now()}-${i}`,
      title: m.title || `Module ${m.type}`,
      duration: m.duration || 0,
      type: m.type as 'video' | 'text' | 'quiz',
      content: m.type === 'text' ? m.textContent : undefined,
      videoUrl: m.type === 'video' ? m.videoUrl : undefined,
      questions: m.type === 'quiz' ? m.questions : undefined,
    }));

    const courseData = {
      id: `c-${Date.now()}`,
      title: finalTitle,
      description: finalDescription,
      category: finalCategory,
      price: coursePrice,
      trainer: 'Mon Cours',
      trainerId: 'trainer-custom',
      duration: modules.length > 0 ? modules.reduce((acc, m) => acc + (m.duration || 0), 0) / 60 : 0,
      rating: 4.5,
      enrolledCount: 0,
      discRecommendations: selectedDISC.length > 0 ? selectedDISC : ['D', 'I', 'S', 'C'],
      modules: courseModule,
      thumbnail: courseThumbnail ? localStorage.getItem('course-thumbnail') : undefined,
    };

    // Sauvegarder dans localStorage
    try {
      const existingCourses = JSON.parse(localStorage.getItem('talentium_courses') || '[]');
      existingCourses.push(courseData);
      localStorage.setItem('talentium_courses', JSON.stringify(existingCourses));

      // Sauvegarder aussi les quizzes
      const quizzesData: { [key: string]: any } = {};
      courseModule.forEach((m) => {
        if (m.type === 'quiz' && m.questions) {
          quizzesData[m.id] = {
            id: `quiz-${m.id}`,
            moduleId: m.id,
            questions: m.questions,
          };
        }
      });
      
      if (Object.keys(quizzesData).length > 0) {
        const existingQuizzes = JSON.parse(localStorage.getItem('talentium_quizzes') || '{}');
        localStorage.setItem('talentium_quizzes', JSON.stringify({ ...existingQuizzes, ...quizzesData }));
      }

      if (onPublishCourse) {
        onPublishCourse(courseData);
      }

      toast.success('Cours publié avec succès ! 🎉', {
        description: 'Votre cours est maintenant disponible dans le catalogue et en cache navigateur.',
        duration: 5000,
      });

      // Réinitialiser le formulaire
      setCourseTitle('');
      setCourseDescription('');
      setCourseCategory('');
      setCoursePrice(299);
      setModules([]);
      setSelectedDISC([]);
      setCourseThumbnail(null);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde', {
        description: 'Impossible de sauvegarder le cours. Veuillez vérifier l\'espace de stockage.',
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
                        <Input 
                          placeholder="ex. Introduction au Leadership"
                          value={module.title}
                          onChange={(e) => updateModule(module.id, { title: e.target.value })}
                          className="transition-all focus:ring-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Durée (minutes)</Label>
                        <Input 
                          type="number" 
                          placeholder="45" 
                          min="0"
                          value={module.duration}
                          onChange={(e) => updateModule(module.id, { duration: parseInt(e.target.value) || 0 })}
                          className="transition-all focus:ring-2"
                        />
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
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleVideoUpload(module.id, e.target.files[0]);
                              }
                            }}
                            className="hidden"
                            id={`video-${module.id}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="shadow-sm"
                            onClick={() => document.getElementById(`video-${module.id}`)?.click()}
                          >
                            Choisir un Fichier
                          </Button>
                          {module.videoFile && (
                            <p className="text-xs text-green-600 mt-2">✓ {module.videoFile.name} téléchargé</p>
                          )}
                        </div>
                      </div>
                    )}

                    {module.type === 'text' && (
                      <div className="space-y-2">
                        <Label>Contenu</Label>
                        <Textarea
                          placeholder="Écrivez le contenu de votre leçon ici..."
                          rows={6}
                          value={module.textContent || ''}
                          onChange={(e) => handleTextUpload(module.id, e)}
                          className="transition-all focus:ring-2"
                        />
                      </div>
                    )}

                    {module.type === 'quiz' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>Questions du Quiz ({module.questions?.length || 0})</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addQuestion(module.id)}
                            className="shadow-sm"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Ajouter
                          </Button>
                        </div>

                        {module.questions && module.questions.length > 0 ? (
                          <div className="space-y-4 max-h-96 overflow-y-auto border-2 rounded-lg p-4 bg-muted/30">
                            {module.questions.map((question, qIndex) => (
                              <div key={question.id} className="border-2 rounded-lg p-4 bg-white space-y-3">
                                <div className="flex items-start justify-between">
                                  <span className="text-sm font-medium">Question {qIndex + 1}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeQuestion(module.id, question.id)}
                                    className="hover:bg-red-50 hover:text-red-600 h-8 w-8 p-0"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>

                                <div className="space-y-1">
                                  <Label className="text-xs">Énoncé</Label>
                                  <Input
                                    placeholder="Posez votre question..."
                                    value={question.question}
                                    onChange={(e) =>
                                      updateQuestion(module.id, question.id, { question: e.target.value })
                                    }
                                    className="text-sm"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-xs mb-2">Réponses</Label>
                                  <RadioGroup
                                    value={question.correctAnswer.toString()}
                                    onValueChange={(value) =>
                                      updateQuestion(module.id, question.id, { correctAnswer: parseInt(value) })
                                    }
                                  >
                                    {question.options.map((option, oIndex) => (
                                      <div key={oIndex} className="flex items-center gap-2 mb-2">
                                        <RadioGroupItem value={oIndex.toString()} id={`q-${question.id}-${oIndex}`} />
                                        <Input
                                          id={`q-${question.id}-${oIndex}`}
                                          placeholder={`Option ${oIndex + 1}`}
                                          value={option}
                                          onChange={(e) =>
                                            updateQuestionOption(module.id, question.id, oIndex, e.target.value)
                                          }
                                          className="text-xs"
                                        />
                                      </div>
                                    ))}
                                  </RadioGroup>
                                  <p className="text-xs text-muted-foreground mt-2">* Sélectionnez la réponse correcte</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border-2 border-dashed rounded-xl p-8 text-center bg-muted/30">
                            <HelpCircle className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                            <p className="text-sm text-muted-foreground">Aucune question pour le moment</p>
                            <p className="text-xs text-muted-foreground mt-2">Cliquez sur "Ajouter" pour créer votre première question</p>
                          </div>
                        )}
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
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="thumbnail-upload"
              />
              <Button
                variant="outline"
                className="shadow-sm"
                onClick={() => document.getElementById('thumbnail-upload')?.click()}
              >
                Choisir une Image
              </Button>
              {courseThumbnail && (
                <p className="text-xs text-green-600 mt-2">✓ {courseThumbnail.name} téléchargé</p>
              )}
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
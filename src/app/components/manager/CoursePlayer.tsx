import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { CheckCircle2, Circle, Clock, PlayCircle, FileText, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { mockCourses, mockManagers, mockQuizzes } from '../../data/mockData';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { motion } from 'motion/react';

interface CoursePlayerProps {
  courseId: string;
  onBack: () => void;
}

export function CoursePlayer({ courseId, onBack }: CoursePlayerProps) {
  const currentManager = mockManagers[0];
  const course = mockCourses.find(c => c.id === courseId) || mockCourses[0];
  const [selectedModule, setSelectedModule] = useState(course.modules[0]);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const isModuleCompleted = (moduleId: string) => {
    return currentManager.completedModules.includes(moduleId);
  };

  const completedCount = course.modules.filter((m) => isModuleCompleted(m.id)).length;
  const progress = (completedCount / course.modules.length) * 100;

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const quiz = selectedModule.type === 'quiz' ? mockQuizzes[selectedModule.id] : null;
  const correctCount = quiz
    ? Object.entries(quizAnswers).filter(
        ([questionId, answer]) => {
          const question = quiz.questions.find((q) => q.id === questionId);
          return question?.correctAnswer === answer;
        }
      ).length
    : 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux cours
        </Button>

        <div>
          <h1 className="mb-2">{course.title}</h1>
          <p className="text-muted-foreground">par {course.trainer}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des modules */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle>Modules du Cours</CardTitle>
              <CardDescription>
                {completedCount} sur {course.modules.length} terminés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="mb-4 h-2" />
              <div className="space-y-2">
                {course.modules.map((module, index) => {
                  const isCompleted = isModuleCompleted(module.id);
                  const isCurrent = selectedModule.id === module.id;
                  const Icon =
                    module.type === 'video'
                      ? PlayCircle
                      : module.type === 'text'
                      ? FileText
                      : HelpCircle;

                  return (
                    <button
                      key={module.id}
                      onClick={() => {
                        setSelectedModule(module);
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium">
                              {index + 1}. {module.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {module.duration} min
                            {module.type === 'quiz' && (
                              <Badge variant="outline" className="ml-auto text-xs">
                                Quiz
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Zone de contenu */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{selectedModule.title}</CardTitle>
                  <CardDescription>
                    {selectedModule.type === 'video' && 'Leçon Vidéo'}
                    {selectedModule.type === 'text' && 'Matériel de Lecture'}
                    {selectedModule.type === 'quiz' && 'Vérification des Connaissances'}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {selectedModule.duration} min
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedModule.type === 'video' && (
                <div className="space-y-4">
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center text-white">
                    <div className="text-center">
                      <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-75" />
                      <p className="text-sm opacity-75">Lecteur Vidéo (Simulation)</p>
                      <p className="text-xs opacity-50 mt-1">
                        En production, ceci diffuserait le contenu vidéo
                      </p>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <h3>Aperçu de la Leçon</h3>
                    <p>
                      Ce module explore les concepts fondamentaux de {selectedModule.title.toLowerCase()}.
                      Vous apprendrez des stratégies pratiques que vous pouvez appliquer immédiatement avec votre équipe.
                    </p>
                    <h3>Points Clés</h3>
                    <ul>
                      <li>Comprendre les principes et cadres de base</li>
                      <li>Apprendre les techniques d'application pratique</li>
                      <li>Développer des stratégies actionnables pour votre équipe</li>
                      <li>Construire la confiance dans des scénarios réels</li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <Button variant="outline">Module Précédent</Button>
                    <Button>
                      Marquer comme Terminé
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {selectedModule.type === 'text' && (
                <div className="space-y-4">
                  <div className="prose max-w-none">
                    <p>
                      Bienvenue dans ce module de lecture sur {selectedModule.title}. Ce guide complet
                      vous guidera à travers les concepts essentiels et vous fournira des insights actionnables.
                    </p>

                    <h3>Introduction</h3>
                    <p>
                      Dans ce module, nous explorerons les aspects critiques du leadership efficace et de la
                      gestion d'équipe. Comprendre ces principes vous aidera à créer un environnement d'équipe
                      plus productif et engagé.
                    </p>

                    <h3>Concepts de Base</h3>
                    <p>
                      Le leadership ne consiste pas seulement à diriger les autres—il s'agit d'inspirer, soutenir et
                      développer les membres de votre équipe pour qu'ils atteignent leur plein potentiel. Voici les principes clés :
                    </p>
                    <ul>
                      <li><strong>Écoute Active :</strong> Vraiment entendre ce que vos membres d'équipe disent</li>
                      <li><strong>Communication Claire :</strong> Exprimer les attentes et le feedback efficacement</li>
                      <li><strong>Autonomisation :</strong> Donner à votre équipe l'autonomie et la confiance</li>
                      <li><strong>Reconnaissance :</strong> Reconnaître les contributions et célébrer les victoires</li>
                    </ul>

                    <h3>Application Pratique</h3>
                    <p>
                      Pour appliquer ces concepts dans votre travail quotidien, envisagez de mettre en place un programme
                      d'entretiens individuels hebdomadaires avec chaque membre de l'équipe. Utilisez ce temps pour écouter,
                      fournir du feedback et soutenir leur développement professionnel.
                    </p>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <Button variant="outline">Module Précédent</Button>
                    <Button>
                      Marquer comme Terminé
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {selectedModule.type === 'quiz' && quiz && (
                <div className="space-y-6">
                  {!quizSubmitted ? (
                    <>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm">
                          Ce quiz testera votre compréhension des modules précédents. Vous devez répondre
                          correctement à toutes les questions pour continuer.
                        </p>
                      </div>

                      <div className="space-y-6">
                        {quiz.questions.map((question, index) => (
                          <div key={question.id} className="space-y-3 p-4 border-2 rounded-xl bg-gray-50">
                            <h3 className="font-medium">
                              {index + 1}. {question.question}
                            </h3>
                            <RadioGroup
                              value={quizAnswers[question.id]?.toString()}
                              onValueChange={(value) =>
                                setQuizAnswers({ ...quizAnswers, [question.id]: parseInt(value) })
                              }
                            >
                              {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-white transition-colors">
                                  <RadioGroupItem
                                    value={optionIndex.toString()}
                                    id={`${question.id}-${optionIndex}`}
                                  />
                                  <Label
                                    htmlFor={`${question.id}-${optionIndex}`}
                                    className="cursor-pointer flex-1"
                                  >
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={handleQuizSubmit}
                        disabled={Object.keys(quizAnswers).length !== quiz.questions.length}
                        className="w-full"
                      >
                        Soumettre le Quiz
                      </Button>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <div
                        className={`border-2 rounded-lg p-6 text-center ${
                          correctCount === quiz.questions.length
                            ? 'bg-green-50 border-green-200'
                            : 'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <div className="text-4xl mb-2">
                          {correctCount === quiz.questions.length ? '🎉' : '📚'}
                        </div>
                        <h3 className="font-semibold mb-2">
                          Vous avez obtenu {correctCount} sur {quiz.questions.length}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {correctCount === quiz.questions.length
                            ? 'Excellent travail ! Vous pouvez passer au module suivant.'
                            : 'Révisez le matériel et réessayez pour continuer.'}
                        </p>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => {
                          setQuizSubmitted(false);
                          setQuizAnswers({});
                        }}>
                          Refaire le Quiz
                        </Button>
                        {correctCount === quiz.questions.length && (
                          <Button>
                            Module Suivant
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

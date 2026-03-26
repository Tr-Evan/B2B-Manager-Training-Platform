import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Brain, Send, RotateCcw, Clock, Target } from 'lucide-react';
import { mockAIRoleplays, discProfileInfo } from '../../data/mockData';
import { Separator } from '../ui/separator';

export function AIRoleplayLab() {
  const [selectedRoleplay, setSelectedRoleplay] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai' | 'system'; content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  const currentRoleplay = mockAIRoleplays.find((r) => r.id === selectedRoleplay);

  const startRoleplay = (roleplayId: string) => {
    const roleplay = mockAIRoleplays.find((r) => r.id === roleplayId);
    if (!roleplay) return;

    setSelectedRoleplay(roleplayId);
    setMessages([
      {
        role: 'system',
        content: `Début du jeu de rôle : ${roleplay.title}`,
      },
      {
        role: 'system',
        content: roleplay.description,
      },
      {
        role: 'ai',
        content: getInitialMessage(roleplay.scenario, roleplay.discProfile),
      },
    ]);
  };

  const getInitialMessage = (scenario: string, discProfile: string) => {
    if (scenario === 'employee-stressed') {
      return "Bonjour... Désolé, je sais que j'ai fait des erreurs dernièrement. Je me sens dépassé par la charge de travail et j'ai du mal à maintenir les standards de qualité. Je ne sais pas ce qui ne va pas chez moi.";
    } else if (scenario === 'employee-disengaged') {
      return "Salut. Oui, je suis là. Il y a quelque chose dont vous aviez besoin ?";
    } else if (scenario === 'team-conflict') {
      return "Je ne pense pas pouvoir continuer à travailler avec eux. Nous avons des approches complètement différentes et cela cause des frictions constantes.";
    } else {
      return "Bien sûr, je peux m'en occuper. Que voulez-vous que je fasse ?";
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user' as const, content: userInput },
    ];
    setMessages(newMessages);
    setUserInput('');
    setIsEvaluating(true);

    // Simuler une réponse IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(userInput, currentRoleplay?.scenario || '');
      setMessages([
        ...newMessages,
        { role: 'ai' as const, content: aiResponse },
      ]);
      setIsEvaluating(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string, scenario: string) => {
    // Réponses IA fictives basées sur la qualité de l'entrée utilisateur
    const hasEmpathy = userMessage.toLowerCase().includes('comprend') || 
                       userMessage.toLowerCase().includes('ressens') ||
                       userMessage.toLowerCase().includes('apprécie');
    
    if (hasEmpathy) {
      return "Merci de comprendre. Cela aide vraiment. Je pense pouvoir travailler avec cette approche.";
    } else {
      return "Je vois. Je vais essayer de faire mieux.";
    }
  };

  const endRoleplay = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setMessages([
        ...messages,
        {
          role: 'system',
          content: 'Jeu de rôle terminé ! Génération de l\'évaluation...',
        },
      ]);
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'system',
            content: JSON.stringify({
              type: 'evaluation',
              scores: {
                empathy: 85,
                clarity: 78,
                actionPlan: 82,
              },
              feedback: 'Excellent travail pour démontrer de l\'empathie et de la compréhension. Votre communication était claire et vous avez fourni des étapes actionnables.',
            }),
          },
        ]);
        setIsEvaluating(false);
      }, 1500);
    }, 500);
  };

  if (!selectedRoleplay) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="mb-2">Laboratoire de Jeux de Rôle IA</h1>
          <p className="text-muted-foreground">
            Pratiquez des scénarios de gestion réels avec des simulations alimentées par l'IA
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Comment Ça Fonctionne</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Choisissez un scénario qui correspond à vos objectifs d'apprentissage</li>
                <li>• Engagez une conversation réaliste avec un membre d'équipe IA</li>
                <li>• Recevez un feedback instantané sur l'empathie, la clarté et la planification d'action</li>
                <li>• Apprenez à adapter votre style de communication aux différents profils DISC</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAIRoleplays.map((roleplay) => (
            <Card key={roleplay.id} className="hover:border-blue-300 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{roleplay.title}</CardTitle>
                  <Badge
                    variant="outline"
                    style={{
                      borderColor: discProfileInfo[roleplay.discProfile].color,
                      color: discProfileInfo[roleplay.discProfile].color,
                    }}
                  >
                    Profil {roleplay.discProfile}
                  </Badge>
                </div>
                <CardDescription>{roleplay.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {roleplay.estimatedTime} min
                    </div>
                    <Badge variant="secondary">{roleplay.difficulty}</Badge>
                  </div>
                </div>
                <Button className="w-full" onClick={() => startRoleplay(roleplay.id)}>
                  <Brain className="w-4 h-4 mr-2" />
                  Démarrer le Jeu de Rôle
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2">{currentRoleplay?.title}</h1>
          <p className="text-muted-foreground">
            Profil DISC : {currentRoleplay?.discProfile} - {discProfileInfo[currentRoleplay?.discProfile || 'D'].name}
          </p>
        </div>
        <Button variant="outline" onClick={() => setSelectedRoleplay(null)}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Quitter le Jeu de Rôle
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
            <CardDescription>Répondez naturellement comme vous le feriez dans une vraie situation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-96 max-h-96 overflow-y-auto space-y-4 border rounded-lg p-4 bg-gray-50">
              {messages.map((message, index) => {
                if (message.role === 'system') {
                  // Vérifier si c'est un message d'évaluation
                  if (message.content.startsWith('{')) {
                    try {
                      const evaluation = JSON.parse(message.content);
                      if (evaluation.type === 'evaluation') {
                        return (
                          <div key={index} className="bg-white border-2 border-green-200 rounded-lg p-4">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <Target className="w-5 h-5 text-green-600" />
                              Évaluation de Performance
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">Empathie</span>
                                  <span className="text-sm">{evaluation.scores.empathy}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${evaluation.scores.empathy}%` }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">Clarté</span>
                                  <span className="text-sm">{evaluation.scores.clarity}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${evaluation.scores.clarity}%` }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">Plan d'Action</span>
                                  <span className="text-sm">{evaluation.scores.actionPlan}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-purple-600 h-2 rounded-full"
                                    style={{ width: `${evaluation.scores.actionPlan}%` }}
                                  />
                                </div>
                              </div>
                              <Separator />
                              <p className="text-sm">{evaluation.feedback}</p>
                            </div>
                          </div>
                        );
                      }
                    } catch (e) {
                      // Pas JSON, afficher comme message système régulier
                    }
                  }
                  
                  return (
                    <div key={index} className="text-center">
                      <Badge variant="secondary">{message.content}</Badge>
                    </div>
                  );
                }

                return (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                );
              })}
              {isEvaluating && (
                <div className="flex justify-start">
                  <div className="max-w-md rounded-lg p-3 bg-white border border-gray-200">
                    <p className="text-sm text-muted-foreground">En train d'écrire...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Tapez votre réponse..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={handleSendMessage} disabled={!userInput.trim() || isEvaluating}>
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer
                </Button>
                <Button variant="outline" onClick={endRoleplay}>
                  Terminer et Évaluer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conseils</CardTitle>
            <CardDescription>Pour le Profil DISC {currentRoleplay?.discProfile}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Style de Communication</h4>
              <p className="text-sm text-muted-foreground">
                {discProfileInfo[currentRoleplay?.discProfile || 'D'].description}
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Forces</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {discProfileInfo[currentRoleplay?.discProfile || 'D'].strengths.map((strength) => (
                  <li key={strength}>• {strength}</li>
                ))}
              </ul>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium">Attention à</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {discProfileInfo[currentRoleplay?.discProfile || 'D'].challenges.map((challenge) => (
                  <li key={challenge}>• {challenge}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

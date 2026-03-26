import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { GraduationCap, Building2, User, Users, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface LoginScreenProps {
  onLogin: (role: 'hr' | 'manager' | 'trainer') => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<'hr' | 'manager' | 'trainer' | null>(null);

  const roles = [
    {
      id: 'hr' as const,
      title: 'RH / Admin',
      description: 'Gérez les équipes, assignez les formations et suivez les progrès',
      icon: Building2,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'manager' as const,
      title: 'Collaborateur',
      description: 'Accédez à votre tableau de bord personnalisé',
      icon: User,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      id: 'trainer' as const,
      title: 'Formateur',
      description: 'Téléchargez et gérez votre contenu de formation',
      icon: Users,
      gradient: 'from-teal-500 to-cyan-500',
    },
  ];

  const handleLogin = (role: 'hr' | 'manager' | 'trainer') => {
    toast.success('Connexion réussie !', {
      description: `Bienvenue sur votre espace ${role === 'hr' ? 'RH' : role === 'manager' ? 'Collaborateur' : 'Formateur'}.`,
      duration: 3000,
    });
    onLogin(role);
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-20"></div>
                <GraduationCap className="w-16 h-16 text-blue-600 relative" />
              </motion.div>
            </div>
            <h1 className="mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Talentium</h1>
            <p className="text-muted-foreground text-lg">
              Plateforme de formation professionnelle pour collaborateurs modernes ✨
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role, index) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="cursor-pointer transition-all border-2 hover:border-primary/50 hover:shadow-xl h-full relative overflow-hidden group"
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <CardHeader className="text-center relative z-10">
                      <div className="flex justify-center mb-4">
                        <div className={`p-4 bg-gradient-to-br ${role.gradient} rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <CardTitle className="text-xl">{role.title}</CardTitle>
                      <CardDescription className="min-h-12 text-base">
                        {role.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <Button className={`w-full shadow-md hover:shadow-lg transition-all bg-gradient-to-r ${role.gradient}`}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Continuer
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentRole = roles.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-full max-w-2xl shadow-xl border-2">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${currentRole?.gradient} rounded-full blur-lg opacity-30`}></div>
                <GraduationCap className="w-12 h-12 text-blue-600 relative" />
              </div>
            </div>
            <CardTitle className="text-2xl">Bienvenue sur Talentium</CardTitle>
            <CardDescription className="text-base">
              Connexion en tant que {selectedRole === 'hr' ? 'RH/Admin' : selectedRole === 'manager' ? 'Collaborateur' : 'Formateur'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={
                  selectedRole === 'hr'
                    ? 'rh@entreprise.com'
                    : selectedRole === 'manager'
                    ? 'collaborateur@entreprise.com'
                    : 'formateur@exemple.com'
                }
                className="transition-all focus:ring-2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" placeholder="••••••••" className="transition-all focus:ring-2" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 shadow-sm hover:shadow-md transition-all"
                onClick={() => setSelectedRole(null)}
              >
                Retour
              </Button>
              <Button
                className={`flex-1 shadow-md hover:shadow-lg transition-all bg-gradient-to-r ${currentRole?.gradient}`}
                onClick={() => handleLogin(selectedRole)}
              >
                Se connecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
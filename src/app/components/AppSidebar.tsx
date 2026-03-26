import { LayoutDashboard, BookOpen, Users, BarChart3, CreditCard, Settings, LogOut, Brain, GraduationCap, Upload, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface AppSidebarProps {
  role: 'hr' | 'manager' | 'trainer';
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function AppSidebar({ role, currentView, onViewChange, onLogout }: AppSidebarProps) {
  const hrMenu = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'managers', label: 'Gérer les Collaborateurs', icon: Users },
    { id: 'catalog', label: 'Catalogue de Formation', icon: BookOpen },
    { id: 'analytics', label: 'Analyses et Rapports', icon: BarChart3 },
    { id: 'licenses', label: 'Licences et Facturation', icon: CreditCard },
  ];

  const managerMenu = [
    { id: 'dashboard', label: 'Mon Tableau de bord', icon: LayoutDashboard },
    { id: 'courses', label: 'Mes Cours', icon: BookOpen },
    { id: 'catalog', label: 'Parcourir le Catalogue', icon: GraduationCap },
    { id: 'roleplay', label: 'Laboratoire de Jeux de Rôle IA', icon: Brain },
    { id: 'progress', label: 'Mon Progrès', icon: BarChart3 },
  ];

  const trainerMenu = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'courses', label: 'Mes Cours', icon: BookOpen },
    { id: 'upload', label: 'Télécharger un Cours', icon: Upload },
    { id: 'revenue', label: 'Revenus et Analyse', icon: DollarSign },
  ];

  const menu = role === 'hr' ? hrMenu : role === 'manager' ? managerMenu : trainerMenu;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="font-semibold">Talentium</h2>
            <p className="text-xs text-muted-foreground">
              {role === 'hr' ? 'Portail RH' : role === 'manager' ? 'Portail Collaborateur' : 'Portail Formateur'}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 p-4 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <Separator />

      <div className="p-4 space-y-1">
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="w-4 h-4 mr-3" />
          Paramètres
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-3" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}
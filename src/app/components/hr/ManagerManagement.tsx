import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { UserPlus, Search, Mail, CheckCircle2, ShoppingCart, Bell } from 'lucide-react';
import { mockCourses, discProfileInfo } from '../../data/mockData';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface ManagerManagementProps {
  collaborators: any[];
  onAddCollaborator: (collaborator: any) => void;
  onCollaboratorClick: (id: string) => void;
  onEnrollInCourse: (collaboratorId: string, courseId: string, deliveryType: 'presentiel' | 'distance') => void;
  courses: any[];
  trainingRequests: any[];
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
}

export function ManagerManagement({
  collaborators,
  onAddCollaborator,
  onCollaboratorClick,
  onEnrollInCourse,
  courses,
  trainingRequests,
  onApproveRequest,
  onRejectRequest,
}: ManagerManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [deliveryType, setDeliveryType] = useState<'presentiel' | 'distance'>('distance');
  const [newCollaborator, setNewCollaborator] = useState({
    name: '',
    email: '',
    department: '',
    discProfile: 'D' as 'D' | 'I' | 'S' | 'C',
    teamSize: 5,
    seniority: 'Manager',
  });

  const filteredCollaborators = collaborators.filter((collaborator) =>
    collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collaborator.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = trainingRequests.filter((req: any) => req.status === 'pending');

  const handleAddCollaborator = () => {
    if (!newCollaborator.name || !newCollaborator.email) {
      toast.error('Erreur', { description: 'Veuillez remplir tous les champs requis.' });
      return;
    }

    onAddCollaborator({
      ...newCollaborator,
      role: 'manager',
      organizationId: 'org1',
      industry: 'Technologie',
      teamDISCProfiles: ['D', 'I', 'S'],
      enrolledCourses: [],
      completedModules: [],
      badges: [],
    });

    setIsAddDialogOpen(false);
    setNewCollaborator({
      name: '',
      email: '',
      department: '',
      discProfile: 'D',
      teamSize: 5,
      seniority: 'Manager',
    });
  };

  const handlePurchaseCourse = () => {
    if (!selectedCollaborator || !selectedCourse) {
      toast.error('Erreur', { description: 'Veuillez sélectionner un collaborateur et une formation.' });
      return;
    }

    onEnrollInCourse(selectedCollaborator, selectedCourse, deliveryType);
    setIsPurchaseDialogOpen(false);
    setSelectedCollaborator('');
    setSelectedCourse('');
    setDeliveryType('distance');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="mb-2">Gérer les Collaborateurs</h1>
          <p className="text-muted-foreground">
            Invitez et gérez les collaborateurs de votre organisation
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="shadow-md hover:shadow-lg transition-all">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Acheter une Formation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Acheter une Formation pour un Collaborateur</DialogTitle>
                <DialogDescription>
                  Sélectionnez un collaborateur et une formation pour l'inscription
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Collaborateur</Label>
                  <Select value={selectedCollaborator} onValueChange={setSelectedCollaborator}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un collaborateur" />
                    </SelectTrigger>
                    <SelectContent>
                      {collaborators.map((collab) => (
                        <SelectItem key={collab.id} value={collab.id}>
                          {collab.name} - {collab.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Formation</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une formation" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title} - {course.price}€
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Type de formation</Label>
                  <Select
                    value={deliveryType}
                    onValueChange={(value: 'presentiel' | 'distance') => setDeliveryType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">À distance</SelectItem>
                      <SelectItem value="presentiel">En présentiel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full shadow-sm hover:shadow-md transition-all" onClick={handlePurchaseCourse}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Acheter et Inscrire
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-md hover:shadow-lg transition-all">
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter un Collaborateur
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouveau Collaborateur</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau collaborateur à votre organisation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom Complet</Label>
                  <Input
                    id="name"
                    placeholder="Jean Dupont"
                    value={newCollaborator.name}
                    onChange={(e) => setNewCollaborator({ ...newCollaborator, name: e.target.value })}
                    className="transition-all focus:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jean@entreprise.com"
                    value={newCollaborator.email}
                    onChange={(e) => setNewCollaborator({ ...newCollaborator, email: e.target.value })}
                    className="transition-all focus:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Input
                    id="department"
                    placeholder="Ingénierie"
                    value={newCollaborator.department}
                    onChange={(e) => setNewCollaborator({ ...newCollaborator, department: e.target.value })}
                    className="transition-all focus:ring-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profil DISC</Label>
                  <Select
                    value={newCollaborator.discProfile}
                    onValueChange={(value: 'D' | 'I' | 'S' | 'C') =>
                      setNewCollaborator({ ...newCollaborator, discProfile: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="D">D - Dominance</SelectItem>
                      <SelectItem value="I">I - Influence</SelectItem>
                      <SelectItem value="S">S - Stabilité</SelectItem>
                      <SelectItem value="C">C - Conscienciosité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full shadow-sm hover:shadow-md transition-all" onClick={handleAddCollaborator}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Ajouter le Collaborateur
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Demandes en attente */}
      {pendingRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-sm border-2 border-yellow-200 bg-yellow-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                Demandes de Formation en Attente
              </CardTitle>
              <CardDescription>Approuvez ou rejetez les demandes des collaborateurs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingRequests.map((request: any) => (
                <div key={request.id} className="flex items-center justify-between p-4 border-2 rounded-xl bg-white">
                  <div>
                    <p className="font-medium">{request.collaboratorName}</p>
                    <p className="text-sm text-muted-foreground">{request.courseTitle}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => onApproveRequest(request.id)}>
                      Approuver
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onRejectRequest(request.id)}>
                      Rejeter
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <Card className="shadow-sm border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Collaborateurs Actifs
            </CardTitle>
            <CardDescription>
              Gérez les membres de votre équipe et leur progrès
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des collaborateurs..."
                className="pl-10 transition-all focus:ring-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="border-2 rounded-xl overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead>Collaborateur</TableHead>
                    <TableHead>Profil DISC</TableHead>
                    <TableHead>Taille d'Équipe</TableHead>
                    <TableHead>Cours Inscrits</TableHead>
                    <TableHead>Achèvement</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCollaborators.map((collaborator, index) => {
                    const totalModules = collaborator.enrolledCourses.reduce((total: number, courseId: string) => {
                      const course = courses.find((c: any) => c.id === courseId);
                      return total + (course?.modules?.length || 0);
                    }, 0);
                    const completion = totalModules > 0
                      ? Math.round((collaborator.completedModules.length / totalModules) * 100)
                      : 0;

                    return (
                      <motion.tr
                        key={collaborator.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{collaborator.name}</p>
                            <p className="text-sm text-muted-foreground">{collaborator.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-medium"
                            style={{
                              borderColor: discProfileInfo[collaborator.discProfile].color,
                              color: discProfileInfo[collaborator.discProfile].color,
                            }}
                          >
                            {collaborator.discProfile} - {discProfileInfo[collaborator.discProfile].name}
                          </Badge>
                        </TableCell>
                        <TableCell>{collaborator.teamSize} membres</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{collaborator.enrolledCourses.length}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2.5 min-w-[80px]">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${completion}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full"
                              />
                            </div>
                            <span className="text-sm font-medium min-w-[45px]">{completion}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCollaboratorClick(collaborator.id)}
                          >
                            Voir Détails
                          </Button>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

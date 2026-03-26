import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { X, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface EditCourseDialogProps {
  isOpen: boolean;
  course: any;
  onClose: () => void;
  onSave: (updatedCourse: any) => void;
}

export function EditCourseDialog({ isOpen, course, onClose, onSave }: EditCourseDialogProps) {
  const [formData, setFormData] = useState<any>(null);
  const [selectedDISC, setSelectedDISC] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (course && isOpen) {
      setFormData({ ...course });
      setSelectedDISC(course.discRecommendations || []);
    }
  }, [course, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleDISC = (profile: string) => {
    if (selectedDISC.includes(profile)) {
      setSelectedDISC(selectedDISC.filter((p) => p !== profile));
    } else {
      setSelectedDISC([...selectedDISC, profile]);
    }
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Erreur', {
        description: 'Veuillez remplir les champs requis (titre, description, catégorie).',
      });
      return;
    }

    setIsSaving(true);
    try {
      const updatedCourse = {
        ...formData,
        discRecommendations: selectedDISC,
      };

      // Mettre à jour dans localStorage
      const allCourses = JSON.parse(localStorage.getItem('talentium_courses') || '[]');
      const updated = allCourses.map((c: any) =>
        c.id === course.id ? updatedCourse : c
      );
      localStorage.setItem('talentium_courses', JSON.stringify(updated));

      onSave(updatedCourse);
      toast.success('Cours mis à jour', {
        description: 'Les modifications ont été enregistrées avec succès.',
      });
      onClose();
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible de mettre à jour le cours.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(null);
    setSelectedDISC([]);
    onClose();
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le cours</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de votre cours
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre du cours *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Titre du cours"
              className="rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description du cours"
              rows={4}
              className="rounded-lg"
            />
          </div>

          {/* Catégorie et Prix */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Leadership">Leadership</SelectItem>
                  <SelectItem value="Gestion de Projet">Gestion de Projet</SelectItem>
                  <SelectItem value="Communication">Communication</SelectItem>
                  <SelectItem value="Ventes">Ventes</SelectItem>
                  <SelectItem value="Technique">Technique</SelectItem>
                  <SelectItem value="Ressources Humaines">Ressources Humaines</SelectItem>
                  <SelectItem value="Développement Personnel">Développement Personnel</SelectItem>
                  <SelectItem value="Général">Général</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Prix ($) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                placeholder="299"
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Profils DISC */}
          <div className="space-y-3">
            <Label>Profils DISC recommandés</Label>
            <div className="flex gap-2 flex-wrap">
              {['D', 'I', 'S', 'C'].map((profile) => (
                <div key={profile} className="flex items-center gap-2">
                  <Checkbox
                    id={`disc-${profile}`}
                    checked={selectedDISC.includes(profile)}
                    onCheckedChange={() => toggleDISC(profile)}
                  />
                  <Label htmlFor={`disc-${profile}`} className="cursor-pointer">
                    {profile}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-2">
            <Label>Modules ({formData.modules?.length || 0})</Label>
            <div className="bg-muted rounded-lg p-4">
              {formData.modules && formData.modules.length > 0 ? (
                <ul className="space-y-2">
                  {formData.modules.map((module: any, idx: number) => (
                    <li key={idx} className="text-sm p-2 bg-background rounded border border-border">
                      <span className="font-medium">{module.title || `Module ${module.type}`}</span>
                      <span className="text-muted-foreground ml-2">({module.type})</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Aucun module</p>
              )}
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Durée</p>
              <p className="font-semibold">{formData.duration?.toFixed(1)}h</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Inscrits</p>
              <p className="font-semibold">{formData.enrolledCount}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Note</p>
              <p className="font-semibold">⭐ {formData.rating}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="rounded-lg"
              disabled={isSaving}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-lg"
              style={{ backgroundColor: '#f4c11b', color: '#1a1410' }}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { CreditCard, Package, TrendingUp, Download, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LicensesBillingProps {
  totalLicenses: number;
  usedLicenses: number;
  collaborators: any[];
}

export function LicensesBilling({ totalLicenses, usedLicenses, collaborators }: LicensesBillingProps) {
  const availableLicenses = totalLicenses - usedLicenses;
  const usagePercentage = (usedLicenses / totalLicenses) * 100;

  const monthlyInvoices = [
    { month: 'Mars 2026', amount: 4500, status: 'paid', date: '01/03/2026', licenses: 50 },
    { month: 'Février 2026', amount: 4500, status: 'paid', date: '01/02/2026', licenses: 50 },
    { month: 'Janvier 2026', amount: 4200, status: 'paid', date: '01/01/2026', licenses: 47 },
    { month: 'Décembre 2025', amount: 3900, status: 'paid', date: '01/12/2025', licenses: 43 },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="mb-2">Licences et Facturation</h1>
        <p className="text-muted-foreground">
          Gérez vos licences et consultez votre historique de facturation
        </p>
      </motion.div>

      {/* Vue d'ensemble des licences */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Licences</CardTitle>
              <Package className="w-5 h-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalLicenses}</div>
              <p className="text-xs text-muted-foreground mt-1">Licences souscrites</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Licences Utilisées</CardTitle>
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{usedLicenses}</div>
              <p className="text-xs text-muted-foreground mt-1">Collaborateurs actifs</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Licences Disponibles</CardTitle>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{availableLicenses}</div>
              <p className="text-xs text-muted-foreground mt-1">Prêtes à attribuer</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Utilisation des licences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle>Utilisation des Licences</CardTitle>
            <CardDescription>
              Suivez l'utilisation de vos licences en temps réel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Taux d'utilisation</span>
                <span className="font-medium">{Math.round(usagePercentage)}%</span>
              </div>
              <Progress value={usagePercentage} className="h-3" />
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalLicenses}</div>
                <p className="text-xs text-muted-foreground mt-1">Total</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{usedLicenses}</div>
                <p className="text-xs text-muted-foreground mt-1">Utilisées</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{availableLicenses}</div>
                <p className="text-xs text-muted-foreground mt-1">Disponibles</p>
              </div>
            </div>

            {availableLicenses < 10 && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Attention :</strong> Il vous reste moins de 10 licences disponibles.
                  Pensez à augmenter votre forfait pour accueillir plus de collaborateurs.
                </p>
              </div>
            )}

            <Button className="w-full shadow-md hover:shadow-lg transition-all">
              <Package className="w-4 h-4 mr-2" />
              Acheter Plus de Licences
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan actuel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-2 shadow-sm bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Plan Actuel
            </CardTitle>
            <CardDescription>Abonnement entreprise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Type d'abonnement</p>
                <p className="text-lg font-semibold">Plan Entreprise</p>
              </div>
              <Badge variant="default" className="bg-blue-600">Actif</Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Prix par licence/mois</p>
                <p className="text-xl font-bold">90€</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total mensuel</p>
                <p className="text-xl font-bold">{totalLicenses * 90}€</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">Prochaine facturation</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">01 Avril 2026</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                Modifier le Plan
              </Button>
              <Button variant="outline" className="flex-1">
                Gérer le Paiement
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Historique de facturation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle>Historique de Facturation</CardTitle>
            <CardDescription>
              Consultez et téléchargez vos factures passées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyInvoices.map((invoice, index) => (
                <motion.div
                  key={invoice.month}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                  className="flex items-center justify-between p-4 border-2 rounded-xl hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{invoice.month}</p>
                      <p className="text-sm text-muted-foreground">
                        {invoice.licenses} licences · Payé le {invoice.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold">{invoice.amount}€</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {invoice.status === 'paid' ? 'Payé' : 'En attente'}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

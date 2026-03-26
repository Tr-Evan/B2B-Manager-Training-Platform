import { mockCourses } from '../data/mockData';

/**
 * Charge tous les courses (mock + courses créés par les formateurs)
 * @returns Liste complète de tous les courses
 */
export function loadAllCourses(): any[] {
  let courses = [...mockCourses];
  
  try {
    const customCourses = JSON.parse(localStorage.getItem('talentium_courses') || '[]');
    // Filtrer pour éviter les doublons (courses créés par les formateurs seulement)
    const trainerCustomCourses = customCourses.filter((c: any) => c.trainerId === 'trainer-custom');
    courses = [...courses, ...trainerCustomCourses];
  } catch (error) {
    console.error('Erreur lors du chargement des courses personnalisés:', error);
  }
  
  return courses;
}

/**
 * Cherche un course par son ID dans tous les courses disponibles
 * @param courseId ID du course
 * @returns Le course trouvé ou undefined
 */
export function findCourse(courseId: string): any {
  const allCourses = loadAllCourses();
  return allCourses.find(c => c.id === courseId);
}

/**
 * Récupère toutes les catégories disponibles
 * @returns Liste des catégories uniques
 */
export function getAvailableCategories(): string[] {
  const allCourses = loadAllCourses();
  return ['all', ...Array.from(new Set(allCourses.map(c => c.category)))];
}

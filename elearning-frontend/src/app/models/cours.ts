import { Etudiant } from './etudiant';
import { Professeur } from './professeur';

export interface Cours {
	id: number;
	titre: string;
	description: string;
	contenu?: string;
	niveau?: string;
	professeur?: Professeur;
	etudiants?: Etudiant[];
}

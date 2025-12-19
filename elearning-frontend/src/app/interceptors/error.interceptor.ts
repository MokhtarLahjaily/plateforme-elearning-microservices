import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Une erreur inconnue est survenue';

            if (error.error instanceof ErrorEvent) {
                // Erreur côté client
                errorMessage = `Erreur: ${error.error.message}`;
            } else {
                // Erreur côté serveur
                switch (error.status) {
                    case 0:
                        errorMessage = 'Erreur CORS ou serveur inaccessible';
                        break;
                    case 401:
                        errorMessage = 'Session expirée, veuillez vous reconnecter';
                        break;
                    case 403:
                        errorMessage = 'Accès refusé (403 Forbidden)';
                        break;
                    case 404:
                        errorMessage = 'Ressource non trouvée';
                        break;
                    case 409:
                        errorMessage = 'Conflit: l\'élément est probablement lié à d\'autres données';
                        break;
                    case 500:
                        errorMessage = 'Erreur interne du serveur (500)';
                        break;
                    default:
                        errorMessage = `Code: ${error.status} - ${error.message}`;
                }
            }

            // Utilisation d'une simple alerte pour le feedback immédiat 
            // (Peut être remplacé par un service de notification type Toastr)
            alert(errorMessage);

            return throwError(() => error);
        })
    );
};

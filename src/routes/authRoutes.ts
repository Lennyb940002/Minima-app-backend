import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

const authRouter = Router();

// Middleware pour le débogage
authRouter.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`Requête Auth : ${req.method} ${req.url}`);
  console.log('En-têtes :', req.headers);
  console.log('Corps de la requête :', req.body);
  next();
});

// Route pour la connexion (login)
authRouter.post('/login', (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    try {
      const { email, password } = req.body;

      // Validation des champs
      if (!email || !password) {
        return res.status(400).json({
          error: 'L\'email et le mot de passe sont requis'
        });
      }

      // Appel à la méthode login du service AuthService
      const result = await AuthService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      return res.status(401).json({
        error: error instanceof Error ? error.message : 'Échec de l\'authentification'
      });
    }
  })().catch(next);
});

// Route pour l'inscription (register)
authRouter.post('/register', (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    try {
      const { email, password } = req.body;

      // Validation des champs
      if (!email || !password) {
        return res.status(400).json({
          error: 'L\'email et le mot de passe sont requis'
        });
      }

      // Appel à la méthode register du service AuthService
      const result = await AuthService.register(email, password);
      return res.status(201).json(result);
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      return res.status(400).json({
        error: error instanceof Error ? error.message : 'Échec de l\'inscription'
      });
    }
  })().catch(next);
});

export { authRouter };

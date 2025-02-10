import { Router, Response } from 'express';
import { auth } from '../middleware/auth';
import { DeclarationService } from '../services/declarationService';
import { AuthRequest } from '../types/auth';

// Initialisation du routeur
export const declarationRouter = Router();

// Middleware d'authentification
declarationRouter.use(auth);

// Route pour mettre à jour le statut d'une déclaration
declarationRouter.put('/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { isPaid } = req.body;

        // Validation basique
        if (typeof isPaid !== 'boolean') {
            res.status(400).json({
                error: 'isPaid must be a boolean value'
            });
            return;
        }

        // Validation du format de l'ID (YYYY-MM)
        if (!/^\d{4}-\d{2}$/.test(id)) {
            res.status(400).json({
                error: 'Invalid declaration ID format. Expected YYYY-MM'
            });
            return;
        }

        const updatedSales = await DeclarationService.updateStatus(id);

        if (!updatedSales) {
            res.status(404).send({ error: 'Sales not found for the given declaration date' });
            return;
        }
        res.status(200).json(updatedSales);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});
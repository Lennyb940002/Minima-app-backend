import mongoose, { Document, Schema } from 'mongoose';

// Interface pour une déclaration
export interface IDeclaration extends Document {
    userId: mongoose.Types.ObjectId;
    date: string;
    amount: number;
    payment: number;
    isPaid: boolean;
    paidAt?: Date;
    movedToHistory?: boolean;
}

// Schéma pour une déclaration
const declarationSchema = new Schema<IDeclaration>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false,
        required: true
    },
    paidAt: {
        type: Date,
        required: false
    },
    movedToHistory: {
        type: Boolean,
        default: false
    }
});

// Modèle pour une déclaration
export const Declaration = mongoose.model<IDeclaration>('Declaration', declarationSchema);
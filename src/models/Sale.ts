import mongoose, { Document, Schema } from 'mongoose';

export interface ISale extends Document {
    userId: mongoose.Types.ObjectId;
    product: string;
    quantity: number;
    salePrice: number;
    unitCost: number;
    paymentStatus: 'En attente' | 'Effectué' | 'Annulé';
    date: Date;
    margin: number;
    decStatus: number;
}

const saleSchema = new Schema<ISale>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        required: true
    },
    unitCost: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['En attente', 'Effectué', 'Annulé']
    },
    date: {
        type: Date,
        default: Date.now
    },
    margin: {
        type: Number,
        required: true
    },
    decStatus: {
        type: Number,
        required: true,
        default: 1
    }
});

// Middleware pre-save pour s'assurer que decStatus est toujours défini
saleSchema.pre('save', function (next) {
    if (this.decStatus === undefined) {
        this.decStatus = 1;
    }
    next();
});

const Sale = mongoose.model<ISale>('Sale', saleSchema);

// Export uniquement du modèle Sale car ISale est déjà exporté
export { Sale };
import mongoose, { Document, Schema } from 'mongoose';

export interface IStock extends Document {
    userId: mongoose.Types.ObjectId;
    reference: string;
    name: string;
    category: string;
    quantity: number;
    minQuantity: number;
    unitPrice: number;
    salePrice: number;
    threshold: number;
    price?: number;
    description?: string;
}

const stockSchema = new Schema<IStock>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    minQuantity: {
        type: Number,
        required: true,
        default: 5
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    salePrice: {
        type: Number,
        required: true,
        min: 0
    },
    threshold: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        min: 0
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

stockSchema.index({ userId: 1, reference: 1 }, { unique: true });

export const Stock = mongoose.model<IStock>('Stock', stockSchema);
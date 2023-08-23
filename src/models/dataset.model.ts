// exampleModel.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface Event extends Document {
    gameID: number;
    title: string;
    platform: string;
    userID: Schema.Types.UUID;
    action: string;
    price?: number;
}

export interface Game {
    gameID: number;
    title: string;
}

const eventSchema = new Schema<Event>({
    gameID: { type: Number, required: true },
    title: { type: String, required: true },
    platform: { type: String, required: true },
    userID: { type: Schema.Types.UUID, required: true },
    action: { type: String, required: true },
    price: { type: Number },
});

export default mongoose.model<Event>('event', eventSchema);

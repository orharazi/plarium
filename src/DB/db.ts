import mongoose from 'mongoose';

class MongoDBConnection {
    private uri: string;

    constructor(uri: string | undefined) {
        if (!uri) {
            throw Error('no mongoDB uri given, plaese add valid DB_URI as env');
        } else {
            this.uri = uri;
        }
    }

    async connect(): Promise<void> {
        try {
            await mongoose.connect(this.uri);
            console.log('Connected to MongoDB!');
        } catch (error) {
            throw Error(`MongoDB connection error: ${error}`);
        }
    }
}

export default MongoDBConnection;

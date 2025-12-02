const mongoose = require('mongoose');

async function connectToMongoDB(url){
    try {
        // console.log('🔌 Attempting to connect to MongoDB...');
        // console.log('📍 Connection URL:', url.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
        
        await mongoose.connect(url);
        
        // console.log('✅ MongoDB Connected Successfully!');
        // console.log('📊 Database Name:', mongoose.connection.db.databaseName);
        // console.log('📊 Connection Host:', mongoose.connection.host);
        // console.log('📊 Connection Port:', mongoose.connection.port);
        
        // const collections = await mongoose.connection.db.listCollections().toArray();
        // console.log('📦 Available Collections:', collections.map(c => c.name));
        
        return mongoose.connection;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        throw error;
    }
}

module.exports={
    connectToMongoDB
}

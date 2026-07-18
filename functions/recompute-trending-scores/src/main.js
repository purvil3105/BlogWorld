import { Client, Databases, Query } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
    // These environment variables need to be set in the Appwrite Function settings
    const endpoint = process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
    const projectId = process.env.APPWRITE_PROJECT_ID;
    const apiKey = process.env.APPWRITE_API_KEY; 
    const databaseId = process.env.DATABASE_ID;
    const collectionId = process.env.COLLECTION_ID; // The posts collection ID

    if (!projectId || !apiKey || !databaseId || !collectionId) {
        error("Missing required environment variables.");
        return res.json({ success: false, error: "Missing environment variables" }, 500);
    }

    const client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId)
        .setKey(apiKey);

    const databases = new Databases(client);

    try {
        // Fetch all active posts to recalculate
        const postsResponse = await databases.listDocuments(
            databaseId,
            collectionId,
            [
                Query.equal('status', 'active'),
                Query.limit(500)
            ]
        );

        log(`Found ${postsResponse.documents.length} posts to evaluate.`);

        let updatedCount = 0;

        for (const post of postsResponse.documents) {
            const likesCount = post.likes ? post.likes.length : 0;
            let commentsCount = 0;
            
            if (post.comments) {
                try {
                    commentsCount = JSON.parse(post.comments).length;
                } catch (e) {
                    commentsCount = 0;
                }
            }
            
            const publishedDate = new Date(post.$createdAt);
            const now = new Date();
            const hoursSincePublish = Math.max(0, (now - publishedDate) / (1000 * 60 * 60));

            // Trending Formula: (Likes * 3) + (Comments * 5) - (Hours * 0.5)
            let trendingScore = Math.floor((likesCount * 3) + (commentsCount * 5) - (hoursSincePublish * 0.5));
            if (trendingScore < 0) trendingScore = 0;

            if (post.trendingScore !== trendingScore) {
                await databases.updateDocument(
                    databaseId,
                    collectionId,
                    post.$id,
                    {
                        trendingScore: trendingScore
                    }
                );
                updatedCount++;
            }
        }

        log(`Successfully recomputed trending scores. Updated ${updatedCount} posts.`);
        return res.json({ success: true, evaluated: postsResponse.documents.length, updated: updatedCount });

    } catch (err) {
        error("Error recomputing scores: " + err.message);
        return res.json({ success: false, error: err.message }, 500);
    }
};

const { TwitterApi } = require('twitter-api-v2');

const client = new TwitterApi({
    appKey: 'aMoDoA0hC8uS65W2w0zISng3C',
    appSecret: 'ir2ZwITXawJi61yEcaVz9XJXiFJ7e903DiUjRtReIJ24n0pg2D',
    // accessToken: '1646126158893953025-ele2w4Itqs3KtJp065Dusat2Ojied2',
    // accessSecret: 'n83cYCVzv7fpghHulbjGh4ztzsPGotPtxIsKWFuvdHS1z'
});

// const twitterRwClient = twitter.readWrite;

// module.exports = twitterRwClient;

const v2Client = twitterRwClient.v2;

// const timeline = async () => {
//     try {
//         const homeTimeline = await twitterRwClient.v2.homeTimeline({ exclude: 'replies' });
//         console.log(homeTimeline);
//     } catch (error) {
//         console.log(error);
//     }
// };

// timeline();

const results = async () => {
    const { access_token } = await client.bearerToken.request();

    const response = await client.v2.searchAll({
        query: '#nodejs',
        max_results: 10,
        expansions: ['author_id'],
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });

    console.log(response);
};

results();
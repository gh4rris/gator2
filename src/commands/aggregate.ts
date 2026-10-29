import { fetchFeed } from "../rss";
import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { createPost } from "../lib/db/queries/posts";
import { parseDuration } from "../lib/utils";


export async function handlerAggregate(cmdName: string, ...args: string[]): Promise<void> {
    if (args.length === 0) {
        throw new Error(`${cmdName} requires time_between_reqs`);
    }

    const timeArg = args[0];
    const timeBetweenRequests = parseDuration(timeArg);
    if (!timeBetweenRequests) {
        throw new Error(`Invalid duration: ${timeArg} - use format 1h 30m 15s or 3500ms`);
    }

    console.log(`Collecting feeds every ${timeArg}...`);

    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenRequests);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        })
    })
}


export async function scrapeFeeds(): Promise<void> {
    const nextFeed = await getNextFeedToFetch();
    if (!nextFeed) {
        throw new Error(`No next feed found`);
    }

    const rssFeed = await fetchFeed(nextFeed.url);
    if (!rssFeed) {
        throw new Error(`Error fetching feed: ${nextFeed.url}`);
    }

    const markedFeed = await markFeedFetched(nextFeed.id);
    if (!markedFeed) {
        throw new Error(`Error marking feed: ${nextFeed.name}`);
    }

    if (rssFeed.channel.item.length === 0) {
        console.log("No feed items");
        return;
    }

    for (const item of rssFeed.channel.item) {
        const date = new Date(item.pubDate);
        await createPost(markedFeed.id, item.title, item.link, item.description, date);
        console.log(`* ${item.title}`);
    }

}

function handleError(err: unknown) {
    console.error(`Error scraping feeds: ${err instanceof Error ? err.message : err}`);
}


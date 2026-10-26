import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};


export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    const response = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator"
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch RSS Feed ${response.status}: ${response.statusText}`)
    }

    const rssString = await response.text();
    const parser = new XMLParser({processEntities: false});
    const rssFeed = parser.parse(rssString);
    
    const channel = rssFeed.rss?.channel;
    if (!channel ||
        !channel.title ||
        !channel.link ||
        !channel.description) {
        throw new Error("Failed to parse channel")
    }

    const items = Array.isArray(channel.item) ? channel.item : [channel.item];

    const rssItems: RSSItem[] = [];
    for (const item of items) {
        if (!item.title || !item.link || !item.description || !item.pubDate) {
            continue
        }
        rssItems.push({
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate
        });
    };

    const rss: RSSFeed = {
        channel: {
            title: channel.title,
            link: channel.link,
            description: channel.description,
            item: rssItems
        }
    };

    return rss;
    
}


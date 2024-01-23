import axios from 'axios';
import { load } from 'cheerio';
import { URL } from 'url';

const MAX_DEPTH = 1;

function getWebpageContent(url: string): Promise<string> {
    return axios.get(url, { timeout: 5000 }).then(({ data }) => data).catch((err) => { console.log(err); return ''; });
};

function getWebpageLinks(content: string, url: string): Promise<Set<string>> {
    const $ = load(content);
    const links = new Set<string>();
    const baseUrl = new URL(url).origin;

    $('a').each((index, element) => {
        const href = $(element).attr('href');
        if (href) {
            const parsedUrl = new URL(href, baseUrl);
            if (parsedUrl.origin === baseUrl) {
                links.add(parsedUrl.href);
            }
        }
    });

    return Promise.resolve(links);
}

async function crawlPage(url: string, word: string, depth: number, crawledUrls: Record<string, string> = {}): Promise<Record<string, string>> {
    const pageContent = await getWebpageContent(url);
    const links = await getWebpageLinks(pageContent, url);
    const wordMatches = findWordAndItsContextInDocumentText(pageContent, word);
    crawledUrls[url] = wordMatches?.[0] || '';

    if (depth === 0) {
        return crawledUrls;
    }

    const promises: Promise<Record<string, string>>[] = [];
    for (const link of links) {
        if (!(link in crawledUrls)) {
            console.log(`Crawling ${link}`);
            promises.push(crawlPage(link, word, depth - 1, crawledUrls));
        }
    }

    await Promise.all(promises);

    return crawledUrls;
}

function findWordAndItsContextInDocumentText(document: string, word: string) {
    const content = load(document)('body').text();
    const regex = new RegExp(`((?:[^.!?]*[.!?])?[^.!?]*\\b${word}\\b[^.!?]*[.!?](?:[^.!?]*[.!?])?)`, 'gi');
    const matches = content.match(regex);

    // Exclude matches with JSON symbols
    const filteredMatches = matches ? matches.filter(match => !/[{}[\]]/.test(match)) : [];

    return filteredMatches;
}

export async function crawler(site: string, word: string, depth?: string) {
    const crawlResults = await crawlPage(site, word, depth !== undefined ? +depth : MAX_DEPTH);

    const results = Object.fromEntries(Object.entries(crawlResults).filter(([url, wordMatch]) => {
        return wordMatch !== '';
    }));

    return results;
};

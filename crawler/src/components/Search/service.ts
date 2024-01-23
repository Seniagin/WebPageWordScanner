import axios from 'axios';

const SEARCH_API_ENDPOINT = 'https://3gdfm98muh.execute-api.us-east-1.amazonaws.com/'; // crawler-sls deployment result


export async function searchForWordInSite(site: string, word: string, depth: number): Promise<{ err: null | unknown, data: Record<string, string> | null }> {
    try {
        const {
            data
        } = await axios.get(`${SEARCH_API_ENDPOINT}?site=${site}&word=${word}&depth=${depth}`);
        return ({ err: null, data });
    } catch (err: unknown) {
        return ({ err, data: null });
    }
}
import PageScrapingHandler from '../classes/PageScrapingHandler';
import type { Actions } from './$types';

export const actions = {
	default: async ({ request }) => {
        const data = await request.formData();
        const url = data.get('url') as string;

        let scrapedBody;

		scrapedBody = await PageScrapingHandler.scrapPage(url).then((body) => body);

        return { success: true, scrapedBody }
	}
} satisfies Actions;
import { Client } from "@notionhq/client";
import { DatabasesQueryParameters } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export async function getDatabase(
  databaseId: string,
  options: Omit<DatabasesQueryParameters, "database_id"> = {}
) {
  const response = await notion.databases.query({
    ...options,
    database_id: databaseId,
  });
  return response.results;
}

const uuid4v =
  /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

export async function getPage(pageId: string) {
  if (uuid4v.test(pageId)) {
    try {
      const response = await notion.pages.retrieve({ page_id: pageId });
      return response;
    } catch (error) {
      // TODO: Maybe log these?
      return null;
    }
  }

  return null;
}

export async function getBlocks(blockId: string) {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  });
  return response.results;
}

import { remark } from "remark";
import html from "remark-html";
import breaks from "remark-breaks";

export async function mdToHtml(src: string) {
	const file = await remark().use(breaks).use(html).process(src);
	return file.toString();
}

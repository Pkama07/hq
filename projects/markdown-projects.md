# Markdown Pages for Projects

[github_url]: <> (https://github.com/Pkama07/hq)

- I want to add blogs to my personal website where I can paste in the raw notes that I take on the projects that I work on
- these notes are written in obsidian in markdown on my computer
- In order to be rendered on the user's browser, they must be converted to HTML, whether that conversion happens at runtime (i.e. when the user makes a request to a blog endpoint) or at compile time (when `next build` runs, meaning all the HTML sits ready)
- since the markdown files are static, it makes sense to do this at compile time; there's no reason to re-generate the same file every time a request is made

### SSG vs SSR

- In SSG (static site generation), the HTML is generated at build time
- In SSR (server side rendering) processing happens on the server side rather than the client side (on the user's browser), can lead to a faster feel for the user (compared to client side rendering) because they don't need to wait for JS parsing or network requests to resolve
- Obviously, SSG is more efficient; we don't need to recompile these pages every time if they always produce the same result, so we can just return the HTML as is which will be faster
- So SSG is the strategy we should take

### Using SSG

- https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation
- In our case, it's not like we have a completely static page page which can be easily converted to HTML because it has no external data dependencies (in this case, next.js would automatically convert it to HTML); rather, the content which is to be converted to HTML is the set of md files that sit in the `blogs` path of the personal website or whatever
- there are two scenarios next.js supports: page content depending on external data, and page paths depending on external data
- In our case, it's both; the paths that exist on the website as well as the actual content which is rendered on the corresponding pages depends on external (but static) data
- so we can use `getStaticProps` which gets called at build time and lets you pass the fetched data into the props of the component
- we can also use `getStaticPaths` which gets called at build time and lets you specify which paths you want to pre-render
- actually, `generateStaticParams` replaces `getStaticPaths` in the app router
- Basically exporting this function tells next.js that this function should be used to add some fields to the `params` of the component in that page

The ultimate version of this would be I have some directory somewhere in my project, and as I add new .md files to the directory, they automatically get added as endpoints and also appear in a list on the main page of the website. Some kind of special character can also be included in the text in the md file which indicates the git repo. We can use the title text of the md file as the title that is shown on the main page of the website.

The markdown should be perfectly rendered on the website, not this shitty stuff that gpt just showed me.

Furthermore, if there are screenshots or other media, I want that to get translated over too. Ideally I'd write some kind of bash script that I can run where I pass the filepath to the md file which I want to turn into an endpoint, and it copies over all of the relevant assets.

First thing to tackle is proper markdown rendering. One of the issues that I'm facing is that lists are being displayed as regular text with no bullet points and no indentation. This makes the notes basically unreadable. Looking at the HTML rendered in DevTools, it looks like these lines indented with the dash are correctly being converted to list elements. However, according to GPT this is due to some processing that Tailwind does behind the scenes. We can modify the `mdx-components.tsx` to add `list-disc` to the class of the unordered lists. After adding it, it's adding the bullet point, but it's not indenting it.

After adding some styling to the different tags with the `mdx-components.tsx` file, we got something that looks like decent markdown.

Now, the next step is to auto-generate links to these endpoints on the main page of the website.

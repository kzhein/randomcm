import { Handlers } from "$fresh/server.ts";
import { parseHTML } from "npm:linkedom@0.16.8/worker";

const getRandomContent = async () => {
  const html = await fetch(`https://channelmyanmar.org?${Math.random()}`).then((
    res,
  ) => res.text());
  const { document } = parseHTML(html);

  const content = [...document.querySelectorAll("#slider1 .item")].map(
    (el) => ({
      title: el.querySelector(".ttps").textContent.trim(),
      year: el.querySelector(".ytps")?.textContent?.trim(),
      poster: el.querySelector("img").src,
      link: el.querySelector("a").href,
    }),
  );

  return content;
};

export const handler: Handlers = {
  async GET(_req, ctx) {
    const contentArr = (await Promise.all(
      Array.from({ length: 4 }).map(() => getRandomContent()),
    )).flat();

    const contentSet = new Set(
      contentArr.map((ct) => JSON.stringify(ct)),
    ); // remove duplicates if there are any

    const content = [];
    contentSet.forEach((ct) => {
      content.push(JSON.parse(ct));
    });

    return ctx.render(content);
  },
};

export default function Home({ data: content }) {
  return (
    <div className="container">
      <h1 className="text-center my-3">Random content from CM 🎲</h1>
      <div className="row">
        {content.map((ct) => (
          <div className="col-6 col-md-3 col-lg-2 my-2">
            <a href={ct.link} target="_blank">
              <img
                src={ct.poster ||
                  "https://channelmyanmar.org/wp-content/uploads/2018/12/44196111_2314620771886952_165796934605340672_n-4.jpg"}
                alt={ct.title}
                height={180}
                style="object-fit: contain; width: 100%;"
              />
              <p className="mt-2 text-center">{ct.title}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

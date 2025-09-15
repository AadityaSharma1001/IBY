import fetch from "node-fetch";

export async function fetchSemanticScholar(query) {
  try {
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=5&fields=title,url,abstract`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data?.map(p => ({
      title: p.title,
      link: p.url,
      abstract: p.abstract
    })) || [];
  } catch (e) {
    console.error("SemanticScholar error", e);
    return [];
  }
}

export async function fetchArxiv(query) {
  try {
    const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=5`;
    const res = await fetch(url);
    const text = await res.text();

    // Fixed regex (removed extra backslashes)
    const entries = [...text.matchAll(/<title>(.*?)<\/title>/g)].map(m => m[1]).slice(1);
    const links = [...text.matchAll(/<id>(.*?)<\/id>/g)].map(m => m[1]).slice(1);

    return entries.map((title, i) => ({
      title,
      link: links[i],
      abstract: ""
    }));
  } catch (e) {
    console.error("Arxiv error", e);
    return [];
  }
}

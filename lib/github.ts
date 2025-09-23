export async function validateRepoAccess(pat: string, owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: { Authorization: `token ${pat}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Invalid PAT or repository access");
  }
  return true;
}

export async function createIssue({
  pat,
  owner,
  repo,
  title,
  body,
}: {
  pat: string;
  owner: string;
  repo: string;
  title: string;
  body: string;
}) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `token ${pat}`,
      Accept: "application/vnd.github.v3+json",
    },
    body: JSON.stringify({ title, body, labels: ["bug", "via-koustos"] }),
  });
  if (!res.ok) throw new Error(`GitHub issue failed: ${res.status}`);
  return (await res.json()) as { number: number; html_url: string };
}



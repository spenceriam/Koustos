export function IssuePreview({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-slate-50 border rounded p-3">
      <div className="font-semibold mb-2 text-sm">{title || "Issue Title"}</div>
      <pre className="whitespace-pre-wrap text-sm">{body}</pre>
    </div>
  );
}



"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createCommentAction } from "@/lib/actions/comments";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  author_name: string;
};

export function CommentThread({
  projectId,
  initialComments,
}: {
  projectId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit() {
    if (!text.trim()) return;
    const optimistic: Comment = {
      id: crypto.randomUUID(),
      content: text,
      created_at: new Date().toISOString(),
      author_name: "You",
    };
    setComments((prev) => [...prev, optimistic]);
    const content = text;
    setText("");
    startTransition(async () => {
      const result = await createCommentAction(projectId, content);
      if (result && "error" in result) toast.error(result.error);
    });
  }

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <Card className="p-8 text-center text-sm text-secondary">
          No comments yet.
        </Card>
      ) : (
        <Card className="divide-y divide-slate-100">
          {comments.map((c) => (
            <div key={c.id} className="px-5 py-3">
              <p className="text-sm text-slate-900">{c.content}</p>
              <p className="mt-1 text-xs text-secondary">
                {c.author_name} · {new Date(c.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </Card>
      )}

      <div className="flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment…"
          rows={2}
          className="block w-full rounded-lg border border-slate-200 bg-surface-container-lowest px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <Button type="button" onClick={handleSubmit} disabled={pending}>
          Post
        </Button>
      </div>
    </div>
  );
}

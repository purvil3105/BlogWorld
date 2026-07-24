export const writerChatResponseSchema = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["asking", "ready"] },
    reply: { type: "string" },
    draft: {
      type: "object",
      nullable: true,
      properties: {
        title: { type: "string" },
        slug: { type: "string" },
        category: { type: "string" },
        contentHtml: { type: "string" },
        tags: { type: "array", items: { type: "string" } },
        metaDescription: { type: "string" },
        imagePrompt: { type: "string" },
      },
      required: ["title", "slug", "category", "contentHtml", "tags", "metaDescription", "imagePrompt"],
    },
  },
  required: ["status", "reply"],
};

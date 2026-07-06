import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import generateWordDocument from "../../functions/generateDocument/1.0/index.js";

describe("generateWordDocument", () => {
  const originalGenerateDocx = global.generateDocx;
  const originalStoreFile = global.storeFile;

  beforeEach(() => {
    global.generateDocx = vi.fn().mockResolvedValue(Buffer.from("docx-buffer"));
    global.storeFile = vi.fn().mockResolvedValue("file-reference-id");
  });

  afterEach(() => {
    global.generateDocx = originalGenerateDocx;
    global.storeFile = originalStoreFile;
    vi.restoreAllMocks();
  });

  it("generates a document and stores it on the happy path", async () => {
    const out = await generateWordDocument({
      publicTemplateUrl: "https://example.com/template.docx",
      model: { name: "MyModel" },
      property: [{ name: "myProperty" }],
      fileName: "result.docx",
      variables: [{ key: "firstName", value: "Jane" }],
    });

    expect(out).toEqual({ result: "file-reference-id" });

    expect(global.generateDocx).toHaveBeenCalledTimes(1);
    expect(global.generateDocx).toHaveBeenCalledWith(
      "https://example.com/template.docx",
      { firstName: "Jane" },
      { linebreaks: true, paragraphLoop: true },
    );

    expect(global.storeFile).toHaveBeenCalledTimes(1);
    expect(global.storeFile).toHaveBeenCalledWith("MyModel", "myProperty", {
      contentType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      extension: "docx",
      fileName: "result.docx",
      fileBuffer: Buffer.from("docx-buffer"),
    });
  });

  it("merges variables, commentMap and changesMap into a single object", async () => {
    await generateWordDocument({
      publicTemplateUrl: "https://example.com/template.docx",
      model: { name: "MyModel" },
      property: [{ name: "myProperty" }],
      fileName: "result.docx",
      variables: [{ key: "firstName", value: "Jane" }],
      commentMap: { comment: "Looks good" },
      changesMap: { changed: true },
    });

    expect(global.generateDocx).toHaveBeenCalledWith(
      "https://example.com/template.docx",
      { firstName: "Jane", comment: "Looks good", changed: true },
      { linebreaks: true, paragraphLoop: true },
    );
  });

  it("defaults variables, commentMap and changesMap when omitted", async () => {
    await generateWordDocument({
      publicTemplateUrl: "https://example.com/template.docx",
      model: { name: "MyModel" },
      property: [{ name: "myProperty" }],
      fileName: "result.docx",
    });

    expect(global.generateDocx).toHaveBeenCalledWith(
      "https://example.com/template.docx",
      {},
      { linebreaks: true, paragraphLoop: true },
    );
  });

  it("throws error when model is missing", async () => {
    await expect(
      generateWordDocument({
        property: [{ name: "myProperty" }],
        fileName: "result.docx",
      }),
    ).rejects.toThrow("Generate Word Document: 'model' is required!");

    expect(global.generateDocx).not.toHaveBeenCalled();
  });

  it("throws error when model is undefined", async () => {
    await expect(
      generateWordDocument({
        model: undefined,
        property: [{ name: "myProperty" }],
      }),
    ).rejects.toThrow("Generate Word Document: 'model' is required!");
  });

  it("throws error when property is missing", async () => {
    await expect(
      generateWordDocument({
        model: { name: "MyModel" },
        fileName: "result.docx",
      }),
    ).rejects.toThrow("Generate Word Document: 'property' is required!");

    expect(global.generateDocx).not.toHaveBeenCalled();
  });

  it("throws error when property is undefined", async () => {
    await expect(
      generateWordDocument({
        model: { name: "MyModel" },
        property: undefined,
      }),
    ).rejects.toThrow("Generate Word Document: 'property' is required!");
  });

  it("throws error when property is an empty array", async () => {
    await expect(
      generateWordDocument({
        model: { name: "MyModel" },
        property: [],
      }),
    ).rejects.toThrow("Generate Word Document: 'property' is required!");
  });

  it("propagates errors thrown while generating the docx buffer", async () => {
    global.generateDocx = vi.fn().mockRejectedValue(new Error("bad template"));

    await expect(
      generateWordDocument({
        publicTemplateUrl: "https://example.com/template.docx",
        model: { name: "MyModel" },
        property: [{ name: "myProperty" }],
        fileName: "result.docx",
      }),
    ).rejects.toThrow("bad template");

    expect(global.storeFile).not.toHaveBeenCalled();
  });
});

# MultiFileUpload

A drag-and-drop file upload component. Users can select or drag multiple files, see upload progress per file, and remove files before submission.

## Setup

Connect the component to a model and a file property. The `actionId` option links an action input variable — this is what receives the uploaded file data when the action runs.

| Option | Description |
|---|---|
| `model` | The model to upload files against |
| `property` | The file property on the model (must be a file kind) |
| `actionId` | Action input variable that receives the uploaded file value |
| `maxFileSize` | Max size per file in MB (default: `10`) |
| `allowedTypes` | Allowed MIME types or extensions (default: `['*']`) |

## Parsing the action value

The value passed to the action input variable is a **comma-separated string** of file identifiers. You need to split it before processing individual files.

Use the `array-split` function with `,` as the delimiter:

| Option | Value |
|---|---|
| Text value | The action input variable |
| Delimiter | `,` |

The result is a string array where each entry is a single file identifier.
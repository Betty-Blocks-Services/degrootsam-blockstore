import { normalizeArray } from "../../utils/array-utils";
const upsertMany = async ({ model, records }) => {
  if (!model) {
    throw new Error("Upsert many: Please select a model");
  }

  const normalizedArray = normalizeArray(records);

  if (normalizedArray.length === 0) {
    console.info(
      `Upsert many: no records were updated because ${normalizedArray.length} records were provided.`,
    );
    return;
  }
  const mutation = `
mutation {
  upsertMany${model.name}(input: $input) {
    id
  }
}
`;

  const parsedArray = normalizedArray.map((item) => ({ id: item.id }));

  // externalId is a property on the Task model, for instance an identifier from an external system/service
  const { errors } = await gql(mutation, {
    input: parsedArray,
  });

  if (errors && errors.length > 0) {
    throw errors;
  }
};

export default upsertMany;

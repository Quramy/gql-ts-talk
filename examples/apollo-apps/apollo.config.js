module.exports = {
  client: {
    includes: ["./src/**/*.ts"],
    name: "myclient",
    service: {
      name: "github",
      localSchemaFile: "./schema.json",
    }
  },
};

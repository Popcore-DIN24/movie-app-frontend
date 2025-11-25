const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://brave-water-085e00003.3.azurestaticapps.net/",
  },
});

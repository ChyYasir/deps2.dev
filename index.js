import express from "express";
const app = express();
const port = 3000;

app.use(express.json());

// got these dummy data from version 3 devs.dep endpoint for express versions
const packages = {
  express: [
    {
      versionKey: { system: "NPM", name: "express", version: "3.13.0" },
      purl: "pkg:npm/express@3.13.0",
      publishedAt: "2014-07-04T05:08:17Z",
      isDefault: false,
      isDeprecated: false,
    },
    {
      versionKey: { system: "NPM", name: "express", version: "3.14.0" },
      purl: "pkg:npm/express@3.14.0",
      publishedAt: "2014-07-11T17:31:04Z",
      isDefault: false,
      isDeprecated: false,
    },
    {
      versionKey: { system: "NPM", name: "express", version: "3.15.0" },
      purl: "pkg:npm/express@3.15.0",
      publishedAt: "2014-07-23T05:08:16Z",
      isDefault: false,
      isDeprecated: false,
    },
  ],
};

// GET /versions
app.get("/versions", (req, res) => {
  try {
    const packageName = req.query.package;
    if (!packageName) {
      throw new Error("Invalid Package Name");
    }

    const packageVersions = packages[packageName];
    if (!packageVersions) {
      throw new Error(`Package ${packageName} not found.`);
    }

    res.json({ versions: packageVersions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /newVersion
app.post("/newVersion", (req, res) => {
  try {
    const { packageName, version } = req.body;

    if (!packageName || !version) {
      throw new Error("Provide both packageName and version");
    }

    if (!packages[packageName]) {
      packages[packageName] = [];
    }

    packages[packageName].push({
      versionKey: { system: "NPM", name: packageName, version: version },
      purl: `pkg:npm/${packageName}@${version}`,
      publishedAt: new Date().toISOString(),
      isDefault: false,
      isDeprecated: false,
    });

    res.status(201).json({
      message: `Version ${version} added to package ${packageName}.`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

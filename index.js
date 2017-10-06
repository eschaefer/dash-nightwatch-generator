const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");
const shell = require("shelljs");
const { JSDOM } = jsdom;

const NIGHTWATCH_DOCS_URL = "http://nightwatchjs.org/api";
const NIGHTWATCH_API_METHODS = "www-grab/nightwatchjs.org/api/index.html";
const NIGHTWATCH_GUIDES = "www-grab/nightwatchjs.org/guide/index.html";

// Check for httrack
if (!shell.which("httrack")) {
  shell.echo(
    "Sorry, this requires httrack. Try installing it with HomeBrew first."
  );
  shell.exit(1);
}

// Check for go
if (!shell.which("go")) {
  shell.echo(
    "Sorry, this requires the 'go' language. Try installing it with HomeBrew first."
  );
  shell.exit(1);
}

const replaceAPIPageContent = () => {
  const apiFilePath = path.join(__dirname, NIGHTWATCH_API_METHODS);
  const apiPage = fs.readFileSync(apiFilePath, "utf8");

  const dom = new JSDOM(apiPage, { runScripts: "outside-only" });
  const main = dom.window.document.getElementById("api-container").outerHTML;

  dom.window.document.body.innerHTML = main;
  fs.writeFileSync(apiFilePath, dom.serialize(), "utf8");
};

const replaceGuidesPageContent = () => {
  const guidesFilePath = path.join(__dirname, NIGHTWATCH_GUIDES);
  const guidesPage = fs.readFileSync(guidesFilePath, "utf8");

  const dom = new JSDOM(guidesPage, { runScripts: "outside-only" });
  const main = dom.window.document.getElementById("guide-container")
    .outerHTML;

  dom.window.document.body.innerHTML = main;
  fs.writeFileSync(guidesFilePath, dom.serialize(), "utf8");
};

const copyNightwatchFiles = () => {
  const nightwatchFiles = path.join(__dirname, "www-grab/nightwatchjs.org");
  const dashingDir = path.join(__dirname, "dashing");

  shell.cp("-R", nightwatchFiles, dashingDir);
};

const httrackCallback = (code, stdout, stderr) => {
  replaceAPIPageContent();
  replaceGuidesPageContent();
  copyNightwatchFiles();
};

shell.echo("Grabbing Nightwatch docs. This might take a while...");
// shell.exec(
//   `rm -rf www-grab && mkdir www-grab && cd www-grab && httrack ${NIGHTWATCH_DOCS_URL}`,
//   httrackCallback
// );

httrackCallback();

shell.echo("Grabbing the Dashing lib...");
shell.exec(`go get -u github.com/technosophos/dashing`);

// shell.cd("dashing");
// shell.exec(`$HOME/go/bin/dashing build nightwatchjs`);

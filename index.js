const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");
const shell = require("shelljs");
const { JSDOM } = jsdom;

const SCRAPED_DOCS_FOLDER = "www-grab";
const DASHING_FOLDER = "dashing";
const NIGHTWATCH_API_METHODS = `${SCRAPED_DOCS_FOLDER}/nightwatchjs.org/api/index.html`;
const NIGHTWATCH_GUIDES = `${SCRAPED_DOCS_FOLDER}/nightwatchjs.org/guide/index.html`;
const NIGHTWATCH_DOCS_URL = "http://nightwatchjs.org/api";

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
  const nightwatchFiles = path.join(
    __dirname,
    `${SCRAPED_DOCS_FOLDER}/nightwatchjs.org`
  );
  const dashingDir = path.join(__dirname, DASHING_FOLDER);

  shell.cp("-R", nightwatchFiles, dashingDir);
};

const httrackCallback = (code, stdout, stderr) => {
  replaceAPIPageContent();
  replaceGuidesPageContent();
  copyNightwatchFiles();
};

/* Start generation commands
*
*/
shell.echo("Grabbing Nightwatch docs. This might take a while...");
shell.rm("-rf", SCRAPED_DOCS_FOLDER);
shell.mkdir(SCRAPED_DOCS_FOLDER);
shell.cd(SCRAPED_DOCS_FOLDER);
shell.exec(`httrack ${NIGHTWATCH_DOCS_URL}`, httrackCallback);

shell.echo("Grabbing the Dashing lib...");
shell.exec(`go get -u github.com/technosophos/dashing`);
shell.cd(DASHING_FOLDER);

shell.echo("Generating the docset with Dashing...");
shell.rm("-rf", "nightwatch.js.docset");
shell.exec(`$HOME/go/bin/dashing build nightwatchjs`);

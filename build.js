const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Instalar dependências do npm
console.log("Installing npm dependencies...");
execSync("npm install -s", { stdio: "inherit" });

// Função para copiar arquivos
function copyFile(src, dest) {
	const destDir = path.dirname(dest);
	if (!fs.existsSync(destDir)) {
		fs.mkdirSync(destDir, { recursive: true });
	}
	fs.copyFileSync(src, dest);
	//console.log(`Copied: ${src} -> ${dest}`);
}

// Arquivos e diretórios a serem copiados
const filesToCopy = [
	{ src: "node_modules/bootstrap/dist/css/bootstrap.min.css", dest: "frontend/static/vendor/bootstrap/bootstrap.min.css" },
	{ src: "node_modules/bootstrap/dist/css/bootstrap.min.css.map", dest: "frontend/static/vendor/bootstrap/bootstrap.min.css.map" },
	{ src: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", dest: "frontend/static/vendor/bootstrap/bootstrap.bundle.min.js" },
	{ src: "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map", dest: "frontend/static/vendor/bootstrap/bootstrap.bundle.min.js.map" },
	{ src: "node_modules/bootstrap-icons/font/bootstrap-icons.css", dest: "frontend/static/vendor/bootstrap-icons/bootstrap-icons.css" },
	{ src: "node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff", dest: "frontend/static/vendor/bootstrap-icons/fonts/bootstrap-icons.woff" },
	{ src: "node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2", dest: "frontend/static/vendor/bootstrap-icons/fonts/bootstrap-icons.woff2" },
	{ src: "node_modules/jquery/dist/jquery.min.js", dest: "frontend/static/vendor/jquery/jquery.min.js" },
	{ src: "node_modules/jquery/dist/jquery.min.map", dest: "frontend/static/vendor/jquery/jquery.min.map" },
];

// Executar a cópia
console.log("Copying files from node_modules to static/vendor...");
filesToCopy.forEach((file) => copyFile(file.src, file.dest));

// Instalar dependências do Python e suprimir mensagens "Requirement already satisfied"
console.log("Installing Python dependencies...");
try {
	const output = execSync("pip install -r requirements.txt", { stdio: "pipe" }).toString();
	const filteredOutput = output
		.split("\n")
		.filter((line) => !line.includes("Requirement already satisfied"))
		.join("\n");
	console.log(filteredOutput);
} catch (err) {
	console.error(`Error during pip install: ${err.message}`);
}

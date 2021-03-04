const {dirname} = require("path");
const fs = require("fs");

module.exports = function(TASK,OPTIONS)
{
	if (bolt.isNotObject(OPTIONS)) bolt.throwError(`merge: Bad formatted task "${TASK}"`);
	if (!("input" in OPTIONS)) bolt.throwError(`merge: "input" not defined in task "${TASK}"`);
	if (!("output" in OPTIONS)) bolt.throwError(`merge: "output" not defined in task "${TASK}"`);
	if (bolt.isNotString(OPTIONS.output)) bolt.throwError(`merge: Bad formatted "output" "${OPTIONS.output}" in task "${TASK}"`);
	if ((OPTIONS.output.charAt(OPTIONS.output.length - 1) === "/") || (helper.isPath(OPTIONS.output) && helper.isNotFile(OPTIONS.output))) bolt.throwError(`merge: Invalid "output" "${OPTIONS.output}" in task "${TASK}"`);

	const files = bolt.resolvePath(OPTIONS.input,{directory: false});

	const directory = dirname(OPTIONS.output);
	if (helper.isNotPath(directory)) fs.mkdirSync(directory,{recursive: true});
	else if (helper.isNotDirectory(directory)) bolt.throwError(`merge: Invalid "output" "${OPTIONS.output}" in task "${TASK}"`);

	let content = "";
	if (files.length > 0)
	{
		for (let i = 0; i < files.length - 1; ++i) content += fs.readFileSync(files[i],"utf8") + "\n";
		content += fs.readFileSync(files[i],"utf8");
	};
	fs.writeFileSync(OPTIONS.output,content);
};

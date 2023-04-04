const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
app.use(express.static(__dirname+"/"));
app.use(express.json());

app.use(
	morgan('combined', {
		skip: (_req, res) => {
			return res.statusCode < 200;
		},
	})
);

//Index file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
//Anything else => 404
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '404.html'));
});  

const key = fs.readFileSync(path.join(__dirname, '../..', 'wildcard.key'), 'ascii');
const cert =  fs.readFileSync(path.join(__dirname, '../..', 'wildcard.crt'), 'ascii')
const ca =  fs.readFileSync(path.join(__dirname, '../..', 'DigiCertCA.crt'), 'ascii')
const PORT = 443
https.globalAgent.options.ca = ca;
const server = https.createServer({key,cert,ca}, app);
server.listen(PORT, () => {
    console.log(`Server ready on port ${PORT}`);
});

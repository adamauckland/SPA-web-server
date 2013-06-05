var express = require('express'),
	settings = require('./settings'),
	fs = require('fs'),
	app = express();
	

/**
 * @description If we are behind a reverse proxy,
 * tell node
 */
if(typeof settings.proxy !== 'undefined' && settings.proxy == true) {
	app.enable('trust proxy');	
}


/**
 * @description Map the path to a filename 
 */
function mapFilename(path) {
	return settings.directory + path;
}


/**
 * @description Send the correct MIME headers for the filetype
 */
function sendMimeType(filename, res) {
	var splitName = filename.split('.');
  
	if(splitName.length > 1) {
		res.type(splitName[splitName.length - 1]);
	}
}


/**
 * @description Log to console if settings.debug is true
 */
function log(text) {
	if(settings.debug) {
		console.log(text);
	}
}


/**
 * @description Read and send a file from the filesystem.
 *
 * If no file is present, will send a redirect
 * to the browser with /index.html added to the path.
 */
function sendFile(filename, req, res) {
	fs.stat(filename, function(err, stats) {
		if(stats.isDirectory()) {
			sendFile(filename + '/index.html', req, res);
		} else {
			fs.readFile(filename, function (err, data) {
				if (err) throw err;
			
				sendMimeType(filename, res);
				res.send(data);
			});
		}
	});
}


app.get('*', function(req, res){
	var filename,
		params,
		newLocation;
	
	console.log(req.path);	
	filename = mapFilename(req.path);

	fs.exists(filename, function (exists) {
		//
		// send file if it exists
		//
		if(exists === true) {
			sendFile(filename, req, res);
		} else {
			if(filename.indexOf('.') !== -1) {
				res.send('Not found', 404);
			} else {
				sendFile(mapFilename('/index.html'), req, res);
				//newLocation = '/index.html#' + req.path;
				//console.log(newLocation);
				//res.redirect(newLocation);
			}  
		}
	});
});


app.listen(process.env.PORT || 3000);


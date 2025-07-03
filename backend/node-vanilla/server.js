const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const busboy = require('busboy');
const sharp = require('sharp');

const Flower = require(`${__dirname}/models/Flower`);



const FLOWER_DATA_PATH = path.join(__dirname, 'data', 'flowers.json');
const FLOWER_SUGGESTIONS_DATA_PATH = path.join(__dirname, 'data', 'flower-suggestions.json');
const FLOWER_IMAGES_PATH = path.join(__dirname, 'public', 'flowers');
// const SUGGESTIONS_IMAGE_PATH = path.join(__dirname, 'public', 'suggestions');
const staticFolder = path.join(__dirname, 'public');

let imageToWebpPromise = null;

function saveAsWebp(fileStream, outputPath) {
    return new Promise((resolve, reject) => {
        const transformer = sharp().webp();
        const saveTo = fs.createWriteStream(outputPath);

        fileStream.pipe(transformer).pipe(saveTo);

        fileStream.on('error', (err) => reject);
        transformer.on('error', (err) => reject);
        saveTo.on('error', (err) => reject);

        saveTo.on('finish', () => resolve(outputPath));
    });
}


const server = http.createServer((req, res) => {
    console.log(req.url );


    if (req.method === 'GET' && req.url.startsWith('/flowers/')) {
        const imagePath = path.join(staticFolder, req.url);
        
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                return res.end('Image not found');
            }

            res.writeHead(200, { 'Content-Type': 'image/png' }); // Or detect by file extension
            res.end(data);
        });
    }

    else if (req.method === 'GET' && req.url === '/api/flowers') {
        fs.readFile(FLOWER_DATA_PATH, 'utf-8', (err, data) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        console.error("ERROR! File not found: ", err);
                        res.writeHead(404, { 'content-type': 'text/plain' })
                        return res.end('Error reading file, file could not be found.');
                    }
                    else {
                        console.error("ERROR! Error occured while reading file: ", err);
                        res.writeHead(500, { 'content-type': 'text/plain' })
                        return res.end('Error reading file, Internal Server Error.');
                    }
                }

                res.writeHead(200, { 'content-type': 'application/json' });
                res.end(data);
            });
    }

    else if (req.method === 'POST' && req.url === '/api/flowers') {
        let nameBg = '';
        let nameEng = '';
        let filepath = '';

        const bb = busboy({ headers: req.headers });
        bb.on('field', (name, val, info) => {
            if (name === 'nameBg') {
                nameBg = val;
            } else if (name === 'nameEng') {
                nameEng = val;
            }
        });
        bb.on('file', (name, file, info) => {
            const fileName = `${new Date().toJSON().slice(0, 10)}-${Date.now()}-${info.filename.split('.')[0]}.webp`;
            const filePath = path.join(FLOWER_IMAGES_PATH, fileName);
            imageToWebpPromise = saveAsWebp(file, filePath);
        });

        bb.on('finish', async () => {
            if (imageToWebpPromise) {
                try {
                    filepath = await imageToWebpPromise;
                } catch (error) {
                    console.error('ERROR! Could not save/convert image!');
                    res.writeHead(500, { 'content-type': 'text/plain' });
                    return res.end('A problem occured while converting image to .webp or while saving it.');
                }
            }

            if (!nameBg || !nameEng || !filepath) {
                console.error('ERROR! Missing flower information!');
                res.writeHead(400, { 'content-type': 'text/plain' });
                return res.end('Missing one or more properties of flower object.');
            }

            const newFlower = new Flower(nameBg, nameEng, filepath);

            fs.readFile(FLOWER_DATA_PATH, 'utf-8', (err, data) => {
                if (res.writableEnded) {
                    return;
                }

                if (err) {
                    if (err.code === 'ENOENT') {
                        console.error("ERROR! File not found: ", err);
                        res.writeHead(404, { 'content-type': 'text/plain' })
                        return res.end('Error reading file, file could not be found.');
                    }
                    else {
                        console.error("ERROR! Error occured while reading file: ", err);
                        res.writeHead(500, { 'content-type': 'text/plain' })
                        return res.end('Error reading file, Internal Server Error.');
                    }
                }

                let flowers = [];

                try {
                    flowers = JSON.parse(data);
                } catch (error) {
                    console.error("ERROR! Error occured while parsing flowers data: ", error);
                    res.writeHead(500, { 'content-type': 'text/plain' })
                    return res.end('Error parsing flower data.');
                }

                flowers.push(newFlower);
                const flowersJson = JSON.stringify(flowers, null, 2);

                fs.writeFile(FLOWER_DATA_PATH, flowersJson, 'utf-8', (err) => {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            console.error("ERROR! File not found: ", err);
                            res.writeHead(404, { 'content-type': 'text/plain' })
                            return res.end('Error reading file, file could not be found.');
                        }
                        else {
                            console.error("ERROR! Error occured while reading file: ", err);
                            res.writeHead(500, { 'content-type': 'text/plain' })
                            return res.end('Error reading file, Internal Server Error.');
                        }
                    }

                    console.log('Flowers written'); 
                    res.writeHead(201, { 'content-type': 'text/plain' });
                    res.end('Successfully stored flower');
                });
            })
        });

        req.pipe(bb);
    }

    else if (req.method === 'GET' && req.url === '/api/flower-suggestions') {
        fs.readFile(FLOWER_SUGGESTIONS_DATA_PATH, 'utf-8', (err, data) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        console.error("ERROR! File not found: ", err);
                        res.writeHead(404, { 'content-type': 'text/plain' })
                        return res.end('Error reading file, file could not be found.');
                    }
                    else {
                        console.error("ERROR! Error occured while reading file: ", err);
                        res.writeHead(500, { 'content-type': 'text/plain' })
                        return res.end('Error reading file, Internal Server Error.');
                    }
                }

                res.writeHead(200, { 'content-type': 'application/json' });
                res.end(data);
            });
    }

    else if (req.method === 'POST' && req.url === '/api/flower-suggestions') {
        let nameBg = '';
        let nameEng = '';
        let filepath = '';

        const bb = busboy({ headers: req.headers });
        bb.on('field', (name, val) => {
            if (name === 'nameBg') {
                nameBg = val;
            } else if (name === 'nameEng') {
                nameEng = val;
            }
        });

        bb.on('file', (name, file, info) => {
            const fileName = `${new Date().toJSON().slice(0, 10)}-${Date.now()}-${info.filename.split('.')[0]}.webp`;
            const filePath = path.join(FLOWER_IMAGES_PATH, fileName);
            imageToWebpPromise = saveAsWebp(file, filePath);
        });

        bb.on('finish', async () => {
            if (imageToWebpPromise) {
                try {
                    filepath = await imageToWebpPromise;
                } catch (error) {
                    console.error('ERROR! Could not save/convert image!');
                    res.writeHead(500, { 'content-type': 'text/plain' });
                    return res.end('A problem occured while converting image to .webp or while saving it.');
                }
            }

            if (!nameBg || !nameEng || !filepath) {
                console.error('ERROR! Missing flower information!');
                res.writeHead(400, { 'content-type': 'text/plain' });
                return res.end('Missing one or more properties of flower object.');
            }

            const newFlower = new Flower(nameBg, nameEng, filepath);

            fs.readFile(FLOWER_SUGGESTIONS_DATA_PATH, 'utf-8', (err, data) => {
                if (res.writableEnded) {
                    return;
                }

                if (err) {
                    if (err.code === 'ENOENT') {
                        console.error("ERROR! File not found: ", err);
                        res.writeHead(404, { 'content-type': 'text/plain' })
                        return res.end('Error reading file, file could not be found.');
                    }
                    else {
                        console.error("ERROR! Error occured while reading file: ", err);
                        res.writeHead(500, { 'content-type': 'text/plain' })
                        return res.end('Error reading file, Internal Server Error.');
                    }
                }
                
                let flowers = [];

                try {
                    flowers = JSON.parse(data);
                } catch (error) {
                    console.error("ERROR! Error occured while parsing flowers data: ", error);
                    res.writeHead(500, { 'content-type': 'text/plain' })
                    return res.end('Error parsing flower data.');
                }

                flowers.push(newFlower);
                const flowersJson = JSON.stringify(flowers, null, 2);

                fs.writeFile(FLOWER_SUGGESTIONS_DATA_PATH, flowersJson, 'utf-8', (err) => {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            console.error("ERROR! File not found: ", err);
                            res.writeHead(404, { 'content-type': 'text/plain' })
                            return res.end('Error reading file, file could not be found.');
                        }
                        else {
                            console.error("ERROR! Error occured while reading file: ", err);
                            res.writeHead(500, { 'content-type': 'text/plain' })
                            return res.end('Error reading file, Internal Server Error.');
                        }
                    }

                    console.log('Flower suggestion written'); 
                    res.writeHead(201, { 'content-type': 'text/plain' });
                    res.end('Successfully stored flower suggestion');
                });
            })
        });

        req.pipe(bb);
    }

    else if ((req.method === 'PUT' || req.method === 'PATCH') && req.url.startsWith('/api/flower-suggestions/approve')) {
        const id = url.parse(req.url, true).query.id;
        if (!id) {
            console.error('ERROR! Missing id parameter in query!');
            res.writeHead(400, { 'content-type': 'text/plain'} );
            return res.end('No id parameter in url query');
        }

        let flowers = [];
        let suggestions = [];

        // Get flowers
        fs.readFile(FLOWER_DATA_PATH, 'utf-8', (err, data) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        console.error("ERROR! File not found: ", err);
                        res.writeHead(404, { 'content-type': 'text/plain' })
                        return res.end('Error reading file, file could not be found.');
                    }
                    else {
                        console.error("ERROR! Error occured while reading file: ", err);
                        res.writeHead(500, { 'content-type': 'text/plain' })
                        return res.end('Error reading file, Internal Server Error.');
                    }
                }

                try {
                    flowers = JSON.parse(data);
                } catch (error) {
                    console.error("ERROR! Error occured while parsing flowers data: ", error);
                    res.writeHead(500, { 'content-type': 'text/plain' })
                    return res.end('Error parsing flower data.');
                }

                // Get suggestions
                fs.readFile(FLOWER_SUGGESTIONS_DATA_PATH, 'utf-8', (err, data) => {
                        if (err) {
                            if (err.code === 'ENOENT') {
                                console.error("ERROR! File not found: ", err);
                                res.writeHead(404, { 'content-type': 'text/plain' })
                                return res.end('Error reading file, file could not be found.');
                            }
                            else {
                                console.error("ERROR! Error occured while reading file: ", err);
                                res.writeHead(500, { 'content-type': 'text/plain' })
                                return res.end('Error reading file, Internal Server Error.');
                            }
                        }

                        try {
                            suggestions = JSON.parse(data);
                        } catch (error) {
                            console.error("ERROR! Error occured while parsing flowers data: ", error);
                            res.writeHead(500, { 'content-type': 'text/plain' })
                            return res.end('Error parsing flower data.');
                        }

                        // Find approved flower & add it
                        const flower = suggestions.find(el => el.id === id);
                        if (!flower) {
                            res.writeHead(400, { 'content-type': 'text/plain' });
                            return res.end(`No flower with id ${id} exists`)
                        }

                        flowers.push(flower);
                        const flowersJson = JSON.stringify(flowers, null, 2);

                        // Save new flower data
                        fs.writeFile(FLOWER_DATA_PATH, flowersJson, 'utf-8', (err) => {
                            if (err) {
                                if (err.code === 'ENOENT') {
                                    console.error("ERROR! File not found: ", err);
                                    res.writeHead(404, { 'content-type': 'text/plain' })
                                    return res.end('Error reading file, file could not be found.');
                                }
                                else {
                                    console.error("ERROR! Error occured while reading file: ", err);
                                    res.writeHead(500, { 'content-type': 'text/plain' })
                                    return res.end('Error reading file, Internal Server Error.');
                                }
                            }

                            // Remove accepted flower from suggestions
                            const newSuggestedFlowers = suggestions.filter(el => el.id !== id);
                            const suggestedFlowersJson = JSON.stringify(newSuggestedFlowers, null, 2);

                            fs.writeFile(FLOWER_SUGGESTIONS_DATA_PATH, suggestedFlowersJson, 'utf-8', (err) => {
                                if (err) {
                                    if (err.code === 'ENOENT') {
                                        console.error("ERROR! File not found: ", err);
                                        res.writeHead(404, { 'content-type': 'text/plain' })
                                        return res.end('Error reading file, file could not be found.');
                                    }
                                    else {
                                        console.error("ERROR! Error occured while reading file: ", err);
                                        res.writeHead(500, { 'content-type': 'text/plain' })
                                        return res.end('Error reading file, Internal Server Error.');
                                    }
                                }
                                
                                console.log('Suggested flower saved'); 
                                res.writeHead(204, { 'content-type': 'text/plain' });
                                res.end('Successfully stored flower suggestion');
                            });
                        });
                });
        });
    }

    else if (req.method === 'DELETE' && req.url.startsWith('/api/flowers')) {
        const id = url.parse(req.url, true).query.id;
        if (!id) {
            console.error('ERROR! Missing id parameter in query!');
            res.writeHead(400, { 'content-type': 'text/plain'} );
            return res.end('No id parameter in url query');
        }

        let flowers = [];

        // Get flowers
        fs.readFile(FLOWER_DATA_PATH, 'utf-8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error("ERROR! File not found: ", err);
                    res.writeHead(404, { 'content-type': 'text/plain' })
                    return res.end('Error reading file, file could not be found.');
                }
                else {
                    console.error("ERROR! Error occured while reading file: ", err);
                    res.writeHead(500, { 'content-type': 'text/plain' })
                    return res.end('Error reading file, Internal Server Error.');
                }
            }

            try {
                flowers = JSON.parse(data);
            } catch (error) {
                console.error("ERROR! Error occured while parsing flowers data: ", error);
                res.writeHead(500, { 'content-type': 'text/plain' })
                return res.end('Error parsing flower data.');
            }

            // Find flower to delete and remove it
            const flowerToDelete = flowers.find(el => el.id === id);
            if (!flowerToDelete) {
                res.writeHead(400, { 'content-type': 'text/plain' });
                return res.end(`No flower with id ${id} exists`)
            }

            const newFlowers = flowers.filter(el => el.id !== id);
            const newFlowersJson = JSON.stringify(newFlowers, null, 2);

            // Delete image
            fs.unlink(flowerToDelete.filepath, (err) => {
                if (err) {
                    console.error('ERROR! Could not delete image of flower with id:', flowerToDelete.id);
                    res.writeHead(500, { 'content-type': 'text/plain' })
                    return res.end('Error deleting file.');
                }
    
                // Save flower data
                fs.writeFile(FLOWER_DATA_PATH, newFlowersJson, 'utf-8', (err) => {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            console.error("ERROR! File not found: ", err);
                            res.writeHead(404, { 'content-type': 'text/plain' })
                            return res.end('Error reading file, file could not be found.');
                        }
                        else {
                            console.error("ERROR! Error occured while reading file: ", err);
                            res.writeHead(500, { 'content-type': 'text/plain' })
                            return res.end('Error reading file, Internal Server Error.');
                        }
                    }

                    console.log(`Flower ${id} deleted`); 
                    res.writeHead(204, { 'content-type': 'text/plain' });
                    res.end('Successfully deleted flower ', id);

                });
            });
        });
    }

    else if (req.method === 'DELETE' && req.url.startsWith('/api/flower-suggestions')) {
        const id = url.parse(req.url, true).query.id;
        if (!id) {
            console.error('ERROR! Missing id parameter in query!');
            res.writeHead(400, { 'content-type': 'text/plain'} );
            return res.end('No id parameter in url query');
        }

        let suggestions = [];

        // Get flowers
        fs.readFile(FLOWER_SUGGESTIONS_DATA_PATH, 'utf-8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error("ERROR! File not found: ", err);
                    res.writeHead(404, { 'content-type': 'text/plain' })
                    return res.end('Error reading file, file could not be found.');
                }
                else {
                    console.error("ERROR! Error occured while reading file: ", err);
                    res.writeHead(500, { 'content-type': 'text/plain' })
                    return res.end('Error reading file, Internal Server Error.');
                }
            }

            try {
                suggestions = JSON.parse(data);
            } catch (error) {
                console.error("ERROR! Error occured while parsing flower suggestions data: ", error);
                res.writeHead(500, { 'content-type': 'text/plain' })
                return res.end('Error parsing flower suggestions data.');
            }

            // Find flower to delete and remove it
            const suggestionToDelete = suggestions.find(el => el.id === id);
            if (!suggestionToDelete) {
                res.writeHead(400, { 'content-type': 'text/plain' });
                return res.end(`No suggestion with id ${id} exists`)
            }

            const newSuggestions = suggestions.filter(el => el.id !== id);
            const newSuggestionsJson = JSON.stringify(newSuggestions, null, 2);

            // Delete image
            fs.unlink(suggestionToDelete.filepath, (err) => {
                if (err) {
                    console.error('ERROR! Could not delete image of flower with id:', suggestionToDelete.id);
                    res.writeHead(500, { 'content-type': 'text/plain' })
                    return res.end('Error deleting file.');
                }
    
                // Save flower data
                fs.writeFile(FLOWER_SUGGESTIONS_DATA_PATH, newSuggestionsJson, 'utf-8', (err) => {
                    if (err) {
                        if (err.code === 'ENOENT') {
                            console.error("ERROR! File not found: ", err);
                            res.writeHead(404, { 'content-type': 'text/plain' })
                            return res.end('Error reading file, file could not be found.');
                        }
                        else {
                            console.error("ERROR! Error occured while reading file: ", err);
                            res.writeHead(500, { 'content-type': 'text/plain' })
                            return res.end('Error reading file, Internal Server Error.');
                        }
                    }

                    console.log(`Flower suggestion ${id} deleted`); 
                    res.writeHead(204, { 'content-type': 'text/plain' });
                    res.end('Successfully deleted flower suggestion ', id);

                });
            });
        });
    }
    
    else {
        res.writeHead(404, { 'content-type': 'text/plain' });
        res.end(`No handler exists for ${req.method} ${req.url}`);
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening on localhost:8000...');
})





// TODO: Find a way to authorize or add another post event for client users
// TODO: Make some way to find and/or get images
// TODO: 
// TODO: 
// TODO: 
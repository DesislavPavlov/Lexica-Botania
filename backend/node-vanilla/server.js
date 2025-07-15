const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const busboy = require('busboy');
const supabaseService = require(`${__dirname}/services/supabaseService`);

const Flower = require(`${__dirname}/models/Flower`);

const PORT = process.env.PORT || 8000;

let imageToWebpPromise = null;

const server = http.createServer(async (req, res) => {
  console.log(req.url);

  res.setHeader('Access-Control-Allow-Origin', '*'); // TODO: Change to domain name
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET' && req.url === '/api/flowers') {
    const flowers = await supabaseService.getFlowers();
    const flowersJson = JSON.stringify(flowers);
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(flowersJson);
  } else if (req.method === 'POST' && req.url === '/api/flowers') {
    let nameBg = '';
    let nameEng = '';
    let nameLatin = '';
    let filepath = '';

    // Set up busboy
    const bb = busboy({ headers: req.headers });

    // Text fields
    bb.on('field', (name, val, info) => {
      if (name === 'nameBg') {
        nameBg = val;
      } else if (name === 'nameEng') {
        nameEng = val;
      } else if (name === 'nameLatin') {
        nameLatin = val;
      }
    });

    // Files
    bb.on('file', (name, file, info) => {
      const fileName = `${new Date().toJSON().slice(0, 10)}-${Date.now()}-${
        info.filename.split('.')[0]
      }.webp`;
      imageToWebpPromise = supabaseService.saveImage(file, fileName);
    });

    // Busboy finish, save data to supabase
    bb.on('finish', async () => {
      if (imageToWebpPromise) {
        try {
          filepath = await imageToWebpPromise;
        } catch (error) {
          console.error('ERROR! Could not save/convert image!');
          res.writeHead(500, { 'content-type': 'text/plain' });
          return res.end(
            'A problem occured while converting image to .webp or while saving it.'
          );
        }
      }

      if (!nameBg || !nameEng || !nameLatin || !filepath) {
        console.error('ERROR! Missing flower information!');
        res.writeHead(400, { 'content-type': 'text/plain' });
        return res.end('Missing one or more properties of flower object.');
      }

      const newFlower = new Flower(nameBg, nameEng, nameLatin, filepath);
      const savedId = await supabaseService.saveFlower(newFlower);
      if (!savedId) {
        console.error('ERROR! Unexpected error ocurred while saving flower!');
        res.writeHead(500, { 'content-type': 'text/plain' });
        res.end('Could not save flower, unexpected error ocurred');
      }

      console.log('New flower successfully saved!');
      res.writeHead(201, { 'content-type': 'text/plain' });
      res.end('Successfully stored flower');
    });

    // Pipe through busboy
    req.pipe(bb);
  } else if (req.method === 'GET' && req.url === '/api/flower-suggestions') {
    const suggestions = await supabaseService.getSuggestions();
    const suggestionsJson = JSON.stringify(suggestions);
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(suggestionsJson);
  } else if (req.method === 'POST' && req.url === '/api/flower-suggestions') {
    let nameBg = '';
    let nameEng = '';
    let nameLatin = '';
    let filepath = '';

    // Set up busboy
    const bb = busboy({ headers: req.headers });

    // Text fields
    bb.on('field', (name, val) => {
      if (name === 'nameBg') {
        nameBg = val;
      } else if (name === 'nameEng') {
        nameEng = val;
      } else if (name === 'nameLatin') {
        nameLatin = val;
      }
    });

    // Files
    bb.on('file', (name, file, info) => {
      const fileName = `${new Date().toJSON().slice(0, 10)}-${Date.now()}-${
        info.filename.split('.')[0]
      }.webp`;
      imageToWebpPromise = supabaseService.saveImage(file, fileName);
    });

    // Finish
    bb.on('finish', async () => {
      if (imageToWebpPromise) {
        try {
          filepath = await imageToWebpPromise;
        } catch (error) {
          console.error('ERROR! Could not save/convert image!');
          res.writeHead(500, { 'content-type': 'text/plain' });
          return res.end(
            'A problem occured while converting image to .webp or while saving it.'
          );
        }
      }

      if (!nameBg || !nameEng || !nameLatin || !filepath) {
        console.error('ERROR! Missing flower information!');
        res.writeHead(400, { 'content-type': 'text/plain' });
        return res.end('Missing one or more properties of flower object.');
      }

      const newSuggestion = new Flower(nameBg, nameEng, nameLatin, filepath);
      const savedId = await supabaseService.saveSuggestion(newSuggestion);
      if (!savedId) {
        console.error(
          'ERROR! Unexpected error ocurred while saving suggestion!'
        );
        res.writeHead(500, { 'content-type': 'text/plain' });
        res.end('Could not save flower suggestion, unexpected error ocurred');
      }

      console.log('Flower suggestion successfully saved!');
      res.writeHead(201, { 'content-type': 'text/plain' });
      res.end('Successfully stored flower suggestion');
    });

    // Pipe through busboy
    req.pipe(bb);
  } else if (
    (req.method === 'PUT' || req.method === 'PATCH') &&
    req.url.startsWith('/api/flower-suggestions/approve')
  ) {
    const id = url.parse(req.url, true).query.id;
    if (!id) {
      console.error('ERROR! Missing id parameter in query!');
      res.writeHead(400, { 'content-type': 'text/plain' });
      return res.end('No id parameter in url query');
    }

    const suggestion = await supabaseService.getSuggestion(id);
    if (!suggestion) {
      console.error('ERROR! Could not find suggestion in DB with id: ', id);
      res.writeHead(400, { 'content-type': 'text/plain' });
      return res.end('Could not find suggestion with id: ', id);
    }

    if (!(await supabaseService.deleteSuggestion(id))) {
      res.writeHead(500, { 'content-type': 'text/plain' });
      return res.end('Could not delete flower suggestion record form DB');
    }

    const newFlower = new Flower(
      suggestion.name_bg,
      suggestion.name_eng,
      suggestion.name_latin,
      suggestion.image_url
    );

    const savedId = await supabaseService.saveFlower(newFlower);
    if (!savedId) {
      console.error(
        'ERROR! Unexpected error ocurred while approving suggested flower!'
      );
      res.writeHead(500, { 'content-type': 'text/plain' });
      res.end('Could not approve flower suggestion, unexpected error ocurred');
    }

    console.log(
      'Suggested flower approved and moved from suggestions to flowers!'
    );
    res.writeHead(204, { 'content-type': 'text/plain' });
    res.end('Successfully moved flower suggestion to flowers');
  } else if (req.method === 'DELETE' && req.url.startsWith('/api/flowers')) {
    const id = url.parse(req.url, true).query.id;
    if (!id) {
      console.error('ERROR! Missing id parameter in query!');
      res.writeHead(400, { 'content-type': 'text/plain' });
      return res.end('No id parameter in url query');
    }

    const flower = await supabaseService.getFlower(id);
    if (!flower) {
      console.error('ERROR! Could not find flower in DB with id: ', id);
      res.writeHead(400, { 'content-type': 'text/plain' });
      return res.end('Could not find flower with id: ', id);
    }

    if (!(await supabaseService.deleteImage(flower.image_url))) {
      res.writeHead(500, { 'content-type': 'text/plain' });
      return res.end('Could not delete image of flower id: '.id);
    }

    if (!(await supabaseService.deleteFlower(id))) {
      res.writeHead(500, { 'content-type': 'text/plain' });
      return res.end('Could not delete flower record form DB');
    }

    console.log(`Flower ${id} successfully deleted`);
    res.writeHead(204, { 'content-type': 'text/plain' });
    res.end('Successfully deleted flower ', id);
  } else if (
    req.method === 'DELETE' &&
    req.url.startsWith('/api/flower-suggestions')
  ) {
    const id = url.parse(req.url, true).query.id;
    if (!id) {
      console.error('ERROR! Missing id parameter in query!');
      res.writeHead(400, { 'content-type': 'text/plain' });
      return res.end('No id parameter in url query');
    }

    const suggestion = await supabaseService.getSuggestion(id);
    if (!suggestion) {
      console.error('ERROR! Could not find suggestion in DB with id: ', id);
      res.writeHead(400, { 'content-type': 'text/plain' });
      return res.end('Could not find suggestion with id: ', id);
    }

    if (!(await supabaseService.deleteImage(suggestion.image_url))) {
      res.writeHead(500, { 'content-type': 'text/plain' });
      return res.end('Could not delete image of flower suggestion id: '.id);
    }

    if (!(await supabaseService.deleteSuggestion(id))) {
      res.writeHead(500, { 'content-type': 'text/plain' });
      return res.end('Could not delete flower suggestion record form DB');
    }

    console.log(`Flower suggestion ${id} deleted`);
    res.writeHead(204, { 'content-type': 'text/plain' });
    res.end('Successfully deleted flower suggestion ', id);
  } else {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end(`No endpoint handler exists for ${req.method} ${req.url}`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Server listening...');
});

// TODO: Find a way to authorize or add another post event for client users

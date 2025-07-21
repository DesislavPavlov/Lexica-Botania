const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');

const URL = process.env.SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_SERVICE_ANON_KEY;

async function getSupabaseClient(token = null) {
  const supabase = createClient(URL, ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  });

  await supabase.auth.setSession({ access_token: token, refresh_token: '' });

  return supabase;
}

async function saveImageToSupabaseAsWebp(fileStream, fileName, token) {
  const supabase = await getSupabaseClient(token);
  const chunks = [];
  const transformer = sharp().webp();

  return new Promise((resolve, reject) => {
    fileStream
      .pipe(transformer)
      .on('data', (chunk) => chunks.push(chunk))
      .on('end', async () => {
        const buffer = Buffer.concat(chunks);
        const { data, error } = await supabase.storage
          .from('flowers')
          .upload(fileName, buffer, {
            contentType: 'image/webp',
            upsert: true,
          });

        if (error) {
          return reject(error);
        }

        const { data: publicUrlData } = supabase.storage
          .from('flowers')
          .getPublicUrl(fileName);
        resolve(publicUrlData.publicUrl);
      })
      .on('error', reject);
  });
}

async function removeImageFromSupabase(fileUrl, token) {
  const supabase = await getSupabaseClient(token);
  try {
    const urlSegments = fileUrl.split('/flowers/');
    if (urlSegments.length !== 2) {
      console.error(
        'ERROR! Passed wrong URL format, should be *supabase-link*/public/flowers/*flower-file-name*, but is: ',
        fileUrl
      );
      return false;
    }

    const fileName = urlSegments[1];

    const { data, err } = await supabase.storage
      .from('flowers')
      .remove([fileName]);

    if (err) {
      console.error('ERROR! Failed to delete image: ', err.message);
      return false;
    }

    console.log('Image successfully removed!');
    return true;
  } catch (error) {
    console.error('ERROR! Unexpected error during file deletion: ', error);
    return false;
  }
}

async function getFlowers(token) {
  const supabase = await getSupabaseClient(token);
  const { data, error } = await supabase.from('flowers').select();

  if (error) {
    console.error('ERROR! Could not get flowers!');
    return null;
  }

  return data;
}

async function getSuggestions(token) {
  const supabase = await getSupabaseClient(token);
  const { data, error } = await supabase.from('flower_suggestions').select();

  if (error) {
    console.error('ERROR! Could not get flower suggestions!');
    return null;
  }

  return data;
}

async function getFlower(id, token) {
  const supabase = await getSupabaseClient(token);
  const { data, error } = await supabase.from('flowers').select().eq('id', id);

  if (error) {
    console.error('ERROR! Could not get flower with id: ', id);
    return null;
  }

  const flower = data[0];
  return flower;
}

async function getSuggestion(id, token) {
  const supabase = await getSupabaseClient(token);
  const { data, error } = await supabase
    .from('flower_suggestions')
    .select()
    .eq('id', id);

  if (error) {
    console.error('ERROR! Could not get flower suggestion with id: ', id);
    return null;
  }

  const flower = data[0];
  return flower;
}

async function insertFlower(flower, token) {
  const supabase = await getSupabaseClient(token);
  const { data, error } = await supabase
    .from('flowers')
    .insert([
      {
        name_bg: flower.nameBg,
        name_eng: flower.nameEng,
        name_latin: flower.nameLatin,
        image_url: flower.filepath,
      },
    ])
    .select();

  if (error) {
    console.error('ERROR! Could not insert flower: ', error.message);
    return null;
  }

  return data[0];
}

async function insertSuggestion(flower, token) {
  const supabase = await getSupabaseClient(token);
  const { data, error } = await supabase
    .from('flower_suggestions')
    .insert([
      {
        name_bg: flower.nameBg,
        name_eng: flower.nameEng,
        name_latin: flower.nameLatin,
        image_url: flower.filepath,
      },
    ])
    .select();

  if (error) {
    console.error('ERROR! Could not insert flower suggestion: ', error.message);
    return null;
  }

  return data[0];
}

async function deleteFlower(id, token) {
  const supabase = await getSupabaseClient(token);
  try {
    await supabase.from('flowers').delete().eq('id', id);
    return true;
  } catch (error) {
    console.error('ERROR! Could not delete flower with id: ', id);
    return false;
  }
}

async function deleteSuggestion(id, token) {
  const supabase = await getSupabaseClient(token);
  try {
    await supabase.from('flower_suggestions').delete().eq('id', id);
    return true;
  } catch (error) {
    console.error('ERROR! Could not delete flower suggestion with id: ', id);
    return false;
  }
}

module.exports.saveImage = saveImageToSupabaseAsWebp;
module.exports.deleteImage = removeImageFromSupabase;
module.exports.getFlowers = getFlowers;
module.exports.getSuggestions = getSuggestions;
module.exports.getFlower = getFlower;
module.exports.getSuggestion = getSuggestion;
module.exports.saveFlower = insertFlower;
module.exports.saveSuggestion = insertSuggestion;
module.exports.deleteFlower = deleteFlower;
module.exports.deleteSuggestion = deleteSuggestion;

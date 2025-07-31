const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, '../client')));

app.post('/compress', upload.single('video'), (req, res) => {
  const inputPath = req.file.path;
  const outputPath = path.join('uploads', `output_${Date.now()}.mp4`);

  ffmpeg(inputPath)
    .videoCodec('libx264')
    .size('640x360')
    .outputOptions('-crf 28')
    .on('end', () => {
      res.download(outputPath, () => {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      });
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Erro ao processar vídeo');
    })
    .save(outputPath);
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
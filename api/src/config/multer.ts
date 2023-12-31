import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({
    destination: "../frontend/public/uploads/",
    filename: function (req, file, cb) {
      // Extração da extensão do arquivo original:
      const extensaoArquivo = file.originalname.split('.')[1];

      // Cria um código randômico que será o nome do arquivo
      const novoNomeArquivo = require('crypto')
        .randomBytes(64)
        .toString('hex');

      // Indica o novo nome do arquivo:
      cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
    }
  }),
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 }
})

export { upload };


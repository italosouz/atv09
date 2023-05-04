const express = require('express');
const router = express.Router();
const produtoMid = require('../middlewares/validarProduto.middleware');
const { Produto } = require('../database/models');
const { Tag } = require('../database/models');
const path = require('path');
const multer = require('multer');
const moment = require('moment');
moment.locale('pt-br');

const storage = multer.diskStorage({
    destination: function (requisicao, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (requisicao, file, cb) {
        const uniqueSuffix = Date.now() + path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

const fileFilter = (requisicao, file, cb) => {
    const extensoes = /jpeg|jpg|png/i

    if (extensoes.test(path.extname(file.originalname))) {
        cb(null, true);
    } else {
        return cb('Arquivo não suportado. Apenas Jpeg, Jpg e PNG são suportados.');
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post('/', upload.single('foto'));
router.post('/', produtoMid);
router.put('/', produtoMid);

//Enviar dados
router.get('/', async (requisicao, resposta) => {
    const produtos = await Produto.findAll();
    const imgNada = '/static/uploads/nada.png';
    const produtosFinal = produtos.map(produto => {
        return formatarData(produto);
    });
    resposta.render('pages/produtos/index', {produtos: produtosFinal, imgNada: imgNada});
});

//Enviar dado pela PK
router.get('/:id', async (requisicao, resposta) => {
    const produto = await Produto.findByPk(requisicao.params.id);

    resposta.json({ Produto: produto });
});

//Receber dados
router.post('/', async (requisicao, resposta) => {
    const data = requisicao.body;

    const produto = await Produto.create(data);

    const DataTag = requisicao.body.tags;

    if (DataTag) {
        DataTag.forEach(async value => {
            await Tag.create({ texto: value, produtoId: produto.id })
        });

    } else {
        await Produto.create(data);
    }
    resposta.json({ Msg: `O produto ${produto.nome} foi cadastrado com sucesso!` });
});

router.post('/:id/upload', upload.single('foto'), async (requisicao, resposta) => {
    const id = requisicao.params.id;
    const produto = await Produto.findByPk(id);

    if (produto) {
        produto.foto = `/static/uploads/${requisicao.file.filename}`;
        await produto.save();
        resposta.json({ msg: 'Upload realizado com sucesso.' });
    } else {
        resposta.status(400).json({ msg: 'Produto não encontrado' });
    }
})

//Atualizar dados do produto
router.put('/', async (requisicao, resposta) => {
    const id = requisicao.query.id;
    const produto = await Produto.findByPk(id);

    if (produto) {
        produto.nome = requisicao.body.nome;
        produto.descricao = requisicao.body.descricao;
        produto.preco = requisicao.body.preco;
        await produto.save();

        resposta.json({ Msg: `Produto atualizado com sucesso!` });
    } else {
        resposta.json({ Msg: `Produto não localizado!` });
    }
});

//Deletar dados
router.delete('/', async (requisicao, resposta) => {
    const id = requisicao.query.id;
    const produto = await Produto.findByPk(id);
    const produtoAnterior = produto;

    if (produto) {
        await produto.destroy();

        resposta.json({ Msg: `Produto ${produtoAnterior.nome} excluído com sucesso!` });
    } else {
        resposta.json({ Msg: `Produto não localizado!` });
    }
});

function formatarData(produto) {
    const aux = JSON.parse(JSON.stringify(produto))
    aux.postadoEm = moment(new Date(aux.createdAt)).format('DD [de] MMMM [de] yyyy [as] HH:mm')
    if(aux.preco) {
        aux.preco = parseFloat(aux.preco).toFixed(2);
    }
    if(aux.precoPromocao) {
        aux.precoPromocao = parseFloat(aux.precoPromocao).toFixed(2);
    }
    return aux;
}

module.exports = router;

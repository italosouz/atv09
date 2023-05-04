const Ajv = require("ajv");
const ajv = new Ajv();
const produtoSchema = require('../schemas/produto.schema');

const validarProduto = (requisicao, resposta, next) => {
    const produto = requisicao.body;

    if(produto.preco) {
        produto.preco = Number(produto.preco)
    }

    const valid = ajv.validate(produtoSchema, produto);

    if(valid) {
        next();
    } else {
        resposta.status(400).json({msg: 'Dados Inválidos', erro: ajv.errors});
    }
}

module.exports = validarProduto;
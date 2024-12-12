const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro e recuperação de respostas', () => {
  const idPergunta = modelo.cadastrar_pergunta('Qual é a capital da França?');
  const idResposta = modelo.cadastrar_resposta(idPergunta, 'Paris');

  const respostas = modelo.get_respostas(idPergunta);
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe('Paris');
  expect(respostas[0].id_pergunta).toBe(idPergunta);
});

test('Testando contagem de respostas', () => {
  const idPergunta = modelo.cadastrar_pergunta('Qual é a capital da Alemanha?');
  modelo.cadastrar_resposta(idPergunta, 'Berlim');
  modelo.cadastrar_resposta(idPergunta, 'Berlin');

  const numRespostas = modelo.get_num_respostas(idPergunta);
  expect(numRespostas).toBe(2);
});

test('Testando recuperação de pergunta específica', () => {
  const idPergunta = modelo.cadastrar_pergunta('Qual é a capital do Brasil?');
  
  const pergunta = modelo.get_pergunta(idPergunta);
  expect(pergunta.id_pergunta).toBe(idPergunta);
  expect(pergunta.texto).toBe('Qual é a capital do Brasil?');
});

test('Testando cadastro de resposta para pergunta inexistente', () => {
  const idInexistente = "9999"; // ID da pergunta que não existe
  const resultado = modelo.cadastrar_resposta(idInexistente, 'Resposta para pergunta inexistente');

  // Verifica se o resultado é um erro, indicando que a resposta não foi cadastrada
  expect(resultado).toBe('Pergunta inexistente.');
});

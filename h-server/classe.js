const utils = require('./utils');

Parse.Cloud.define('createClasse', async (request) => {
  const params = request.params;
  const cuser = request.user;

  // Vérifier si l'utilisateur est un administrateur
  const cuserRole = await utils.getRoleByUser(cuser);

  if (!cuserRole || cuserRole.getName() !== 'admin') {
    throw 'NOT_AUTHORIZED';
  }

  // créer une classe
  const Classe = Parse.Object.extend('Classe');
  const classe = new Classe();

  classe.set('name', params.name);

  return classe.save();
});

Parse.Cloud.define('deleteClasse', async (request) => {
  const params = request.params;
  const cuser = request.user;

  const cuserRole = await utils.getRoleByUser(cuser);

  if (!cuserRole || cuserRole.getName() !== 'admin') {
    throw 'NOT_AUTHORIZED';
  }

  const query = new Parse.Query('Classe');

  const classe = await query.get(params.id);

  return classe.destroy();
});

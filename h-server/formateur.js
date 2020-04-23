const utils = require('./utils');

Parse.Cloud.define('createFormateur', async (request) => {
  const params = request.params;
  const cuser = request.user;

  // Vérifier si l'utilisateur est un administrateur
  const cuserRole = await utils.getRoleByUser(cuser);

  if (!cuserRole || cuserRole.getName() !== 'admin') {
    throw "N'est pas autorisé";
  }

  // Créer un utilisateur
  const user = new Parse.User();
  user.set('name', params.name);
  user.set('dat', params.dat);
  user.set('email', params.email);
  user.set('username', params.email);
  user.set('phone', params.phone);
  user.set('password', params.password);
  user.set('type', 'formateur');

  // Enregister l'utilisateur crée
  await user.save();
  // Ajouer l'utilisateur à la relation
  const query = new Parse.Query('Classe');
  const classe = await query.get(params.classe.objectId);
  const relation = classe.relation('users');
  relation.add(user);
  await classe.save(null, { useMasterKey: true });

  // Ajouter l'utilisateur crée au role formateur
  const role = await utils.getRoleByName('formateur');
  role.getUsers().add(user);
  await role.save(null, { useMasterKey: true });

  // Envoyer le mail au formateur crée
  await Parse.User.requestPasswordReset(params.email);

  return 'Formateur_crée';
});
Parse.Cloud.define('deleteFormateur', async (request) => {
  const params = request.params;
  const cuser = request.user;

  const cuserRole = await utils.getRoleByUser(cuser);

  if (!cuserRole || cuserRole.getName() !== 'admin') {
    throw "N'est pas autorisé";
  }

  const query = new Parse.Query('User');

  const formateur = await query.get(params.id);

  return formateur.destroy({ useMasterKey: true });
});

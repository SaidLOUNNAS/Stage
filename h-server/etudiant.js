const utils = require('./utils');

Parse.Cloud.define('createEtudiant', async (request) => {
  const params = request.params;
  const cuser = request.user;

  // Vérifier si l'utilisateur est un administrateur
  const cuserRole = await utils.getRoleByUser(cuser);

  if (!cuserRole || cuserRole.getName() !== 'admin') {
    throw "N'est pas autorisé";
  }

  const user = new Parse.User();
  user.set('name', params.name);
  user.set('date_naissance', params.date_naissance);
  user.set('email', params.email);
  user.set('username', params.email);
  user.set('phone', params.phone);
  user.set('password', params.password);
  user.set('type', 'etudiant');

  // Enregister l'utilisateur crée
  await user.save();

  // Ajouer l'utilisateur à la relation
  const query = new Parse.Query('Classe');
  const classe = await query.get(params.classe.objectId);
  const relation = classe.relation('users');
  relation.add(user);
  await classe.save(null, { useMasterKey: true });

  // Ajouter l'utilisateur crée au role étudiant
  const role = await utils.getRoleByName('etudiant');
  role.getUsers().add(user);
  await role.save(null, { useMasterKey: true });

  // Envoyer le mail à l'étudiant crée
  await Parse.User.requestPasswordReset(params.email);

  return 'Etudiant_crée';
});

Parse.Cloud.define('deleteEtudiant', async (request) => {
  const params = request.params;
  const cuser = request.user;

  const cuserRole = await utils.getRoleByUser(cuser);

  if (!cuserRole || cuserRole.getName() !== 'admin') {
    throw "N'est pas autorisé";
  }

  const query = new Parse.Query('User');

  const etudiant = await query.get(params.id);

  return etudiant.destroy({ useMasterKey: true });
});

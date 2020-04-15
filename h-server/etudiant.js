const utils = require('./utils');

Parse.Cloud.define('createEtudiant', async (request) => {
  const params = request.params;
  const cuser = request.user;

  // Vérifier si l'utilisateur est un administrateur
  const cuserRole = await utils.getRoleByUser(cuser);

  if (!cuserRole || cuserRole.getName() !== 'admin') {
    throw 'NOT_AUTHORIZED';
  }

  // Créer un utilisateur
  const user = new Parse.User();
  user.set('name', params.name);
  user.set('email', params.email);
  user.set('username', params.email); // complete database
  user.set('password', params.password);
  user.set('type', 'etudiant');

  // Enregister l'utilisateur crée
  await user.save(null, { useMasterKey: true });

  // Ajouter l'utilisateur crée au role étudiant
  const role = await utils.getRoleByName('etudiant');
  role.getUsers().add(user);

  // Enregister le role
  await role.save(null, { useMasterKey: true });

  // Envoyer le mail à l'étudiant crée
  await Parse.User.requestPasswordReset(params.email);

  return 'USER_CREATED';
});

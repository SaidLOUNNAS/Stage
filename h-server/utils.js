const getRoleByUser = (user) => {
  const query = new Parse.Query(Parse.Role);
  query.equalTo('users', user);
  return query.first();
};

const getRoleByName = (name) => {
  const query = new Parse.Query(Parse.Role);
  query.equalTo('name', name);
  return query.first();
};

module.exports = { getRoleByUser, getRoleByName };

module.exports = (sequelize, DataTypes) => {
  const Collaborator = sequelize.define('Collaborator', {
  	wikiId: {
  		type: DataTypes.INTEGER,
  		allowNull: false
  	},
  	userId: {
  		type: DataTypes.INTEGER,
  		allowNull: false
  	},
  }, {});

  Collaborator.associate = function(models) {
    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });

    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };

  return Collaborator;
};
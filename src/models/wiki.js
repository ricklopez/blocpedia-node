module.exports = (sequelize, DataTypes) => {
  const Wiki = sequelize.define('Wiki', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    private: DataTypes.BOOLEAN,
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});

  Wiki.associate = function(models) {
    Wiki.belongsTo(models.User, {
      foreignKey: "UserId"
    });

    Wiki.hasMany(models.Collaborator, {
      foreignKey: "wikiId",
      as: "collaborators",
      onDelete: "CASCADE"
    });

  };

  return Wiki;
};
module.exports = function(sequelize, Sequelize) {
    const Vehicule = sequelize.define(
        'vehicule', {
            numChassis: {
                type: Sequelize.INTEGER,
                primaryKey: true,
            },
            numImmatriculation: {
                type: Sequelize.INTEGER,
            },
            modele: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            marque: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            couleur: {
                type: Sequelize.STRING,
                allowNull: false
            },
            etat: {
                type: Sequelize.STRING,
            },
            tempsDeRefroidissement: {
                type: Sequelize.INTEGER,
            },
            pressionHuileMoteur: {
                type: Sequelize.INTEGER,
            },
            chargeBatterie: {
                type: Sequelize.INTEGER,
            },
            anomalieCircuit: {
                type: Sequelize.STRING,
            },
            pressionPneus: {
                type: Sequelize.INTEGER,
            },
            niveauMinimumHuile: {
                type: Sequelize.INTEGER,
            },
            regulateurVitesse: {
                type: Sequelize.INTEGER,
            },
            limiteurVitesse: {
                type: Sequelize.INTEGER,
            },
            idAgentMaintenance: {
                type: Sequelize.INTEGER,
            },
            idBorne: {
                type: Sequelize.INTEGER,
            }

        }, {
            freezeTableName: true,
            tableName: 'vehicule',
            createdAt: false,
            updatedAt: false
        }
    );
    // Déclaration des clès étrangères
     Vehicule.associate = (models) => {
         Vehicule.belongsTo(models.utilisateur, {
        foreignKey: 'idAgentMaintenace',
         });
    Vehicule.belongsTo(models.borne, {
           foreignKey: 'idBorne',
         });
    }

    return Vehicule;
};

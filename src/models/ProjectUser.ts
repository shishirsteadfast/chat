import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Project } from './Project';
import { User } from './User';

export interface ProjectUserAttributes {
  id: number;
  project_id: number;
  user_id: number;
  role: 'member' | 'admin';
  created_at: Date;
}

export interface ProjectUserCreationAttributes
  extends Optional<ProjectUserAttributes, 'id' | 'role' | 'created_at'> {}

export class ProjectUser
  extends Model<ProjectUserAttributes, ProjectUserCreationAttributes>
  implements ProjectUserAttributes
{
  public id!: number;
  public project_id!: number;
  public user_id!: number;
  public role!: 'member' | 'admin';
  public created_at!: Date;
}

ProjectUser.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    project_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('member', 'admin'),
      allowNull: false,
      defaultValue: 'member',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'project_users',
    timestamps: false,
  }
);

// Associations
Project.hasMany(ProjectUser, { foreignKey: 'project_id' });
ProjectUser.belongsTo(Project, { foreignKey: 'project_id' });

User.hasMany(ProjectUser, { foreignKey: 'user_id' });
ProjectUser.belongsTo(User, { foreignKey: 'user_id' });

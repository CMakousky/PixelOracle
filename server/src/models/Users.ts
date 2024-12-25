import { DataTypes, Sequelize, Model, Optional} from 'sequelize';
import { Game } from './Games';
import bcrypt from 'bcrypt';

interface UserAttributes {
  user_id: number;
  username: string;
  email: string;
  password: string;
  favorites: Game[];
}

interface UserCreationAttributes extends Optional<UserAttributes, 'user_id' | 'favorites'>  {}

export class User 
extends Model<UserAttributes, UserCreationAttributes> 
implements UserAttributes 
{
  public user_id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public favorites!: Game[];

  // Hash the password before saving the user
  public async setPassword(password: string) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(password, saltRounds);
  }
}

export function UserFactory(sequelize: Sequelize): typeof User {
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      favorites:
      {
        type: DataTypes.JSON,
        defaultValue: []
      }
    },
    {
      sequelize,
      // Manually define the table name
      tableName: 'User',
      // Set to false to remove the `created_at` and `updated_at` columns
      timestamps: false,
      underscored: true,
      freezeTableName: true,
      hooks: {
        beforeCreate: async (user: User) => {
          await user.setPassword(user.password);
        },
        // beforeUpdate: async (user: User) => {
        //   await user.setPassword(user.password);
        // },
      },
    }
  );

  return User;
}

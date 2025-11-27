// src/models/index.ts
import { sequelize } from '../config/db';
import { Admin } from './Admin';
import { Project } from './Project';
import { PasswordResetToken } from './PasswordResetToken';
import { User } from './User';
import { ProjectUser } from './ProjectUser';
import { Conversation } from './Conversation';
import { ConversationParticipant } from './ConversationParticipant';
import { Message } from './Message';

export async function initModels() {
  await sequelize.authenticate();
  // In production with manual SQL, DO NOT use sync.
  // await sequelize.sync();
}

export {
  Admin,
  Project,
  PasswordResetToken,
  User,
  ProjectUser,
  Conversation,
  ConversationParticipant,
  Message,
};

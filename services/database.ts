
import { User, UserProgress, ProgrammingLanguage } from '../types';

const DB_USERS_KEY = 'codesage_db_users';
const SESSION_KEY = 'codesage_active_session';

interface DBUser extends User {
  id: string;
  email?: string;
  avatarUrl?: string;
  provider: 'local' | 'google' | 'github' | 'facebook';
  progress: UserProgress;
}

const DEFAULT_PROGRESS: UserProgress = {
  selectedLanguage: null,
  languageData: {},
  unlockedAchievements: []
};

export const MockDB = {
  // Get all users in the "database"
  getAllUsers: (): DBUser[] => {
    const data = localStorage.getItem(DB_USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Save/Update a user
  saveUser: (user: DBUser) => {
    const users = MockDB.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
  },

  // Find a user by username or ID
  findUser: (identifier: string): DBUser | undefined => {
    return MockDB.getAllUsers().find(u => u.id === identifier || u.username === identifier);
  },

  // Simulate a Login (Local or Social)
  login: (username: string, provider: DBUser['provider'] = 'local', email?: string): DBUser => {
    const id = `${provider}_${username.toLowerCase().replace(/\s+/g, '_')}`;
    let user = MockDB.findUser(id);

    if (!user) {
      // Create new account if doesn't exist (simulated registration)
      user = {
        id,
        username,
        email: email || `${username.toLowerCase()}@example.com`,
        provider,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        progress: { ...DEFAULT_PROGRESS }
      };
      MockDB.saveUser(user);
    }

    // Migration check: Ensure unlockedAchievements exists
    if (!user.progress.unlockedAchievements) {
      user.progress.unlockedAchievements = [];
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  // Update Progress for the current user
  updateProgress: (userId: string, progress: UserProgress) => {
    const user = MockDB.findUser(userId);
    if (user) {
      user.progress = progress;
      MockDB.saveUser(user);
      // Also update active session if it's the same user
      const session = MockDB.getActiveSession();
      if (session && session.id === userId) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }
    }
  },

  // Get current active session
  getActiveSession: (): DBUser | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  }
};

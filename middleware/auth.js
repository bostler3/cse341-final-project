const passport = require('passport');
const GitHubStrategy = require('passport-github2');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

// GitHub OAuth Strategy Configuration
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:8080/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = mongodb.getDatabase().db('movies');

        // Find or create user from GitHub profile
        let user = await db.collection('users').findOne({ githubId: profile.id });

        if (!user) {
          // Create a new user if doesn't exist
          const newUser = {
            githubId: profile.id,
            firstName: profile.displayName?.split(' ')[0] || profile.username,
            lastName: profile.displayName?.split(' ').slice(1).join(' ') || '',
            email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
            profileUrl: profile.profileUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const result = await db.collection('users').insertOne(newUser);
          user = { _id: result.insertedId, ...newUser };
        }

        return done(null, user);
      } catch (error) {
        console.error('OAuth error:', error);
        return done(error);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const db = mongodb.getDatabase().db('movies');
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (error) {
    console.error('Deserialization error:', error);
    done(error);
  }
});

module.exports = passport;

const { AuthenticationError } = require('apollo-server-express');
const { User, Event, Attendee, Item } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // type Query {
    //   me: User
    //   users: [User]
    //   user(username: String!): User
    //   events(username: String): [Event]
    //   event(_id: ID!): Event
    // }

    me: async () => {

    },
    users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('events');
    },
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('events');
    },
    events: async (parent, { username }) => {
      const params = username? { username } : {};
      return Event.find(params)
        .sort({ createdAt: -1 });
    },
    event: async (parent, { _id }) => {
      return Event.findOne({ _id });
    }
    // ...
  },
  

  Mutation: {
    // type Mutation {
    //   login(email: String!, password: String!): Auth
    //   addUser(username: String!, email: String!, password: String!): Auth
    //   addEvent(name: String!, date: String!, description: String!): Event
    //   addItem(eventId: ID!, name: String!): Event
    //   addAttendee(eventId: ID!, nickname: String!, attending: Boolean!): Attendee
    // }
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect login information');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect login information');
      }

      const token = signToken(user);
      return { token, user };
    },
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addEvent: async (parent, args, context) => {
      if (context.user) {
        const event = await Event.create({ ...args, username: context.user.username });
        
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { events: event._id } },
          { new: true }
        );

        return event;
      }

      throw new AuthenticationError('You must be logged in to create an event');
    }

  }
  
};

module.exports = resolvers;

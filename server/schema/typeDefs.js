const { gql } = require('apollo-server-express');

// Trim queries/mutations and return values to needed fields only
const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    events: [Event]
    eventCount: Int
    token: String
  }

  type Event {
    _id: ID
    host: String
    name: String
    timestamp: String
    date: String
    completed: Boolean
    description: String
    items: [Item]
    attendees: [Attendee]
    attendeeCount: Int
    hasEverything: Boolean
    token: String
  }

  type Item {
    _id: ID
    eventId: String
    name: String
    broughtBy: String
    claimed: Boolean
  }

  type Attendee {
    _id: ID
    eventId: String
    nickname: String
    respondedAt: String
    comment: String
    items: [Item]
    bringingSomething: Boolean
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
    user(username: String!): User
    events(username: String): [Event]
    event(_id: ID!): Event
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addEvent(name: String!, timestamp: String!, description: String!, items: String): Event
    addItem(eventId: ID!, name: String!): Event
    sendRSVP(eventId: ID!, nickname: String!, comment: String, items: String): Event
    deleteEvent(eventId: ID!): Boolean
    updateEvent(eventId: ID!, name: String, date: String, description: String, items: String): Event
  }
`;

module.exports = typeDefs;
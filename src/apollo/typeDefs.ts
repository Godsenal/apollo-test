import { gql } from "apollo-boost";

const typeDefs = gql`
  extend type Query {
    device: Device!
  }

  extend type Repositry {
    isChinese: Boolean!
  }

  type Device {
    vender: String
    model: String
    type: String
  }
`;

export default typeDefs;

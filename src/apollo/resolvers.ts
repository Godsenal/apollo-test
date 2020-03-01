import { gql, InMemoryCache } from "apollo-boost";
import { Device } from "../model";

type ResolverFn = (
  parent: any,
  args: any,
  { cache }: { cache: InMemoryCache }
) => any;

type ResolverMap = {
  [field: string]: ResolverFn;
};

type AppResolver = {
  Query: ResolverMap;
  Repository: ResolverMap;
};

const resolvers: AppResolver = {
  Query: {
    device: (_, __, { cache }) => {
      const getDevice = gql`
        query getDevice {
          device @client
        }
      `;

      const result = cache.readQuery<{ device: Device }>({
        query: getDevice
      });

      if (result) {
        return result;
      }

      return false;
    }
  },
  Repository: {
    isChinese: args => {
      if (
        [args.name, args.description].some(
          text => text && text.match(/[\u3400-\u9FBF]/)
        )
      ) {
        return true;
      }
      return false;
    }
  }
};

export default resolvers;

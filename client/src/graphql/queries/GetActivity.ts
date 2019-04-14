import {gql} from "apollo-boost";

export default gql`
    query {
        activity {
            likes
            follows
            startedAt
        }
    }
`;

import {gql} from "apollo-boost";

export default gql`
    query {
        history {
            name
            date
            payload {
                name
                value
            }
        }
    }
`;

import { RESULT_INFO_FRAGMENT } from '@graphql/operations/fragment/result-info';
import { USER_FRAGMENT } from '@graphql/operations/fragment/user';
import gql from 'graphql-tag';

// Graphql getLogin.
export const LOGIN_QUERY = gql`
    query getLogin($email: String!, $password: String!, $include:Boolean!) {
        login(email: $email, password: $password){
            status
            message
            token
            user {
                ...UserObject
            }
        }
    }
    ${ USER_FRAGMENT }
`;

// Graphql users.
export const USERS_LIST_QUERY = gql`
    query usersList($include: Boolean!, $page: Int, $itemsPage: Int, $active: ActiveFilterEnum){
        users(page: $page, itemsPage: $itemsPage, active: $active){
            info{
                ...ResultInfoObject
            }
            status
            message
            users {
                ...UserObject
            }
        }
    }
    ${ USER_FRAGMENT }
    ${ RESULT_INFO_FRAGMENT }
`;

// Graphql me.
export const ME_DATA_QUERY = gql`
    query meData($include: Boolean!){
        me {
            status
            message
            user {
                ...UserObject
            }
        }
    }
    ${ USER_FRAGMENT }
`;

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename?: 'Mutation';
  createPermission?: Maybe<Permission>;
  createUser?: Maybe<User>;
  deletePermission?: Maybe<Scalars['Boolean']['output']>;
  deleteUser?: Maybe<Scalars['Boolean']['output']>;
  updatePermission?: Maybe<Permission>;
  updateUser?: Maybe<User>;
};


export type MutationCreatePermissionArgs = {
  input?: InputMaybe<PermissionInput>;
};


export type MutationCreateUserArgs = {
  input?: InputMaybe<UserInput>;
};


export type MutationDeletePermissionArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationDeleteUserArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdatePermissionArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  input?: InputMaybe<PermissionInput>;
};


export type MutationUpdateUserArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
  input?: InputMaybe<UserInput>;
};

export type Permission = {
  __typename?: 'Permission';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  modifiedBy?: Maybe<Scalars['String']['output']>;
  modifiedDate?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  version?: Maybe<Scalars['Int']['output']>;
};

export type PermissionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  version?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  getAllPermissions?: Maybe<Array<Maybe<Permission>>>;
  getAllUsers?: Maybe<Array<Maybe<User>>>;
  getPermission?: Maybe<Permission>;
  getUser?: Maybe<User>;
  getUsersSize?: Maybe<Scalars['Int']['output']>;
};


export type QueryGetAllPermissionsArgs = {
  direction?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetAllUsersArgs = {
  direction?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetPermissionArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetUserArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  modifiedBy?: Maybe<Scalars['String']['output']>;
  modifiedDate?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<Maybe<Permission>>>;
  version?: Maybe<Scalars['Int']['output']>;
};

export type UserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissionIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  version?: InputMaybe<Scalars['Int']['input']>;
};

export type GetAllPermissionsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['String']['input']>;
  direction?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAllPermissionsQuery = { __typename?: 'Query', getAllPermissions?: Array<{ __typename?: 'Permission', id: string, name: string } | null> | null };


export const GetAllPermissionsDocument = gql`
    query getAllPermissions($page: Int, $size: Int, $sort: String, $direction: String) {
  getAllPermissions(page: $page, size: $size, sort: $sort, direction: $direction) {
    id
    name
  }
}
    `;

/**
 * __useGetAllPermissionsQuery__
 *
 * To run a query within a React component, call `useGetAllPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPermissionsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      size: // value for 'size'
 *      sort: // value for 'sort'
 *      direction: // value for 'direction'
 *   },
 * });
 */
export function useGetAllPermissionsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllPermissionsQuery, GetAllPermissionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllPermissionsQuery, GetAllPermissionsQueryVariables>(GetAllPermissionsDocument, options);
      }
export function useGetAllPermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllPermissionsQuery, GetAllPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllPermissionsQuery, GetAllPermissionsQueryVariables>(GetAllPermissionsDocument, options);
        }
export function useGetAllPermissionsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllPermissionsQuery, GetAllPermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllPermissionsQuery, GetAllPermissionsQueryVariables>(GetAllPermissionsDocument, options);
        }
export type GetAllPermissionsQueryHookResult = ReturnType<typeof useGetAllPermissionsQuery>;
export type GetAllPermissionsLazyQueryHookResult = ReturnType<typeof useGetAllPermissionsLazyQuery>;
export type GetAllPermissionsSuspenseQueryHookResult = ReturnType<typeof useGetAllPermissionsSuspenseQuery>;
export type GetAllPermissionsQueryResult = Apollo.QueryResult<GetAllPermissionsQuery, GetAllPermissionsQueryVariables>;
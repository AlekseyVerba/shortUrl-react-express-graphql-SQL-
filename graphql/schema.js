const {buildSchema} = require("graphql")

module.exports = buildSchema(`
    scalar Upload
    
    input UserInput {
        name: String!
        surname: String!
        city: String
        birthday: String
        email: String!
        password: String!
    }

    input UserInputWithoutPassword {
        name: String!
        surname: String!
        city: String
        birthday: String
        email: String!
    }

    input addDescription {
        id: Int!
        description: String!
    }

    type User {
        name: String!
        surname: String!
        city: String
        birthday: String
        email: String!
        imgUser: String
    }

    input authInfo {
        login: String!
        password: String!
    }

    input updatePassword {
        newPassword: String!
        token: String!
    }

    type SuccesAddUser {
        status: Boolean!
        message: String!
    }

    type StatusToken {
        status: Boolean!
        message: String!
    }

    type StatusTokenPassword {
        status: Boolean!
        message: String!
    }

    type StatusAuth {
        status: Boolean!
        message: String!
    }

    type StatusUpdatePassword {
        status: Boolean!
        message: String!
    }

    type StatusSubmitCodeReset {
        status: Boolean!
        message: String!
    }

    type infoAuth {
        user: User
        status: StatusAuth!
        userInfo: UserInfo
    }

    type UserInfo {
        tokenUser: String!
        userId: Int!
    }

    type StatusCreateLink {
        status: Boolean!
        message: String!
        urlLink: String
    }

    type Link {
        id: Int!
        from: String!
        to: String!
        code: String!
        clicks: Int!
        shortDescription: String
        created: String!
    }

    type statusGetLinks {
        links: [Link]!
        status: Boolean!
        message: String!
    }

    type StatusDeleteLink {
        status: Boolean!
        message: String!
    }

    type StatusRedirectToUrl {
        status: Boolean!
        message: String!
        url: String
    }

    type StatusAddDescription {
        status: Boolean!
        message: String!
    }


    type statusCurrentUser {
        status: Boolean!
        message: String!
    }
    
    type StatusGetCurrentUser {
        status: statusCurrentUser!
        user: User
    }

    type StatusUpdateProfile {
        status: Boolean!
        message: String!
    }


    type Query {
        test: String!
        checkAuth(authInfo: authInfo!): infoAuth!
        getLinks(string:String): statusGetLinks!
        redirectToUrl(code: String!): StatusRedirectToUrl!
        getCurrentUser(string: String): StatusGetCurrentUser!
    }


    type Mutation {
        addUser(user: UserInput!): SuccesAddUser!
        checkToken(token: String!): StatusToken!
        checkTokenPassword(token: String!): StatusTokenPassword!
        resetPassword(email: String!): StatusSubmitCodeReset!
        updatePassword(info:updatePassword!): StatusUpdatePassword!
        createLink(link: String!): StatusCreateLink!
        deleteLink(id: Int!): StatusDeleteLink!
        changeDescription(info: addDescription!): StatusAddDescription!
        updateProfile(user: UserInputWithoutPassword!): StatusUpdateProfile!
    }
`)
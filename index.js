const bodyParser = require("body-parser");
const express = require("express");

//returns an object
const { buildSchema } = require("graphql"); //a function that takes js literal to build schema

//to be used in the place where express expects middleware fn
//funnels request to the correct resolvers
const graphqlHttp = require("express-graphql");

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  graphqlHttp({
    //define the schema that'll be exposed to the front end
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
        type RootMutation {
            createEvent(name: String): String 
        }
        schema { 
            query: RootQuery
            mutation: RootMutation 

        }
        `),
    //needs to point to valid graphql schema
    //points at js obj that contains resolver fns... resolver names must match
    //essentially, this is the logic behind handling requests
    rootValue: {
      //run when incoming req asks for events ppty
      events: () => {
        return ["romantic", "sailing", "coding"];
      },
      createEvent: (args) => {
        //as defined above, must return a String. Args is an obj!
        const result = args.name;
        return result;

      }
    },
    graphiql: true, //just for dev purposes so we don't need front end to test backend
  })
);

const port = 3000;
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

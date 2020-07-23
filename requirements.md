# Requirement Log

## GET Requirements

    Make two new databases, bookmarks and bookmarks-test.
    
    Write the first migration inside the bookmarks-server project that creates the table for bookmarks. Then use the migration to create the tables in both new databases.
    
        The table should contain fields for id, title, url, description and rating
    
        The description is the only optional field
        
        Choose suitable data types for each column
    
    Refactor the GET /bookmarks endpoint and tests. The endpoint should use the database tables.
        
        You'll need to wire up Knex into your server and tests.
        
        Write a BookmarksService object in the bookmarks-server project that will support CRUD for bookmarks using Knex.
        
        You should use fixtures in your tests for the GET /bookmarks and GET /bookmarks/:bookmark_id
        
        Write tests for how each endpoint behaves when the database is empty
    
    Write seeding scripts to insert dummy bookmarks into the database tables so you can check that the refactored endpoints work when your server is running locally.

In the next checkpoint, we're going to work on POST and DELETE requests with express and PostgreSQL so you don't need to refactor those endpoints in the bookmarks-server project for this assignment. At the end of this assignment, your project will be using a mix of both the database and in-memory JavaScript storage.


## POST / DELETE Requirements

Assignment

Your assignment is to further refactor your Bookmarks API project, bookmarks-server, to support persistence of POSTed and DELETEd items. In the previous checkpoint's assignment you refactored the bookmarks-server to use a database for GET requests, now you'll continue this process to use the database for the remaining endpoints.

By the end of this assignment, you should no longer need to store any bookmarks in JavaScript memory as the bookmarks will be persisted in your database.
Requirements

    Refactor your POST handler to support inserting bookmarks into the database.

        Refactor or implement the integration tests for POSTing bookmarks as well as making sure appropriate responses get sanitized.
        
        You should also test that your POST /bookmarks endpoint validates each bookmark to have the required fields in valid formats. For example, rating should be a number between 1 and 5.
        
        If your POST endpoint responds with the newly created bookmark, make sure that appropriate fields get sanitized.
        
    Refactor your DELETE handler to support removing bookmarks from the database.
    
        Refactor or implement the integration tests for DELETEing bookmarks as well as making sure the DELETE responds with a 404 when the bookmark doesn't exist.
        
    Refactor your GET methods and tests to ensure that all bookmarks get sanitized.
    

This assignment should take about 3 hours to complete. If you're having trouble, attend a Q&A session or reach out on Slack for help.

## Full Stack Requirements

The requirements for this assignment are for adding a full-stack "update" feature to your bookmarks project. This will involve writing an implementation for both your client and server.

### Bookmarks API

    Add an endpoint to support updating bookmarks using a PATCH request

    Ensure the Bookmarks API has a uniform RESTful interface. For example, are the endpoints consistently named?
    
    Update all of the endpoints to use the /api prefix
    
    Write integration tests for your PATCH request to ensure:
        It requires the bookmark's ID to be supplied as a URL param
        It responds with a 204 and no content when successful
        It updates the bookmark in your database table
        It responds with a 400 when no values are supplied for any fields (title, url, description, rating)
        It allows partial updates, for example, only supplying a new title will only update the title for that item
    
    Write the appropriate API code to make these tests pass

### Bookmarks App

    The React project should be using your local bookmarks API as its API_ENDPOINT for local development.
    
    Create a new Route that will contain a form for editing bookmarks
    
    Create a component that contains a form for updating bookmarks
    
    On your list of bookmarks, add a button/link on each bookmark that links to the edit route for that bookmark
        You can either: use a Link from react-router-dom
        or use a button that calls history.push when it's clicked
    
    The edit bookmark form should display fields that are pre-populated with the existing bookmark's field values
    
    The edit bookmark form should submit a PATCH request to your bookmarks-server with the new bookmark field values
    
    If the PATCH request is successful, update the bookmark stored in context with the new values and redirect the user back to the list of bookmarks

Both the Bookmarks API and the Bookmarks App should take about 2 hours each. This assignment should take about 4 hours to complete in total. If you're having trouble, attend a Q&A session or reach out on Slack for help.
GET Requirements

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


POST / DELETE Requirements

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
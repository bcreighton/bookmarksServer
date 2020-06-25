Requirements

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
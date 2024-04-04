
Review API

# User Endpoints
# Create User

# POST /api/user/create

Request:
{
    "username": "",  // Required
    "email": "",     // Required
    "password": "",  // Required
    "roles": ["role1", "role2"]  // Required
}

Response:
{
    "success": boolean,
    "data": {
        "message": "User was registered successfully!"
    }
}
#  User Login

POST /api/user/login

Request:
{
    "username": "", // Required
    "password": ""  // Required
}

Response:
{
    "id": "",
    "username": "",
    "email": "",
    "roles": [
        "ROLE_"
    ],
    "accessToken": ""
}
#  User Attendance

GET /api/user/attended/:eventid

Request: None

Response:
{
    "success": boolean,
    "data": {
        "message": "user __username__ attended __eventid__"
    }
}
Event Endpoints
Create Event
vbnet
Copy code
POST /api/event/create

Request:
{
    "eventid": "", // Required
    "title": "",   // Optional
}

Response:
{
    "success": boolean,
    "data": {
        "message": "event __eventid__ created by organizer __user_name__ successfully",
    }
}
#  Event Summary

GET /api/event/summary/:eventid

Request: None

Response:
{
    "success": boolean,
    "data": {
        "message": "summarized reviews of __eventid__",
        "avg_registration_exp": [1 - 10],
        "avg_event_exp": [1-10],
        "avg_breakfast_exp": [1-10],
        "avg_overall_exp": [1-10],
    }
}
# Event Reviews

GET /api/event/reviews/:eventid/:page_number

Request: None

Response:
{
    "success": boolean,
    "data": {
        "message": "page 1/2/3 : reviews of __eventid__",
        "reviews": [
            { review_obj_1 },
            { review_obj_2 },
            { review_obj_3 },
        ]
    }
}
#  Review Endpoints
Submit Review

POST /api/review/submit/:eventid

Request:
{
    "registration_exp": [1 - 10],  // Required/Optional
    "event_exp": [1-10],           // Required/Optional
    "breakfast_exp": [1-10],       // Required/Optional
    "overall_exp": [1-10],         // Optional
    "comment": ""                  // Optional
}

Response:
{
    "success": boolean,
    "data": {
        "message": "",
        "reviewid": ""
    }
}
#  Like Review

GET /api/review/like/:reviewid

Request: None

Response:
{
    "success": boolean,
    "data": {
        "message": "review liked"
    }
}

# Report Review

GET /api/review/report/:reviewid

Request: None

Response:
{
    "success": boolean,
    "data": {
        "message": "review reported"
    }
}

# Respond to Review

POST /api/review/respond/:reviewid

Request:
{
    "organizer_response": ""  // Required
}

Response:
{
    "success": boolean,
    "data": {
        "message": "organizer's comment added"
    }
}